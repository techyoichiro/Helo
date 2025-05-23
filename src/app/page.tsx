// app/page.tsx （親）
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper"
import { PageSEO } from "@/app/components/layouts/PageSEO"
import { Tabs } from "@/app/components/layouts/Tabs"
import { config } from "@/app/site.config"
import Articles from "@/app/articles/page"
import BookList from "@/app/components/features/books/BookList"

const tabItems = [
  { href: "/", title: "トレンド" },
  { href: "/latest", title: "新着" },
]

export default async function Home() {
  return (
    <div>
      <PageSEO
        title={config.siteMeta.title}
        description={config.siteMeta.description}
        path="/"
        removeSiteNameFromTitle={true}
      />

      <section className="py-6">
        <ContentWrapper>
          {/* タブ */}
          <Tabs items={tabItems} className="mb-4" />
          {/* 記事一覧*/}
          <Articles />
          {/* 書籍一覧 */}
          <BookList />
        </ContentWrapper>
      </section>
    </div>
  )
}
