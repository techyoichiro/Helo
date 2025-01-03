import { client } from '@/app/lib/hono/hono';
import { ArticleResponse, Article } from '@/app/types/article';
import { ErrorResponse } from '@/app/types/common';

export async function fetchArticlesByTopic(topic: string): Promise<ArticleResponse> {
  try {
    const response = await client.api.articles[':topic'].$get({
      param: {
        topic: topic
      }
    });

    const data = await response.json();

    if (response.status === 500 || 'error' in data) {
      return data as ErrorResponse;
    }

    return data as Article[];
  } catch (error) {
    console.error(`Failed to fetch articles for topic ${topic}:`, error);
    return { error: `Failed to fetch articles for topic ${topic}` };
  }
}

export async function fetchTrendArticles() {
  const REVALIDATE_TIME = 60;
  const response = await client.api.articles.$get({
    next: { revalidate: REVALIDATE_TIME },
  });
  
  if (response.ok) {
    const item = await response.json();
    return item;
  }
  
  if (response.status === 500) {
    console.log('Failed to fetch articles');
    return { error: 'Failed to fetch articles. Please try again later.' };
  }

  return { error: 'An unexpected error occurred.' };
}

