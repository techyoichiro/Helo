/* ──────────────────────────────
   1.  DB スキーマ由来の型
   ※ 直接 UI では使わない
──────────────────────────────── */
import { bookmarks, folders, bookmarkFolders } from "@/server/db/schema"

export type BookmarkDB        = typeof bookmarks.$inferSelect    // Date 型を含む
export type NewBookmark       = typeof bookmarks.$inferInsert

export type FolderDB          = typeof folders.$inferSelect
export type NewFolder         = typeof folders.$inferInsert

export type BookmarkFolderDB  = typeof bookmarkFolders.$inferSelect
export type NewBookmarkFolder = typeof bookmarkFolders.$inferInsert

/* ──────────────────────────────
   2.  API / UI に渡す DTO 型
   - 日付は string に変換
   - 不要な列 (userId, createdAt など) は省略
──────────────────────────────── */
export interface BookmarkDTO {
  id: number
  title: string
  articleUrl: string
  ogImageUrl: string | null
  publishedAt?: string | null
}

export interface FolderDTO {
  id: number
  name: string
}

/* ──────────────────────────────
   3.  セッション型 (共通)
──────────────────────────────── */
export interface SessionProp {
  access_token: string
}

/* ──────────────────────────────
   4.  コンポーネント用 Props
──────────────────────────────── */
export interface BookMarkListProps {
  items: BookmarkDTO[]      // ← DTO 配列だけ
  session: SessionProp
}

export interface BookmarkCardProps {
  item: BookmarkDTO
  session: SessionProp
}

export interface RawBookmark {
    id: number
    title: string
    articleUrl: string
    ogImageUrl: string | null
    createdAt: string
    publishedAt?: string | null
    userId: string
}