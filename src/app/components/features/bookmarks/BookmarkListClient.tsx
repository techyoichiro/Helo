"use client"

import { useState, useEffect } from "react"
import BookmarkCard from "@/app/components/features/bookmarks/BookmarkCard"
import {
  FolderDTO,
  BookmarkDTO,
  SessionProp,
} from "@/app/types/bookmark"
import { fetchBookmarksByFolder, renameFolder, deleteFolder } from "@/app/lib/api/bookmark"
import BookmarkFolderCombo from "@/app/components/features/bookmarks/BookmarkFolderCombo.client"
import { Button } from "@/app/components/common/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/app/components/common/dialog"
import { Input } from "@/app/components/common/input"

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
  const [folderList, setFolderList] = useState<FolderDTO[]>(folders)

  /* --- モーダル制御用 state --- */
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [newName, setNewName] = useState("")

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

  /* --- ここでは API 叩かずに TODO として stub --- */
  const handleRename = async () => {
    if (!selected) return
    const { data, error } = await renameFolder(session, selected.id, { name: newName })
    if (error) return
    /* 更新後の処理 */
    // ローカル配列の名称を更新
    setFolderList((prev) =>
      prev.map((f) => (f.id === selected.id ? { ...f, name: newName } : f))
    )
    setRenameOpen(false)
  }

  const handleDelete = async () => {
    if (!selected) return
    const { error } = await deleteFolder(session, selected.id)
    if (error) return
    /* 更新後の処理 */
    // フォルダ配列から取り除く
    setFolderList((prev) => prev.filter((f) => f.id !== selected.id))
    setDeleteOpen(false)
    setSelected(null)
  }

  return (
    <>
      {/* -------- フォルダ選択 & アクションボタン -------- */}
      <div className="mb-4 flex items-center justify-between">
        {/* 左側：コンボボックス */}
        <BookmarkFolderCombo folders={folderList} value={selected} onSelect={setSelected} />

        {/* 右側：ボタン */}
        <div className="flex items-center gap-2">
            <Button
            variant="outline"
            size="sm"
            disabled={!selected}
            onClick={() => {
                setNewName(selected?.name ?? "")
                setRenameOpen(true)
            }}
            >
            フォルダ名変更
            </Button>
            <Button
            variant="destructive"
            size="sm"
            disabled={!selected}
            onClick={() => setDeleteOpen(true)}
            >
            フォルダ削除
            </Button>
        </div>
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

      {/* ===== フォルダ名変更モーダル ===== */}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>フォルダ名を変更</DialogTitle>
            <DialogDescription>
              新しいフォルダ名を入力してください
            </DialogDescription>
          </DialogHeader>

          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="フォルダ名"
          />

          <DialogFooter>
            <Button variant="secondary" onClick={() => setRenameOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleRename} disabled={newName.trim() === ""}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== フォルダ削除モーダル ===== */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除しますか？</DialogTitle>
            <DialogDescription>
              このフォルダを完全に削除します。
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
