import type { Session } from '@supabase/supabase-js';
import { ErrorResponse } from './common'

export interface Article {
    title: string;
    url: string;
    published_at: string;
    og_image_url: string | undefined;
    topics: string[];
}

export interface ArticleListProps {
    items: Article[] | { error: string };
    itemsPerPage?: number;
}

export type ArticleResponse = Article[] | ErrorResponse;

export function isErrorResponse(response: ArticleResponse): response is ErrorResponse {
    return 'error' in response;
}

export interface ArticleCardProps {
    item: Article
    initialIsBookmarked?: boolean
    bookmarkId?: string
    session?: Session | null
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

export interface Topic {
    name: string;
    path: string;
    logoUrl: string;
}
  
export interface TrendProps {
    searchTerm: string;
}
  
// データベースの型定義
export interface IconRecord {
    name: string;
    path: string;
    url: string;
}

export interface TopicArticlesPageProps {
    params: Promise<{ id: string }>;
    searchParams: { page?: string; name?: string; logo?: string };
}

export interface TopicCardProps {
  name: string;
  path: string;
  logo: string;
}