'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [viewMode, setViewMode] = useState<'all' | 'unclassified'>('all')
  const [bookmarks, setBookmarks] = useState<BookmarkDTO[]>(initialItems)
  const [folderList, setFolderList] = useState<FolderDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const PER_PAGE = 12

  const refreshBookmarks = useCallback(async (force = false) => {
    if (force) {
      setPage(1)
      setBookmarks([])
    }

    setLoading(true)
    try {
      let result
      if (selected) {
        // 特定のフォルダーのブックマークを取得
        result = await fetchBookmarksByFolder(session, selected.id, page, PER_PAGE)
      } else if (viewMode === 'unclassified') {
        // 未分類のブックマークを取得
        result = await fetchBookmarksByFolder(session, null, page, PER_PAGE)
      } else {
        // すべてのブックマークを取得
        result = await fetchBookmarks(session, page, PER_PAGE)
      }
      
      if (result.error) {
        console.error(result.error)
        return
      }

      if (result.data) {
        const { bookmarks: newBookmarks, total: totalCount } = result.data
        setTotal(totalCount)
        
        setBookmarks(prev => {
          const updatedBookmarks = force ? newBookmarks : [...prev, ...newBookmarks]
          setHasMore(updatedBookmarks.length < totalCount)
          return updatedBookmarks
        })
      }
    } finally {
      setLoading(false)
    }
  }, [session, selected, viewMode, page])

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return

      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = document.documentElement.clientHeight

      // スクロール位置が下部の20%以内になったら次のページを読み込む
      if (scrollHeight - scrollTop - clientHeight < scrollHeight * 0.2) {
        setPage(prev => prev + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, hasMore])

  // ブックマークの楽観的削除
  const removeBookmark = useCallback((bookmarkId: number) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
    setTotal(prev => prev - 1)
  }, [])

  // フォルダー一覧の取得
  useEffect(() => {
    const loadFolders = async () => {
      const { data: folders = [] } = await fetchFolders(session)
      setFolderList(folders)
    }
    loadFolders()
  }, [session])

  // ブックマークの取得（初期表示時と依存関係が変更された時）
  useEffect(() => {
    if (page === 1) {
      refreshBookmarks(true)
    } else {
      refreshBookmarks(false)
    }
  }, [page, selected, viewMode, refreshBookmarks])

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <select
              value={selected?.id ?? viewMode}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'all') {
                  setSelected(null)
                  setViewMode('all')
                  setPage(1)
                  setBookmarks([])
                } else if (value === 'unclassified') {
                  setSelected(null)
                  setViewMode('unclassified')
                  setPage(1)
                  setBookmarks([])
                } else {
                  const folder = folderList.find((f) => f.id === Number(value))
                  setSelected(folder ?? null)
                  setViewMode('all')
                  setPage(1)
                  setBookmarks([])
                }
              }}
              className="w-full rounded-md border px-3 py-2 bg-white"
            >
              <option value="all">すべて</option>
              {folderList.length > 0 && (
                <option value="unclassified">未分類</option>
              )}
              {folderList.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <FolderActions
              selected={selected}
              folderList={folderList}
              setFolderList={setFolderList}
              setSelected={setSelected}
              session={session}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            item={bookmark}
            session={session}
            folders={folderList}
            onBookmarkUpdate={() => refreshBookmarks(true)}
            onBookmarkRemove={removeBookmark}
          />
        ))}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        )}
        {!loading && !hasMore && bookmarks.length > 0 && (
          <div className="text-center text-gray-500 py-4">
            すべてのブックマークを表示しました
          </div>
        )}
      </div>
    </div>
  )
}
