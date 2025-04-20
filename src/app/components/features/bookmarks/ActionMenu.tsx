"use client"

import { useState, useEffect } from "react"
import { BookmarkIcon, TrashIcon, PlusIcon } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/common/popover"
import { Button } from "@/app/components/common/button"
import { Input } from "@/app/components/common/input"
import { deleteBookmark, fetchFolders, addFolder, addBookmarkToFolder } from "@/app/lib/api/bookmark"
import { FolderDTO } from "@/app/types/bookmark"
interface SessionProp {
  access_token: string
}

interface ActionMenuProps {
  bookmarkId: number
  session: SessionProp
}

export function ActionMenu({ bookmarkId, session }: ActionMenuProps) {
  /* ---------- state ---------- */
  const [folders, setFolders] = useState<FolderDTO[]>([])
  const [newFolderName, setNewFolderName] = useState("")

  /* ---------- フォルダ一覧取得 ---------- */
  useEffect(() => {
    async function load() {
      const res = await fetchFolders(session)
      if (res.data) setFolders(res.data)
      if (res.error) console.error(res.error)
    }
    load()
  }, [session])

  /* ---------- ハンドラ ---------- */
  const handleDeleteBookmark = async () => {
    await deleteBookmark(session, bookmarkId.toString())
    // リフレッシュ
    window.location.reload()
  }

  const handleAddToFolder = async (folderId: number) => {
    await addBookmarkToFolder(session, folderId, bookmarkId)
  }

  const handleCreateFolder = async () => {
    const result = await addFolder(session, { name: newFolderName })
    if (result.error) {
      console.error(result.error)
      return
    }

    if (result.data) {
      setFolders((prev) => (result.data ? [...prev, result.data] : prev))
      setNewFolderName("")
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
        >
          <BookmarkIcon className="text-orange-500 fill-orange-500" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 space-y-2" onClick={(e) => e.stopPropagation()}>
        {/* ブックマーク削除 */}
        <Button
          variant="destructive"
          className="w-full flex justify-start"
          onClick={handleDeleteBookmark}
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          削除
        </Button>

        {/* フォルダ追加 */}
        <div>
          <p className="text-sm mb-2">フォルダに追加</p>
          <div className="grid gap-2">
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="outline"
                className="w-full flex justify-start"
                onClick={(e) => handleAddToFolder(folder.id)}
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                {folder.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 新規フォルダ作成 */}
        <div className="pt-4 border-t mt-2">
          <Input
            placeholder="新しいフォルダ名"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button
            className="w-full mt-2"
            onClick={handleCreateFolder}
            disabled={!newFolderName}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            フォルダ作成
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
