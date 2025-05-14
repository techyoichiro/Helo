import { Suspense } from "react";
import ArticleList from "@/app/components/features/articles/ArticleList";
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper";
import { PageSEO } from "@/app/components/layouts/PageSEO";
import { isErrorResponse, TopicArticlesPageProps } from '@/app/types/article';
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/common/avatar";
import { fetchArticlesByTopic } from "@/app/lib/api/article";
import { Pagination } from "@/app/components/common/pagination";
import { createClient } from '@/app/lib/supabase/server';
import { fetchBookmarks } from '@/app/lib/api/bookmark';
import { BookmarkDTO } from '@/app/types/bookmark';

// キャッシュの設定
export const revalidate = 60; // 60秒間キャッシュ

export default async function TopicArticlesPage({ params, searchParams }: TopicArticlesPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const topic = decodeURIComponent(resolvedParams.id);
  const name = resolvedSearchParams.name ? decodeURIComponent(resolvedSearchParams.name) : undefined;
  const logo = resolvedSearchParams.logo;
  const page = Number(resolvedSearchParams.page) || 1;
  const perPage = 10;

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
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <ArticleListContent topic={topic} page={page} perPage={perPage} />
          </Suspense>
        </div>
      </ContentWrapper>
    </>
  );
}

async function ArticleListContent({ 
  topic, 
  page, 
  perPage 
}: { 
  topic: string;
  page: number;
  perPage: number;
}) {
  // 並列でデータを取得
  const [supabase, articlesOrError] = await Promise.all([
    createClient(),
    fetchArticlesByTopic(topic, page, perPage)
  ]);

  const { data: { session } } = await supabase.auth.getSession();
  let bookmarks: BookmarkDTO[] = [];

  // セッションがある場合のみブックマークを取得
  if (session?.access_token) {
    const { data } = await fetchBookmarks({ access_token: session.access_token });
    if (data) {
      bookmarks = data.bookmarks;
    }
  }

  if (isErrorResponse(articlesOrError)) {
    console.error(articlesOrError.error);
    return (
      <div className="py-20 text-center font-bold text-lg text-gray-600">
        入力されたトピックの記事がありませんでした
      </div>
    );
  }

  const totalPages = Math.ceil(articlesOrError.total / perPage);

  return (
    <>
      <ArticleList 
        items={articlesOrError.articles} 
        bookmarks={bookmarks}
        session={session}
      />
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl={`/search/${topic}`}
          />
        </div>
      )}
    </>
  );
}

