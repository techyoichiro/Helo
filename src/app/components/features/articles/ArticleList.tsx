// src/app/components/features/articles/ArticleList.tsx
'use client'

import ArticleCard from '@/app/components/features/articles/ArticleCard'
import { ArticleListProps } from '@/app/types/article'

export default function ArticleList({ items }: ArticleListProps) {
  if (!Array.isArray(items)) {
    return (
      <div className="py-20 text-center font-bold text-lg text-red-500">
        {items.error}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center font-bold text-lg text-base-light">
        No posts yet
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-between">
      {items.map((item) => (
        <ArticleCard
          key={`${item.url}-${item.published_at}`}
          item={item}
          user={null}
          session={null}
        />
      ))}
    </div>
  )
}
