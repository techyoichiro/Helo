import { bookmarks, folders, bookmarkFolders } from '@/server/db/schema';

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;

export type BookmarkFolder = typeof bookmarkFolders.$inferSelect;
export type NewBookmarkFolder = typeof bookmarkFolders.$inferInsert;


export interface RawBookmark {
    id: number
    title: string
    articleUrl: string
    ogImageUrl: string | null
    createdAt: string
    publishedAt?: string | null
    userId: string
}

export type BookMarkListProps = {
    items: Bookmark[];
};