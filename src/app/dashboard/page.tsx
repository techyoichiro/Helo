import { ScrollArea } from "@/app/components/elements/ui/scroll-area"
import BookMarkList from "@/app/components/layouts/BookMarkList"
import { fetchBookmarks } from "@/app/lib/api/bookmark"
import { createClient } from '@/app/lib/utils/supabase/server'

export default async function BookmarksPage() {
  
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">セッションの取得中にエラーが発生しました。</p>
      </div>
    )
  }
  const session = data.session
  if (!session) {
    console.log('BookmarksPage: No session found')
    return (
      <div className="text-center py-10">
        <p className="text-red-500">ブックマークを取得するにはログインが必要です</p>
      </div>
    )
  }

  const { data: bookmarks, error: bookmarksError } = await fetchBookmarks(session)

  if (bookmarksError) {
    console.error("Error fetching bookmarks:", bookmarksError)
    return (
      <div className="text-center py-10">
        <p className="text-red-500">ブックマークの取得中にエラーが発生しました。</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ブックマーク</h1>
      </div>
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="rounded-lg">
          <div className="p-4 text-muted-foreground">
            {!bookmarks ? (
              <p>読み込み中...</p>
            ) : bookmarks.length > 0 ? (
              <BookMarkList items={bookmarks} />
            ) : (
              <p>ブックマークがありません。</p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

