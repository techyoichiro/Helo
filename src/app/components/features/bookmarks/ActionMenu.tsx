"use client"

import { useState } from "react"
import { BookmarkIcon, PlusIcon, TrashIcon } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/common/popover"
import { Button } from "@/app/components/common/button"
import { Input } from "@/app/components/common/input"
import {
  addBookmarkToFolder,
  addFolder,
  deleteBookmark,
} from "@/app/lib/api/bookmark"
import { FolderDTO, SessionProp } from "@/app/types/bookmark"

/* -------- Props -------- */
interface ActionMenuProps {
  bookmarkId: number
  session: SessionProp
  folders: FolderDTO[]
  onBookmarkUpdate?: () => Promise<void>
}

export default function ActionMenu({
  bookmarkId,
  session,
  folders,
  onBookmarkUpdate,
}: ActionMenuProps) {
  const [list, setList] = useState<FolderDTO[]>(folders)
  const [newFolderName, setNewFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null)

  /* ---------- ハンドラ ---------- */
  const handleDeleteBookmark = async () => {
    try {
      setIsLoading(true)
      onBookmarkUpdate?.()
      await deleteBookmark(session, bookmarkId.toString())
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
      onBookmarkUpdate?.()
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToFolder = async (folderId: number) => {
    try {
      setActiveFolderId(folderId)
      await addBookmarkToFolder(session, folderId, bookmarkId)
      onBookmarkUpdate?.()
    } catch (error) {
      console.error('Failed to add to folder:', error)
    } finally {
      setActiveFolderId(null)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName) return
    
    try {
      setIsLoading(true)
      const res = await addFolder(session, newFolderName)
      if (res.error) {
        console.error(res.error)
        return
      }

      if (res.data) {
        setList((prev) => [...prev, res.data as FolderDTO])
        setNewFolderName("")
      }
    } catch (error) {
      console.error('Failed to create folder:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------- UI ---------- */
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          className="bookmark-button flex items-center justify-center
                     h-10 w-10 rounded-full bg-orange-50 hover:bg-orange-100
                     transition-colors"
          disabled={isLoading}
        >
          <BookmarkIcon className="text-orange-500 fill-orange-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 space-y-2"
        onClick={(e) => e.stopPropagation()}   /* カードへの伝播を防止 */
      >
        {/* ─ ブックマーク削除 ─ */}
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={handleDeleteBookmark}
          disabled={isLoading}
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          {isLoading ? '削除中...' : '削除'}
        </Button>

        {/* ─ 既存フォルダへ追加 ─ */}
        <div>
          <p className="text-sm mb-2">フォルダに追加</p>
          <div className="grid gap-2">
            {list.map((f) => (                      /* ★ list を描画 */
              <Button
                key={f.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAddToFolder(f.id)}
                disabled={isLoading || activeFolderId === f.id}
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                {activeFolderId === f.id ? '追加中...' : f.name}
              </Button>
            ))}
          </div>
        </div>

        {/* ─ 新規フォルダ作成 ─ */}
        <div className="pt-4 border-t mt-2">
          <Input
            placeholder="新しいフォルダ名"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            disabled={isLoading}
          />
          <Button
            className="w-full mt-2"
            onClick={handleCreateFolder}
            disabled={!newFolderName || isLoading}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {isLoading ? '作成中...' : 'フォルダ作成'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
