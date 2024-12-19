import { db } from "@/server/db"
import { bookmarks, folders, bookmarkFolders } from "@/server/db/schema"
import { zValidator } from "@hono/zod-validator"
import { createFactory } from 'hono/factory';
import { Hono } from "hono"
import { z } from "zod"
import { eq, and } from 'drizzle-orm'
import { authMiddleware, subscriptionMiddleware } from '@/app/lib/utils/auth'
import { Variables } from '@/app/lib/honoTypes'

const factory = createFactory()

export const getRouteAHandler = factory.createHandlers(
  zValidator('param', z.object({ id: z.string().transform(Number) })),
  async (c) => {
    const { id } = c.req.valid('param');
    return c.json({ id })
  }
)

export const bookmarkSchema = z.object({
  articleUrl: z.string().url(),
  ogImageUrl: z.string().url().optional(),
  folderId: z.number().optional(),
})

const paramSchema = z.object({
  id: z.string()
})

export const folderSchema = z.object({
  name: z.string().min(1).max(50),
})

const app = new Hono<{ Variables: Variables }>()

  .get('/', authMiddleware, subscriptionMiddleware, async (c) => {
    const userId = c.get('user').id
    const userBookmarks = await db.query.bookmarks.findMany({
      where: eq(bookmarks.userId, userId),
      orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)],
    })
    return c.json(userBookmarks)
  })

  .post('/', authMiddleware, subscriptionMiddleware, zValidator("json", bookmarkSchema), async (c) => {
    const { articleUrl, ogImageUrl, folderId } = c.req.valid("json")
    const user = c.get('user')
    const isSubscribed = c.get('isSubscribed')

    const userFolders = await db.select().from(folders).where(eq(folders.userId, user.id))
    if (!isSubscribed && userFolders.length >= 3 && folderId) {
      return c.json({ error: 'Folder limit reached for non-subscribed users' }, 403)
    }

    const [newBookmark] = await db.insert(bookmarks).values({
      userId: user.id,
      articleUrl,
      ogImageUrl,
    }).returning()

    if (folderId) {
      await db.insert(bookmarkFolders).values({
        bookmarkId: newBookmark.id,
        folderId,
      })
    }

    return c.json(newBookmark, 201)
  })

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

export default app

