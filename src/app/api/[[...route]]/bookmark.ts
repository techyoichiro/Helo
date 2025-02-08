import { db } from "@/server/db"
import { bookmarks, folders, bookmarkFolders } from "@/server/db/schema"
import { zValidator } from "@hono/zod-validator"
import { createFactory } from 'hono/factory';
import { Hono } from "hono"
import { z } from "zod"
import { eq, and } from 'drizzle-orm'
import { authMiddleware, subscriptionMiddleware } from '@/app/lib/utils/auth'
import { Variables } from '@/app/lib/hono/honoTypes'
import { fetchOgp } from "@/app/lib/utils/fetchOgp" 

const factory = createFactory()

export const getRouteAHandler = factory.createHandlers(
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  async (c) => {
    const { id } = c.req.valid('param');
    return c.json({ id })
  }
)

export const bookmarkSchema = z.object({
  title: z.string(),
  articleUrl: z.string().url(),
  ogImageUrl: z.string().url().optional(),
  publishedAt: z.string().refine((dateString) => !isNaN(Date.parse(dateString)), {
    message: "Invalid date format",
  }),
  folderId: z.number().optional(),
});

export const urlOnlySchema = z.object({
  url: z.string().url(),
})

const paramSchema = z.object({
  id: z.string()
})

export const folderSchema = z.object({
  name: z.string().min(1).max(50),
})

const app = new Hono<{ Variables: Variables }>()

  // ブックマーク一覧取得
  .get('/', authMiddleware, subscriptionMiddleware, async (c) => {
    try {
      const userId = c.get('user').id
      const userBookmarks = await db.query.bookmarks.findMany({
        where: eq(bookmarks.userId, userId),
        orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)],
      })
      return c.json(userBookmarks)
    } catch (error) {
      console.error('Error getting bookmark:', error)
      return c.json({ error: 'Failed to getting bookmark' }, 500)
    }
  })

  // ブックマーク追加
  .post('/', authMiddleware, subscriptionMiddleware, zValidator("json", bookmarkSchema), async (c) => {
    const { title, articleUrl, ogImageUrl, publishedAt } = c.req.valid("json")
    const user = c.get('user')

    // `publishedAt` を Date 型に変換
    const publishedAtDate = new Date(publishedAt)

    // ブックマークをデータベースに挿入
    const [newBookmark] = await db.insert(bookmarks).values({
      userId: user.id,
      title,
      articleUrl,
      ogImageUrl,
      publishedAt: publishedAtDate,
    }).returning()

    return c.json(newBookmark, 201)
  })

  // ブックマーク削除
  .delete('/:id', authMiddleware, subscriptionMiddleware, zValidator('param', paramSchema), async (c) => {
    const { id } = c.req.valid('param')
    const userId = c.get('user').id
    try {
      const result = await db.delete(bookmarks)
        .where(and(
          eq(bookmarks.id, parseInt(id)),
          eq(bookmarks.userId, userId)
        ))
        .returning({ deletedId: bookmarks.id })

      if (result.length === 0) {
        return c.json({ error: 'Bookmark not found or already deleted' }, 404)
      }

      return c.json({ message: 'Bookmark deleted successfully', deletedId: result[0].deletedId }, 200)
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      return c.json({ error: 'Failed to delete bookmark' }, 500)
    }
  })

  // フォルダー作成
  .post('/folders', zValidator("json", folderSchema), async (c) => {
    const { name } = c.req.valid("json")
    const user = c.get('user')
    const isSubscribed = c.get('isSubscribed')

    const userFolders = await db.select().from(folders).where(eq(folders.userId, user.id))

    if (!isSubscribed && userFolders.length >= 3) {
      return c.json({ error: 'Folder limit reached for non-subscribed users' }, 403)
    }

    const [newFolder] = await db.insert(folders).values({
      userId: user.id,
      name,
    }).returning()

    return c.json(newFolder, 201)
  })

  // フォルダー取得
  .get('/folders/:id/bookmarks', async (c) => {
    const folderId = c.req.param('id')
    const userId = c.get('user').id

    const folderBookmarks = await db
      .select({
        id: bookmarks.id,
        articleUrl: bookmarks.articleUrl,
        ogImageUrl: bookmarks.ogImageUrl,
        createdAt: bookmarks.createdAt,
      })
      .from(bookmarkFolders)
      .innerJoin(bookmarks, eq(bookmarkFolders.bookmarkId, bookmarks.id))
      .where(and(
        eq(bookmarkFolders.folderId, parseInt(folderId)),
        eq(bookmarks.userId, userId)
      ))

    return c.json(folderBookmarks)
  })

  // フォルダー削除

  // URLでブックマークを追加
  .post('/url', authMiddleware, subscriptionMiddleware, zValidator("json", urlOnlySchema), async (c) => {
      try {
        const { url } = c.req.valid("json")
        const user = c.get("user")
  
        // DBにURLを挿入
        const [inserted] = await db.insert(bookmarks).values({
          userId: user.id,
          articleUrl: url,
          title: "タイトル",          // 仮タイトル
          ogImageUrl: null,          // 後で更新
        }).returning()
  
        // ---- [非同期] ----
        // レスポンス返却後にバックグラウンドでOGP取得してDB更新
        setTimeout(async () => {
          try {
            const { title, ogImage } = await fetchOgp(url)
  
            // DBの該当レコードを更新
            await db.update(bookmarks)
              .set({
                title,
                ogImageUrl: ogImage || null,
              })
              .where(eq(bookmarks.id,inserted.id))
          } catch (error) {
            console.error("Failed to fetch OGP in background:", error)
            // 実運用ではリトライキューを登録するなど
          }
        }, 0)
        
        return c.json(inserted, 201)
      } catch (error) {
        console.error("Error adding bookmark (fast OGP):", error)
        return c.json({ error: "Failed to add bookmark by URL" }, 500)
      }
    }
  )
  

export default app

