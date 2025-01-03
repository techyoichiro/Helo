import { ContentWrapper } from '@/app/components/layouts/ContentWrapper';
import { client } from '@/app/lib/hono';
import { Suspense } from 'react';
import ArticleList from '@/app/components/features/articles/ArticleList';

async function fetchArticles() {
  const REVALIDATE_TIME = 60;
  try {
    const response = await client.api.articles.latest.$get({
      next: { revalidate: REVALIDATE_TIME },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch articles');
  } catch (error) {
    console.error('Error fetching articles:', error);
    return { error: 'Failed to fetch articles. Please try again later.' };
  }
}

export default async function Page() {
  const items = await fetchArticles();

  return (
    <ContentWrapper>
      <div className="w-full max-w-4xl">
        {Array.isArray(items) ? (
          <ArticleList items={items} />
        ) : (
          <div className="text-center py-10">
            <p className="text-red-500">{items.error}</p>
          </div>
          )}
      </div>
    </ContentWrapper>
  );
}

