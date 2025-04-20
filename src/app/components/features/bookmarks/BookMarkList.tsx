import { fetchFolders, fetchBookmarksByFolder } from "@/app/lib/api/bookmark"
import BookmarkListClient from "@/app/components/features/bookmarks/BookmarkListClient"
import { BookMarkListProps } from "@/app/types/bookmark"

export default async function BookmarkList({ items, session }: BookMarkListProps) {
  /* フォルダー一覧だけサーバーで取得 */
  const { data: folders = [], error } = await fetchFolders(session)
  if (error) console.error(error)

  /* そのままクライアントへ渡す */
  return (
    <BookmarkListClient
      initialItems={items}
      folders={folders}
      session={session}
    />
  )
}
