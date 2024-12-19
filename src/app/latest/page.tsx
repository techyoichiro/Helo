import { ContentWrapper } from '@/app/components/layouts/ContentWrapper';
import { client } from '../lib/hono';
import { Suspense } from 'react';
import { ArticleListSkeleton } from '../components/layouts/ArticleTabs';
import ArticleList from '../components/layouts/ArticleList';

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
        <Suspense fallback={<ArticleListSkeleton />}>
          {Array.isArray(items) ? (
            <ArticleList items={items} />
          ) : (
            <div className="text-center py-10">
              <p className="text-red-500">{items.error}</p>
            </div>
          )}
        </Suspense>
      </div>
    </ContentWrapper>
  );
}

