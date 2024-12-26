import { client } from '@/app/lib/hono';
import { ArticleResponse, ErrorResponse, Article } from '@/app/types/types';

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

