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
}

export default function ActionMenu({
  bookmarkId,
  session,
  folders,
}: ActionMenuProps) {
  const [list, setList] = useState<FolderDTO[]>(folders)
  const [newFolderName, setNewFolderName] = useState("")

  /* ---------- ハンドラ ---------- */
  const handleDeleteBookmark = async () => {
    await deleteBookmark(session, bookmarkId.toString())
    window.location.reload()
  }

  const handleAddToFolder = async (folderId: number) => {
    await addBookmarkToFolder(session, folderId, bookmarkId)
  }

  const handleCreateFolder = async () => {
    const res = await addFolder(session, newFolderName)
    if (res.error) return console.error(res.error)

    if (res.data) {
      setList((prev) => (res.data ? [...prev, res.data] : prev))
      setNewFolderName("")
    }
  }

  /* ---------- UI ---------- */
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bookmark-button flex items-center justify-center
                           h-10 w-10 rounded-full bg-orange-50 hover:bg-orange-100
                           transition-colors">
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
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          削除
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
              >
                <BookmarkIcon className="h-4 w-4 mr-2" />
                {f.name}
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
