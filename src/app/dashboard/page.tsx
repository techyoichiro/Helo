import dynamic from 'next/dynamic'
import { fetchBookmarks } from '@/app/lib/api/bookmark'
import { createClient } from '@/app/lib/supabase/server'

const BookMarkList = dynamic(() => import('@/app/components/features/bookmarks/BookMarkList'), {
  loading: () => <p>読み込み中...</p>
})

const AddBookmarkForm = dynamic(() => import('@/app/components/features/bookmarks/AddBookmarkForm'), {
  loading: () => <p>フォームを読み込み中...</p>
})

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: { session }, error: sessErr } = await supabase.auth.getSession()

  if (sessErr || !session?.access_token) {
    return (
      <div className="py-10 text-center text-red-500">
        ログインが必要です
      </div>
    )
  }

  const { data: bookmarks, error: bmErr } = await fetchBookmarks({
    access_token: session.access_token,
  })

  if (bmErr) {
    console.error(bmErr)
    return (
      <div className="py-10 text-center text-red-500">
        ブックマーク取得に失敗しました
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ブックマーク一覧</h1>

      <AddBookmarkForm session={{ access_token: session.access_token }} />

      <div className="h-[calc(100vh-6rem)] py-4">
        {!bookmarks ? (
          <p>読み込み中...</p>
        ) : bookmarks.bookmarks.length > 0 ? (
          <BookMarkList
            items={bookmarks.bookmarks}
            session={{ access_token: session.access_token }}
          />
        ) : (
          <p className="text-center">ブックマークがありません。</p>
        )}
      </div>
    </div>
  )
}
