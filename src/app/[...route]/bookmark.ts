export const runtime = 'edge'

import { Hono } from 'hono'
import { z }    from 'zod'
import { zValidator } from '@hono/zod-validator'
import type { Env, AppState }   from '@/app/lib/utils/types'
import { authMiddleware }       from '@/app/lib/utils/auth'
import { fetchOgp }             from '@/app/lib/utils/fetchOgp'
import { supabaseAdmin }        from '@/app/lib/supabase/edge'

/* ─────────────── Zod スキーマ ─────────────── */
const bookmarkSchema = z.object({
  title:       z.string(),
  articleUrl:  z.string().url(),
  ogImageUrl:  z.string().url().optional(),
  publishedAt: z.string().refine((s) => !isNaN(Date.parse(s))),
  folderId:    z.number().int().positive().nullable(),
})
const urlOnlySchema = z.object({
  url:      z.string().url(),
  folderId: z.number().int().positive().nullable().optional(),
})
const paramSchema   = z.object({ id: z.string().regex(/^\d+$/) })
const folderSchema  = z.object({ name: z.string().min(1).max(50) })
const folderIdParam = z.object({ folderId: z.string().regex(/^\d+$/) })
const bodySchema    = z.object({ name: z.string().min(1).max(50) })

const app = new Hono<{
  Env:       Env
  Variables: AppState
}>()


/* ---------- ブックマーク一覧 ---------- */
.get(
  '/',
  authMiddleware,
  async (c) => {
    const supabase = c.get('supabase')
    const userId   = c.get('user').id

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return c.json({ error: error.message }, 500)
    return c.json(data)
  }
)

/* ---------- ブックマーク追加 ---------- */
.post(
  '/',
  authMiddleware,
  zValidator('json', bookmarkSchema),
  async (c) => {
    const supabase = c.get('supabase')
    const body     = c.req.valid('json')
    const userId   = c.get('user').id

    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{
        user_id:      userId,
        folder_id:    body.folderId,
        title:        body.title,
        article_url:  body.articleUrl,
        og_image_url: body.ogImageUrl ?? null,
        published_at: new Date(body.publishedAt),
      }])
      .select()
      .single()

    if (error) return c.json({ error: error.message }, 500)
    return c.json(data, 201)
  }
)

/* ---------- ブックマーク削除 ---------- */
.delete(
  '/:id',
  authMiddleware,
  zValidator('param', paramSchema),
  async (c) => {
    const supabase = c.get('supabase')
    const { id }   = c.req.valid('param')
    const userId   = c.get('user').id

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) return c.json({ error: error.message }, 500)
    return c.json({ deletedId: Number(id) })
  }
)

/* ---------- フォルダ作成 ---------- */
.post(
  '/folders',
  authMiddleware,
  zValidator('json', folderSchema),
  async (c) => {
    const supabase   = c.get('supabase')
    const { name }   = c.req.valid('json')
    const user       = c.get('user')
    const subscribed = c.get('isSubscribed')

    const { count } = await supabase
      .from('folders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (!subscribed && (count ?? 0) >= 3) {
      return c.json({ error: 'Folder limit reached' }, 403)
    }

    const { data, error } = await supabase
      .from('folders')
      .insert([{ user_id: user.id, name }])
      .select()
      .single()

    if (error) return c.json({ error: error.message }, 500)
    return c.json(data, 201)
  }
)

/* ---------- フォルダ一覧 ---------- */
.get('/folders', authMiddleware, async (c) => {
  const supabase = c.get('supabase')
  const userId = c.get('user').id
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId)

  if (error) return c.json({ error: error.message }, 500)
  return c.json(data)
})

