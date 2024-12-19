import { Suspense } from "react";
import dynamic from 'next/dynamic';
import { client } from '@/app/lib/hono';

const ArticleList = dynamic(() => import('@/app/components/layouts/ArticleList'), { ssr: true });

const REVALIDATE_TIME = 60;

async function fetchArticles() {
    const response = await client.api.articles.$get({
        next: { revalidate: REVALIDATE_TIME },
    });
    if (response.ok) {
        const item = await response.json()
        return item;
    }
    if (response.status === 500) {
        const data = await response.json()
        console.log(`Failed to fetch articles`);
        return { error: `Failed to fetch articles. Please try again later.` };
    }
    return { error: 'An unexpected error occurred.' };
}

export default async function Articles() {
  const items = await fetchArticles();

  return (
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
  );
}

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-video bg-gray-200 rounded-lg" />
      ))}
    </div>
  );
}