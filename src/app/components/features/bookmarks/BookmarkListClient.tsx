"use client"

import { useState, useEffect } from "react"
import BookmarkCard from "@/app/components/features/bookmarks/BookmarkCard"
import {
  FolderDTO,
  BookmarkDTO,
  SessionProp,
} from "@/app/types/bookmark"
import { fetchBookmarksByFolder } from "@/app/lib/api/bookmark"
import BookmarkFolderCombo from "@/app/components/features/bookmarks/BookmarkFolderCombo.client"

interface Props {
  initialItems: BookmarkDTO[]
  folders: FolderDTO[]
  session: SessionProp
}

export default function BookmarkListClient({
  initialItems,
  folders,
  session,
}: Props) {
  const [items, setItems] = useState<BookmarkDTO[]>(initialItems)
  const [selected, setSelected] = useState<FolderDTO | null>(null)

  /* フォルダーが切り替わったら取得し直す */
  useEffect(() => {
    if (!selected) {
      setItems(initialItems) // 「すべて」
    } else {
      ;(async () => {
        const res = await fetchBookmarksByFolder(session, selected.id)
        if (res.data) setItems(res.data)
      })()
    }
  }, [selected, initialItems, session])

  return (
    <>
      {/* -------- フォルダ選択コンボボックス -------- */}
      <div className="mb-4">
        <BookmarkFolderCombo folders={folders} onSelect={setSelected} />
      </div>

      {/* -------- ブックマーク一覧 -------- */}
      {items.length === 0 ? (
        <div className="py-20 text-center font-bold text-lg text-base-light">
          ブックマークがありません
        </div>
      ) : (
        <div className="flex flex-wrap justify-between">
          {items.map((bk) => (
            <BookmarkCard
              key={bk.id}
              item={bk}
              session={session}
              folders={folders}
            />
          ))}
        </div>
      )}
    </>
  )
}
