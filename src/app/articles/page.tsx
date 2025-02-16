import { Suspense } from "react"
import dynamic from "next/dynamic"
import { fetchTrendArticles } from "@/app/lib/api/article"
import { ArticleListSkeleton } from "@/app/components/features/articles/ArticleListSkeleton"

const ArticleList = dynamic(() => import("@/app/components/features/articles/ArticleList"), { ssr: true })

export default async function Articles() {
  const items = await fetchTrendArticles()

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
  )
}
