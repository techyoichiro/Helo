import { Suspense } from "react";
import { notFound } from "next/navigation";
import ArticleList from "@/app/components/features/articles/ArticleList";
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper";
import { PageSEO } from "@/app/components/layouts/PageSEO";
import { isErrorResponse, TopicArticlesPageProps } from '@/app/types/article';
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/common/avatar";
import { fetchArticlesByTopic } from "@/app/lib/api/article";

export default async function TopicArticlesPage({ params, searchParams }: TopicArticlesPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const topic = resolvedParams.id;
  const name = resolvedSearchParams.name;
  const logo = resolvedSearchParams.logo;
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