/* ---------- ブックマークをフォルダへ移動 ---------- */
.post(
  '/folders/:folderId/bookmarks',
  authMiddleware,
  zValidator('param', folderIdParam),
  zValidator('json', z.object({ bookmarkId: z.number() })),
  async (c) => {
    const supabase = c.get('supabase')
    const { folderId }   = c.req.valid('param')
    const { bookmarkId } = c.req.valid('json')
    const userId         = c.get('user').id

    /* 自分のフォルダかチェック */
    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('id', folderId)
      .eq('user_id', userId)
      .single()
    if (!folder) return c.json({ error: 'Folder not found' }, 404)

    /* ブックマークも自分のものか？ */
    const { data: bk } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('id', bookmarkId)
      .eq('user_id', userId)
      .single()
    if (!bk) return c.json({ error: 'Bookmark not found' }, 404)

    /* 移動（folder_id を更新） */
    const { error } = await supabase
      .from('bookmarks')
      .update({ folder_id: Number(folderId) })
      .eq('id', bookmarkId)

    if (error) return c.json({ error: error.message }, 500)
    return c.json({ moved: true })
  }
)

/* ---------- フォルダ削除 ---------- */
/* FK が ON DELETE CASCADE のためブックマークも同時削除 */
.delete(
  '/folders/:id',
  authMiddleware,
  // subscriptionMiddleware,
  zValidator('param', paramSchema),
  async (c) => {
    const supabase = c.get('supabase')
    const folderId = Number(c.req.valid('param').id)
    const userId   = c.get('user').id

    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId)
      .eq('user_id', userId)

    if (error) return c.json({ error: error.message }, 500)
    return c.json({ deletedId: folderId })
  }
)

/* ---------- URL だけでブックマーク追加 ---------- */
.post(
  '/url',
  authMiddleware,
  zValidator('json', urlOnlySchema),
  async (c) => {
    const supabase = c.get('supabase')
    const { url, folderId } = c.req.valid('json')
    const user              = c.get('user')

    const { data: inserted, error } = await supabase
      .from('bookmarks')
      .insert([{ 
        user_id: user.id, 
        folder_id: folderId ?? null, 
        article_url: url, 
        title: 'タイトル' 
      }])
      .select()
      .single()
    console.log(user.id)
    if (error) return c.json({ error: error.message }, 500)

    /* OGP 取得を非同期で */
    setTimeout(async () => {
      try {
        const { title, ogImage } = await fetchOgp(url)
        if (!ogImage) {
          await supabaseAdmin
            .from('bookmarks')
            .update({ title })
            .eq('id', inserted.id)
          return
        }
        /* 画像アップロード（略：前回回答と同じ） */
      } catch (err) {
        console.error('OGP fetch/upload failed:', err)
      }
    }, 0)

    return c.json(inserted, 201)
  }
)

/* ---------- フォルダ配下ブックマーク一覧 ---------- */
.get(
  '/folders/:folderId/bookmarks',
  authMiddleware,
  zValidator('param', folderIdParam),
  async (c) => {
    const supabase = c.get('supabase')
    const folderId = Number(c.req.valid('param').folderId)
    const userId   = c.get('user').id

    /* フォルダ所有チェック */
    const { data: folder } = await supabase
      .from('folders')
      .select('id')
      .eq('id', folderId)
      .eq('user_id', userId)
      .single()
    if (!folder) return c.json({ error: 'Folder not found' }, 404)

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('folder_id', folderId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return c.json({ error: error.message }, 500)
    return c.json(data)
  }
)

/* ---------- ブックマーク数 ---------- */
.get('/count', authMiddleware, async (c) => {
  const supabase = c.get('supabase')
  const userId = c.get('user').id
  const { count, error } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) return c.json({ error: error.message }, 500)
  return c.json({ count: count ?? 0 })
})

/* ---------- フォルダ名変更 ---------- */
.put(
  '/folders/:id',
  authMiddleware,
  zValidator('param', paramSchema),
  zValidator('json', bodySchema),
  async (c) => {
    const supabase = c.get('supabase')
    const folderId = Number(c.req.valid('param').id)
    const { name } = c.req.valid('json')
    const userId   = c.get('user').id

    const { data, error } = await supabase
      .from('folders')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', folderId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) return c.json({ error: error.message }, 500)
    if (!data) return c.json({ error: 'Folder not found' }, 404)
    return c.json(data)
  }
)

export default app
