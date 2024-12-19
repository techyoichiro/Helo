import { Suspense } from "react";
import { notFound } from "next/navigation";
import ArticleList from "@/app/components/layouts/ArticleList";
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper";
import { PageSEO } from "@/app/components/layouts/PageSEO";
import { client } from '@/app/lib/hono';
import { Article, ArticleResponse, ErrorResponse, isErrorResponse } from '@/app/types/types';
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/elements/ui/avatar";

const REVALIDATE_TIME = 60;

async function fetchArticlesByTopic(topic: string): Promise<ArticleResponse> {
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

interface TopicArticlesPageProps {
  params: { id: string };
  searchParams: { page?: string; name?: string; logo?: string };
}

export default async function TopicArticlesPage({ params, searchParams }: TopicArticlesPageProps) {
  const { id: topic } = await params;
  const { name, logo } = await searchParams;
  const articlesOrError = await fetchArticlesByTopic(topic);

  if (isErrorResponse(articlesOrError)) {
    console.error(articlesOrError.error);
    notFound();
  }

  const articles = articlesOrError;

  return (
    <>
      <PageSEO
        title={`Articles about ${name || topic}`}
        description={`Browse the latest articles about ${name || topic}`}
        path={`/search/${topic}`}
      />

      <ContentWrapper>
        <div className="py-10">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={logo} alt={`${name || topic} logo`} />
              <AvatarFallback>{name?.[0] || topic[0]}</AvatarFallback>
            </Avatar>
            <h1 className="text-4xl font-bold">{name || topic}</h1>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg aspect-video" />
                ))}
              </div>
            }
          >
            <ArticleList items={articles} />
          </Suspense>
        </div>
      </ContentWrapper>
    </>
  );
}

