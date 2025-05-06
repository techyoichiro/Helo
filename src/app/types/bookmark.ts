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
   2.  API レスポンス型
──────────────────────────────── */
export interface ApiResponse<T> {
  data?: T
  error?: string
}

/* ──────────────────────────────
   3.  DTO 型
──────────────────────────────── */
export interface BookmarkDTO {
  id: number
  title: string
  articleUrl: string
  ogImageUrl: string | null
  publishedAt: string | null
  createdAt: string
  folderId?: number | null
}

export interface FolderDTO {
  id: number
  name: string
}

/* ──────────────────────────────
   4.  Props 型
──────────────────────────────── */
export interface BookmarkCardProps {
  item: BookmarkDTO
  session: SessionProp
  folders: FolderDTO[]
  onBookmarkUpdate?: () => Promise<void>
  onBookmarkRemove?: (bookmarkId: number) => void
}

export interface BookMarkListProps {
  items: BookmarkDTO[]
  session: SessionProp
}

export interface FolderActionsProps {
  selected: FolderDTO | null
  folderList: FolderDTO[]
  setFolderList: (folders: FolderDTO[]) => void
  setSelected: (folder: FolderDTO | null) => void
  session: SessionProp
}

export interface BookmarkListClientProps {
  session: SessionProp
  folderList: FolderDTO[]
  setFolderList: (folders: FolderDTO[]) => void
  initialItems: BookmarkDTO[]
}

export interface ActionMenuProps {
  bookmarkId: number
  session: SessionProp
  folders: FolderDTO[]
  onBookmarkUpdate?: () => Promise<void>
}

/* ──────────────────────────────
   5. その他
──────────────────────────────── */
export type SessionProp = { access_token: string }

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
  id: number
  user_id: string
  folder_id: number
  title: string
  article_url: string
  og_image_url: string | null
  published_at: string | null
  created_at: string
}