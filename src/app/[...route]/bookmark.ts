import { Hono } from "hono"
import { createFactory } from "hono/factory"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { and, eq, sql, exists } from "drizzle-orm"

import { db } from "@/server/db"
import { bookmarks, folders, bookmarkFolders } from "@/server/db/schema"

import { authMiddleware, subscriptionMiddleware } from "@/app/lib/utils/auth"
import { Variables } from "@/app/lib/hono/honoTypes"
import { fetchOgp } from "@/app/lib/utils/fetchOgp"
import { createClient } from "@/app/lib/supabase/server"

/* ──────────────────────────────
   Zod スキーマ
──────────────────────────────── */
const bookmarkSchema = z.object({
  title:       z.string(),
  articleUrl:  z.string().url(),
  ogImageUrl:  z.string().url().optional(),
  publishedAt: z.string().refine((s) => !isNaN(Date.parse(s))),
  folderId:    z.number().optional(),
})

const urlOnlySchema = z.object({
  url: z.string().url(),
})

const paramSchema = z.object({
  id: z.string(),
})

const folderSchema = z.object({
  name: z.string().min(1).max(50),
})

/* ──────────────────────────────
   Hono app
──────────────────────────────── */
const app = new Hono<{ Variables: Variables }>()

/* ---------- ブックマーク一覧 ---------- */
.get("/", authMiddleware, subscriptionMiddleware, async (c) => {
  try {
    const userId = c.get("user").id
    const list = await db.query.bookmarks.findMany({
      where: eq(bookmarks.userId, userId),
      orderBy: (b, { desc }) => [desc(b.createdAt)],
    })
    return c.json(list)
  } catch (err) {
    console.error(err)
    return c.json({ error: "Failed to get bookmarks" }, 500)
  }
})

/* ---------- ブックマーク追加 ---------- */
.post(
  "/",
  authMiddleware,
  subscriptionMiddleware,
  zValidator("json", bookmarkSchema),
  async (c) => {
    const { title, articleUrl, ogImageUrl, publishedAt } = c.req.valid("json")
    const user = c.get("user")

    const [row] = await db
      .insert(bookmarks)
      .values({
        userId:     user.id,
        title,
        articleUrl,
        ogImageUrl,
        publishedAt: new Date(publishedAt),
      })
      .returning()

    return c.json(row, 201)
  }
)

/* ---------- ブックマーク削除 ---------- */
.delete(
  "/:id",
  authMiddleware,
  subscriptionMiddleware,
  zValidator("param", paramSchema),
  async (c) => {
    const { id } = c.req.valid("param")
    const userId = c.get("user").id

    const res = await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.id, Number(id)), eq(bookmarks.userId, userId)))
      .returning({ deletedId: bookmarks.id })

    if (!res.length) {
      return c.json({ error: "Bookmark not found" }, 404)
    }
    return c.json({ deletedId: res[0].deletedId })
  }
)

/* ---------- フォルダ作成 ---------- */
.post(
  "/folders",
  authMiddleware,
  zValidator("json", folderSchema),
  async (c) => {
    const { name } = c.req.valid("json")
    const user     = c.get("user")
    const subscribed = c.get("isSubscribed")

    const existing = await db
      .select()
      .from(folders)
      .where(eq(folders.userId, user.id))

    if (!subscribed && existing.length >= 3) {
      return c.json({ error: "Folder limit reached" }, 403)
    }

    const [row] = await db
      .insert(folders)
      .values({ userId: user.id, name })
      .returning()

    return c.json(row, 201)
  }
)

/* ---------- フォルダ一覧 ---------- */
.get("/folders", authMiddleware, async (c) => {
  const userId = c.get("user").id
  const rows = await db.select().from(folders).where(eq(folders.userId, userId))
  return c.json(rows)
})

/* ---------- フォルダにブックマーク追加 ---------- */
.post(
  "/folders/:folderId/bookmarks",
  authMiddleware,
  zValidator(
    "param",
    z.object({ folderId: z.string().transform(Number) })
  ),
  zValidator("json", z.object({ bookmarkId: z.number() })),
  async (c) => {
    const { folderId }   = c.req.valid("param")
    const { bookmarkId } = c.req.valid("json")

    /* 重複チェック */
    const dup = await db
      .select()
      .from(bookmarkFolders)
      .where(and(eq(bookmarkFolders.folderId, folderId), eq(bookmarkFolders.bookmarkId, bookmarkId)))

    if (dup.length) {
      return c.json({ error: "Already added" }, 409)
    }

    const [link] = await db
      .insert(bookmarkFolders)
      .values({ folderId, bookmarkId })
      .returning()

    return c.json(link, 201)
  }
)

/* ---------- フォルダ削除 ---------- */
.delete(
  "/folders/:id",
  authMiddleware,
  subscriptionMiddleware,
  zValidator("param", paramSchema),
  async (c) => {
    const { id } = c.req.valid("param")
    const userId = c.get("user").id

    const res = await db
      .delete(folders)
      .where(and(eq(folders.id, Number(id)), eq(folders.userId, userId)))
      .returning({ deletedId: folders.id })

    if (!res.length) return c.json({ error: "Folder not found" }, 404)
    return c.json({ deletedId: res[0].deletedId })
  }
)

/* ---------- ブックマーク追加 (URL だけ) ---------- */
.post(
  "/url",
  authMiddleware,
  subscriptionMiddleware,
  zValidator("json", urlOnlySchema),
  async (c) => {
    try {
      const { url } = c.req.valid("json")
      const user    = c.get("user")

      /* 1) 仮登録 */
      const [inserted] = await db
        .insert(bookmarks)
        .values({ userId: user.id, articleUrl: url, title: "タイトル", ogImageUrl: null })
        .returning()

      /* 2) 非同期で OGP 取得 & Storage アップロード */
      setTimeout(async () => {
        try {
          const { title, ogImage } = await fetchOgp(url)
          if (!ogImage) {
            await db.update(bookmarks).set({ title }).where(eq(bookmarks.id, inserted.id))
            return
          }

          const imgRes = await fetch(ogImage)
          if (!imgRes.ok) return
          const arrayBuffer = await imgRes.arrayBuffer()

          const supabase = await createClient()
          const fileName = `bookmark_${inserted.id}_${Date.now()}.jpg`
          const { error: upErr } = await supabase
            .storage
            .from("bookmark_ogp")
            .upload(fileName, new Blob([arrayBuffer]), { contentType: "image/jpeg" })
          if (upErr) return

          const { data: pub } = supabase.storage.from("bookmark_ogp").getPublicUrl(fileName)
          await db
            .update(bookmarks)
            .set({ title, ogImageUrl: pub?.publicUrl ?? null })
            .where(eq(bookmarks.id, inserted.id))
        } catch (err) {
          console.error("OGP fetch/upload failed:", err)
        }
      }, 0)

      return c.json(inserted, 201)
    } catch (err) {
      console.error(err)
      return c.json({ error: "Failed to add bookmark by URL" }, 500)
    }
  }
)

/* ---------- ブックマーク数 ---------- */
.get("/count", authMiddleware, async (c) => {
  const userId = c.get("user").id
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))

  return c.json({ count })
})

export default app
