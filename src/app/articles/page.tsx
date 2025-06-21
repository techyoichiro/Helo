import { fetchTrendArticles } from "@/app/lib/api/article"
import ArticleList from "@/app/components/features/articles/ArticleList"
import { isErrorResponse } from "@/app/types/article"
import { createClient } from '@/app/lib/supabase/server'
import { fetchBookmarks } from '@/app/lib/api/bookmark'
import { BookmarkDTO } from '@/app/types/bookmark'

export const dynamic = 'force-dynamic'

export default async function Articles() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const items = await fetchTrendArticles()
  let bookmarks: BookmarkDTO[] = []
  
  if (session?.access_token) {
    const { data } = await fetchBookmarks({ access_token: session.access_token })
    if (data) {
      bookmarks = data.bookmarks
    }
  }

  return (
    <div className="w-full">
      {isErrorResponse(items) ? (
        <div className="text-center py-10">
          <p className="text-red-500">{items.error}</p>
        </div>
      ) : (
        <ArticleList 
          items={items.articles} 
          bookmarks={bookmarks}
          session={session}
        />
      )}
    </div>
  )
}