import { ContentWrapper } from '@/app/components/layouts/ContentWrapper';
import ArticleList from '@/app/components/features/articles/ArticleList';
import { Tabs } from "@/app/components/layouts/Tabs"
import { fetchLatestArticles } from '../lib/api/article';

export default async function Page() {
  const items = await fetchLatestArticles();
  const tabItems = [
    { href: "/", title: "トレンド" },
    { href: "/latest", title: "最新" },
  ]

  return (
    <ContentWrapper>
      {/* タブ */}
      <Tabs items={tabItems} className="mb-4" />
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

