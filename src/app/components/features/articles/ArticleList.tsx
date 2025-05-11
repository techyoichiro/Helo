// src/app/components/features/articles/ArticleList.tsx
import ArticleCard from '@/app/components/features/articles/ArticleCard'
import { Article } from '@/app/types/article'
import { Session } from '@supabase/supabase-js'
import { BookmarkDTO } from '@/app/types/bookmark'

interface ArticleListProps {
  items: Article[] | { error: string } | undefined
  bookmarks?: BookmarkDTO[]
  session: Session | null
}

export default function ArticleList({ items, bookmarks = [], session }: ArticleListProps) {
  if (!items || 'error' in items) {
    return null
  }

  return (
    <div className="flex flex-wrap justify-between">
      {items.map((item) => {
        const bookmark = bookmarks.find(b => b.articleUrl === item.url)
        return (
          <ArticleCard
            key={item.url}
            item={item}
            initialIsBookmarked={!!bookmark}
            bookmarkId={bookmark?.id.toString()}
            session={session}
          />
        )
      })}
    </div>
  )
}
