import { client } from '@/app/lib/hono/hono';
import { Article, ArticleResponseOrError } from '@/app/types/article';
import type { ApiResponse } from '@/app/types/common';

const REVALIDATE_TIME = 60;

/* ──────────────── 共通ヘッダ ──────────────── */
const auth = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/* ================================================================
   1. 記事一覧（ページネーション対応）
================================================================ */
export async function fetchArticles(
  page: number = 1,
  perPage: number = 12,
  session?: { access_token: string } | null,
): Promise<ApiResponse<Article[]>> {
  try {
    const query = {
      page: page.toString(),
      perPage: perPage.toString()
    }
    const res = await client.api.articles.$get(
      { query },
      session ? auth(session.access_token) : undefined
    )
    if (!res.ok) return fail(res)

    const data = await res.json() as Article[]
    return { data }
  } catch (err) {
    console.error(err)
    return { error: '記事の取得に失敗しました' }
  }
}

/* ================================================================
   2. トピック別記事一覧
================================================================ */
export async function fetchArticlesByTopic(topic: string): Promise<ArticleResponseOrError> {
  try {
    const response = await client.api.articles[':topic'].$get({
      param: {
        topic: topic
      }
    });

    if (!response.ok) {
      return { error: 'Failed to fetch articles' };
    }

    const data = await response.json() as Article[];
    return {
      articles: data,
      total: data.length
    };
  } catch (error) {
    console.error(`Failed to fetch articles for topic ${topic}:`, error);
    return { error: `Failed to fetch articles for topic ${topic}` };
  }
}

/* ================================================================
   3. トレンド記事
================================================================ */
export async function fetchTrendArticles(): Promise<ArticleResponseOrError> {
  try {
    const response = await client.api.articles.$get({
      next: { revalidate: REVALIDATE_TIME },
    });
    
    if (!response.ok) {
      return { error: 'Failed to fetch articles' };
    }

    const data = await response.json() as Article[];
    return {
      articles: data,
      total: data.length
    };
  } catch (error) {
    console.error('Error fetching trend articles:', error);
    return { error: 'Failed to fetch trend articles' };
  }
}

/* ================================================================
   4. 最新記事
================================================================ */
export async function fetchLatestArticles(): Promise<ArticleResponseOrError> {
  try {
    const response = await client.api.articles.latest.$get({
      next: { revalidate: REVALIDATE_TIME },
    });
    
    if (!response.ok) {
      return { error: 'Failed to fetch articles' };
    }

    const data = await response.json() as Article[];
    return {
      articles: data,
      total: data.length
    };
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return { error: 'Failed to fetch latest articles' };
  }
}

/* ================================================================
   ヘルパー関数
================================================================ */
async function fail(res: Response): Promise<{ error: string }> {
  let msg = 'Unexpected error'
  try {
    const json = await res.json()
    msg = json.error ?? msg
  } catch {}
  console.error('API error', res.status, msg)
  return { error: msg }
}
