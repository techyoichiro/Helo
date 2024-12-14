import { Suspense } from "react";
import dynamic from 'next/dynamic';
import { fetcher } from '@/app/lib/utils';
import { client } from '@/app/lib/hono';
import { Article } from '@/app/types/types';

const ArticleList = dynamic(() => import('./ArticleList'), { ssr: true });

type ArticleResponse = Article[] | { error: string };

const REVALIDATE_TIME = 60;

async function fetchArticles(type: 'trending' | 'latest'): Promise<ArticleResponse> {
  try {
    const url = type === 'trending' ? client.api.articles.$url() : client.api.articles.latest.$url();
    
    const response = await fetcher<Article[]>(url.href, {
      next: { revalidate: REVALIDATE_TIME },
    });
    return response;
  } catch (error) {
    console.error(`Failed to fetch ${type} articles:`, error);
    return { error: `Failed to fetch ${type} articles. Please try again later.` };
  }
}

interface TabsProps {
  activeTab: 'trending' | 'latest';
  page: number;
}

export default async function ArticleTabs({ activeTab, page }: TabsProps) {
  const items = await fetchArticles(activeTab);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <nav className="flex items-center justify-between py-4 mb-6">
        <div className="flex space-x-2">
          {['trending', 'latest'].map((tab) => (
            <a
              key={tab}
              href={`?tab=${tab}`}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </a>
          ))}
        </div>
      </nav>
      <Suspense fallback={<ArticleListSkeleton />}>
        {Array.isArray(items) ? (
          <ArticleList items={items} page={page} />
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

