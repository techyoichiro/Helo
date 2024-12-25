import { User as AuthUser } from '@supabase/auth-helpers-nextjs';
import { users, bookmarks, folders, bookmarkFolders, subscriptionStatusEnum } from '@/server/db/schema';

// Drizzle ORMのスキーマから型を推論
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;

export type Folder = typeof folders.$inferSelect;
export type NewFolder = typeof folders.$inferInsert;

export type BookmarkFolder = typeof bookmarkFolders.$inferSelect;
export type NewBookmarkFolder = typeof bookmarkFolders.$inferInsert;

// サブスクリプション状態の型
export type SubscriptionStatus = typeof subscriptionStatusEnum.enumValues[number];

// 認証ユーザー情報とデータベースユーザー情報を統合した型
export type CombinedUser = Omit<AuthUser, 'id'> & User & {
  user_metadata?: {
    fullName?: string;
    avatarUrl?: string;
  };
};

export interface Article {
  title: string;
  url: string;
  published_at: string;
  og_image_url: string | undefined;
  topics: string[];
}

export interface ErrorResponse {
  error: string;
}

export function isErrorResponse(response: ArticleResponse): response is ErrorResponse {
  return 'error' in response;
}

export type ArticleResponse = Article[] | ErrorResponse;

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export interface ArticleListProps {
  items: Article[] | { error: string };
  page?: number;
  itemsPerPage?: number;
}

export interface QiitaTag {
  name: string;
  versions: string[];
}

export interface QiitaItem {
  id: string;
  title: string;
  created_at: string;
  url: string;
  tags: QiitaTag[];
}

export interface OGPResponse {
  urls: string[];
  error?: string;
}

export interface RawBookmark {
  id: number
  title: string
  articleUrl: string
  ogImageUrl: string | null
  createdAt: string
  publishedAt: string
  userId: string
}