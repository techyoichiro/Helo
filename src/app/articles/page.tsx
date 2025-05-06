import { fetchTrendArticles } from "@/app/lib/api/article"
import ArticleList from "@/app/components/features/articles/ArticleList"
import { isErrorResponse } from "@/app/types/article"

export default async function Articles() {
  const items = await fetchTrendArticles()

  return (
    <div className="w-full">
      {isErrorResponse(items) ? (
        <div className="text-center py-10">
          <p className="text-red-500">{items.error}</p>
        </div>
      ) : (
        <ArticleList items={items.articles} />
      )}
    </div>
  )
}
