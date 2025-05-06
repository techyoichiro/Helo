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
  const [cache, setCache] = useState<Record<string, BookmarkDTO[]>>({
    '': initialItems // 初期データをキャッシュ
  })

  // キャッシュキーを生成
  const getCacheKey = useCallback((folderId: number | null, mode: 'all' | 'unclassified') => {
    if (folderId) return folderId.toString()
    return mode
  }, [])

  const refreshBookmarks = useCallback(async (force = false) => {
    const cacheKey = getCacheKey(selected?.id ?? null, viewMode)
    
    // キャッシュがある場合はそれを使用（強制更新でない場合）
    if (!force && cache[cacheKey]) {
      setBookmarks(cache[cacheKey])
      return
    }

    setLoading(true)
    try {
      let result
      if (selected) {
        // 特定のフォルダーのブックマークを取得
        result = await fetchBookmarksByFolder(session, selected.id)
      } else if (viewMode === 'unclassified') {
        // 未分類のブックマークを取得
        result = await fetchBookmarksByFolder(session, null)
      } else {
        // すべてのブックマークを取得
        result = await fetchBookmarks(session)
      }
      
      if (result.error) {
        console.error(result.error)
        return
      }

      const newBookmarks = result.data ?? []
      setBookmarks(newBookmarks)
      
      // キャッシュを更新
      setCache(prev => ({
        ...prev,
        [cacheKey]: newBookmarks
      }))
    } finally {
      setLoading(false)
    }
  }, [session, selected, viewMode, cache, getCacheKey])

  // ブックマークの楽観的削除
  const removeBookmark = useCallback((bookmarkId: number) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
    
    // キャッシュも更新
    setCache(prev => {
      const newCache = { ...prev }
      Object.keys(newCache).forEach(key => {
        newCache[key] = newCache[key].filter(b => b.id !== bookmarkId)
      })
      return newCache
    })
  }, [])

  useEffect(() => {
    const loadFolders = async () => {
      const { data: folders = [] } = await fetchFolders(session)
      setFolderList(folders)
    }
    loadFolders()
  }, [session])

  useEffect(() => {
    refreshBookmarks()
  }, [session, selected, viewMode, refreshBookmarks])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          value={selected?.id ?? viewMode}
          onChange={(e) => {
            const value = e.target.value
            if (value === 'all') {
              setSelected(null)
              setViewMode('all')
            } else if (value === 'unclassified') {
              setSelected(null)
              setViewMode('unclassified')
            } else {
              const folder = folderList.find((f) => f.id === Number(value))
              setSelected(folder ?? null)
              setViewMode('all')
            }
          }}
          className="rounded-md border px-3 py-2"
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
              onBookmarkUpdate={() => refreshBookmarks(true)}
              onBookmarkRemove={removeBookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
