import { Suspense } from "react";
import { notFound } from "next/navigation";
import ArticleList from "@/app/components/layouts/ArticleList";
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper";
import { PageSEO } from "@/app/components/layouts/PageSEO";
import { fetcher } from '@/app/lib/utils';
import { client } from '@/app/lib/hono';
import { Article } from '@/app/types/types';

type ArticleResponse = Article[] | { error: string };

const REVALIDATE_TIME = 60;

async function fetchArticlesByTopic(topic: string): Promise<ArticleResponse> {
  try {
    const url = client.api.articles.$url({ query: { topic } });
    const response = await fetcher<Article[]>(url.href, {
      next: {
        revalidate: REVALIDATE_TIME,
      },
    });
    return response;
  } catch (error) {
    console.error(`Failed to fetch articles for topic ${topic}:`, error);
    return { error: `Failed to fetch articles for topic ${topic}` };
  }
}

interface TopicArticlesPageProps {
  params: { id: string };
  searchParams: { page?: string };
}

export default async function TopicArticlesPage({ params, searchParams }: TopicArticlesPageProps) {
  const { id: topic } = await params;
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;
  const articles = await fetchArticlesByTopic(topic);

  if ('error' in articles) {
    notFound();
  }

  return (
    <>
      <PageSEO
        title={`Articles about ${topic}`}
        description={`Browse the latest articles about ${topic}`}
        path={`/search/${topic}`}
      />

      <ContentWrapper>
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-6">Articles about {topic}</h1>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg aspect-video" />
                ))}
              </div>
            }
          >
            <ArticleList items={articles} page={pageNumber} />
          </Suspense>
        </div>
      </ContentWrapper>
    </>
  );
}
