// src/app/components/features/articles/ArticleList.tsx
import { createClient }   from '@/app/lib/supabase/server'
import ArticleCard        from '@/app/components/features/articles/ArticleCard'
import { ArticleListProps } from '@/app/types/article'

export default async function ArticleList({ items }: ArticleListProps) {
  /* ────────── Supabase Server Client ────────── */
  const supabase = await createClient()

  /* 1. 認証ユーザー取得（リモート検証） */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  /* 2. access_token が必要な場合だけセッション取得 */
  const {
    data: { session },
  } = user ? await supabase.auth.getSession() : { data: { session: null } }

  /* ----- エラー表示 / 空表示 ----- */
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

  /* ----- 一覧描画 ----- */
  return (
    <div className="flex flex-wrap justify-between">
      {items.map((item, i) => (
        <ArticleCard
          key={`post-item-${i}`}
          item={item}
          user={user ?? null}
          session={session ?? null}
        />
      ))}
    </div>
  )
}
