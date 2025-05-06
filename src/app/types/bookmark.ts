/* ──────────────────────────────
   1.  DB スキーマ由来の型
   ※ 直接 UI では使わない
──────────────────────────────── */
import { bookmarks, folders } from "@/server/db/schema"

export type BookmarkDB        = typeof bookmarks.$inferSelect
export type NewBookmark       = typeof bookmarks.$inferInsert

export type FolderDB          = typeof folders.$inferSelect
export type NewFolder         = typeof folders.$inferInsert

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
  items: BookmarkDTO[]
  session: SessionProp
}

export interface BookmarkCardProps {
    item:       BookmarkDTO
    session:    SessionProp
    folders:    FolderDTO[]
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

export interface RawBookmarkRow {
  id:           number
  user_id:      string
  folder_id:    number
  title:        string
  article_url:  string
  og_image_url: string | null
  published_at: string | null
  created_at:   string
}