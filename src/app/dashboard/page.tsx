// src/app/dashboard/bookmarks/page.tsx
import BookMarkList     from '@/app/components/features/bookmarks/BookMarkList'
import AddBookmarkForm  from '@/app/components/features/bookmarks/AddBookmarkForm'
import { fetchBookmarks } from '@/app/lib/api/bookmark'
import { createClient }   from '@/app/lib/supabase/server'

export default async function BookmarksPage() {
  /* ────────── Supabase (Server) ────────── */
  const supabase = await createClient()

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user) {
    return (
      <div className="py-10 text-center text-red-500">
        ログインが必要です
      </div>
    )
  }

  /* 2. アクセストークンを取得（Cookie から JWT を読むだけ） */
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()

  if (sessErr || !session?.access_token) {
    return (
      <div className="py-10 text-center text-red-500">
        セッションの取得に失敗しました
      </div>
    )
  }

  /* 3. Edge API からブックマークを取得 */
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

  /* ────────── UI ────────── */
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ブックマーク一覧</h1>

      {/* URL 直登録フォーム */}
      <AddBookmarkForm session={{ access_token: session.access_token }} />

      <div className="h-[calc(100vh-6rem)] py-4">
        {!bookmarks ? (
          <p>読み込み中...</p>
        ) : bookmarks.length > 0 ? (
          <BookMarkList
            items={bookmarks}
            session={{ access_token: session.access_token }}
          />
        ) : (
          <p className="text-center">ブックマークがありません。</p>
        )}
      </div>
    </div>
  )
}
