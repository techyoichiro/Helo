'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { BookmarkDTO, FolderDTO, SessionProp } from '@/app/types/bookmark'
import { fetchBookmarks, fetchBookmarksByFolder, fetchFolders } from '@/app/lib/api/bookmark'
import BookmarkCard from './BookmarkCard'

const FolderActions = dynamic(() => import('./FolderActions'), { ssr: false })

interface BookmarkListClientProps {
  session: SessionProp
  initialItems: BookmarkDTO[]
}

export default function BookmarkListClient({
  session,
  initialItems,
}: BookmarkListClientProps) {
  const [selected, setSelected] = useState<FolderDTO | null>(null)
  const [bookmarks, setBookmarks] = useState<BookmarkDTO[]>(initialItems)
  const [folderList, setFolderList] = useState<FolderDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFolders = async () => {
      const { data: folders = [] } = await fetchFolders(session)
      setFolderList(folders)
    }
    loadFolders()
  }, [session])

  useEffect(() => {
    const fetchBookmarksData = async () => {
      setLoading(true)
      let result
      if (selected) {
        result = await fetchBookmarksByFolder(session, selected.id)
      } else {
        result = await fetchBookmarks(session)
      }
      if (result.error) return
      setBookmarks(result.data ?? [])
      setLoading(false)
    }

    fetchBookmarksData()
  }, [session, selected])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          value={selected?.id ?? ''}
          onChange={(e) => {
            const folder = folderList.find((f) => f.id === Number(e.target.value))
            setSelected(folder ?? null)
          }}
          className="rounded-md border px-3 py-2"
        >
          <option value="">すべてのブックマーク</option>
          {folderList.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>

        <FolderActions
          selected={selected}
          folderList={folderList}
          setFolderList={setFolderList}
          setSelected={setSelected}
          session={session}
        />
      </div>

      {loading ? (
        <div>読み込み中…</div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              item={bookmark}
              session={session}
              folders={folderList}
            />
          ))}
        </div>
      )}
    </div>
  )
}
