import { Suspense } from "react"
import dynamic from "next/dynamic"
import { fetchTrendArticles } from "@/app/lib/api/article"

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

function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-video bg-gray-200 rounded-lg" />
      ))}
    </div>
  )
}
