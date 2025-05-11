// src/app/components/features/articles/ArticleList.tsx
import { createClient }   from '@/app/lib/supabase/server'
import ArticleCard        from '@/app/components/features/articles/ArticleCard'
import { Article } from '@/app/types/article'

interface ArticleListProps {
  items: Article[] | { error: string } | undefined
}

export default async function ArticleList({ items }: ArticleListProps) {
  /* ────────── Supabase Server Client ────────── */
  const supabase = await createClient()

  /* 1. 認証ユーザー取得（リモート検証） */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!items) {
    return (
      <div className="py-20 text-center font-bold text-lg text-red-500">
        No articles found
      </div>
    )
  }

  if ('error' in items) {
    return (
      <div className="py-20 text-center font-bold text-lg text-red-500">
        {items.error}
      </div>
    )
  }

  /* ----- 一覧描画 ----- */
  return (
    <div className="flex flex-wrap justify-between">
      {items.map((item, index) => (
        <ArticleCard
          key={index}
          item={item}
          user={user ?? null}
          session={null}
        />
      ))}
    </div>
  )
}
