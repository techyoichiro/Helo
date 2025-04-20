import { fetchFolders } from "@/app/lib/api/bookmark"
import BookmarkCard from "@/app/components/features/bookmarks/BookmarkCard"
import { BookMarkListProps } from "@/app/types/bookmark"

export default async function BookmarkList({ items, session }: BookMarkListProps) {
  /* サーバーでフォルダー一覧を取得 */
  const { data: folders = [], error } = await fetchFolders(session)
  if (error) console.error(error)

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
        <BookmarkCard
          key={item.id}
          item={item}
          session={session}
          folders={folders /* ★ 配列だけ渡す */}
        />
      ))}
    </div>
  )
}
