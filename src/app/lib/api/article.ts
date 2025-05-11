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
export async function fetchArticlesByTopic(
  topic: string,
  page: number = 1,
  perPage: number = 10
): Promise<ArticleResponseOrError> {
  try {
    const response = await client.api.articles[':topic'].$get({
      param: {
        topic: topic
      },
      query: {
        page: page.toString(),
        perPage: perPage.toString()
      }
    } as any);

    if (!response.ok) {
      return { error: 'Failed to fetch articles' };
    }

    const data = await response.json() as { articles: Article[], total: number };
    return {
      articles: data.articles,
      total: data.total
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
      console.error('Failed to fetch trend articles:', {
        status: response.status,
        statusText: response.statusText
      });
      return { error: 'Failed to fetch articles' };
    }

    const data = await response.json() as Article[];
    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return { error: 'Invalid response format' };
    }

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
   4. 新着記事
================================================================ */
export async function fetchLatestArticles(
  page: number = 1,
  perPage: number = 10
): Promise<ArticleResponseOrError> {
  try {
    const response = await client.api.articles.latest.$get({
      query: {
        page: page.toString(),
        perPage: perPage.toString()
      }
    } as any);
    
    if (!response.ok) {
      return { error: 'Failed to fetch articles' };
    }

    const data = await response.json() as { articles: Article[], total: number };
    return {
      articles: data.articles,
      total: data.total
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
