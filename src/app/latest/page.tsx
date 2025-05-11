import { Suspense } from "react";
import ArticleList from "@/app/components/features/articles/ArticleList";
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper";
import { PageSEO } from "@/app/components/layouts/PageSEO";
import { isErrorResponse } from '@/app/types/article';
import { fetchLatestArticles } from "@/app/lib/api/article";
import { Pagination } from "@/app/components/common/pagination";
import { createClient } from '@/app/lib/supabase/server';
import { fetchBookmarks } from '@/app/lib/api/bookmark';
import { BookmarkDTO } from '@/app/types/bookmark';
import { Tabs } from "@/app/components/layouts/Tabs";

const tabItems = [
  { href: "/", title: "トレンド" },
  { href: "/latest", title: "新着" },
];

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ [key: string]: string }>
}

export default async function LatestArticlesPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const perPage = 10;

  return (
    <>
      <PageSEO
        title="Latest Articles"
        description="Browse the latest articles from Zenn and Qiita"
        path="/latest"
      />

      <ContentWrapper>
        <div className="py-10">
          <Tabs items={tabItems} className="mb-6" />
          <Suspense
            fallback={
              <div className="space-y-6">
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
            <LatestArticlesContent page={page} perPage={perPage} />
          </Suspense>
        </div>
      </ContentWrapper>
    </>
  );
}

async function LatestArticlesContent({ 
  page, 
  perPage 
}: { 
  page: number;
  perPage: number;
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const articlesOrError = await fetchLatestArticles(page, perPage);
  let bookmarks: BookmarkDTO[] = []

  if (session?.access_token) {
    const { data } = await fetchBookmarks({ access_token: session.access_token })
    if (data) {
      bookmarks = data.bookmarks
    }
  }

  if (isErrorResponse(articlesOrError)) {
    console.error(articlesOrError.error);
    return (
      <div className="py-20 text-center font-bold text-lg text-red-500">
        {articlesOrError.error}
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
            baseUrl="/latest"
          />
        </div>
      )}
    </>
  );
}
