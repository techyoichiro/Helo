import { BookmarkCard } from "@/app/components/features/bookmarks/BookmarkCard"
import { BookMarkListProps } from "@/app/types/bookmark"

export default function BookMarkList({ items, session }: BookMarkListProps) {
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
        <BookmarkCard key={item.id} item={item} session={session} />
      ))}
    </div>
  )
}
