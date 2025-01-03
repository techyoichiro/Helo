import BookMarkList from "@/app/components/features/bookmarks/BookMarkList"
import { fetchBookmarks } from "@/app/lib/api/bookmark"
import { createClient } from '@/app/lib/supabase/server'

export default async function BookmarksPage() {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">ユーザー情報の取得中にエラーが発生しました。</p>
      </div>
    )
  }

  const user = userData.user
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">セッションの取得中にエラーが発生しました。</p>
      </div>
    )
  }

  const session = sessionData.session

  if (!user || !session?.access_token) {
    console.log('BookmarksPage: No valid session found')
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

      <div className="h-[calc(100vh-6rem)]">
        <div className="py-4">
          {!bookmarks ? (
            <p>読み込み中...</p>
          ) : bookmarks.length > 0 ? (
            <BookMarkList items={bookmarks} />
          ) : (
            <p className="text-center">ブックマークがありません。</p>
          )}
        </div>
      </div>
    </div>
  )
}
