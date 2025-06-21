'use client'

import { useState } from 'react'
import { Button } from '@/app/components/common/button'
import {
  Dialog, DialogContent, DialogHeader,
  DialogFooter, DialogTitle, DialogDescription
} from '@/app/components/common/dialog'
import { Input } from '@/app/components/common/input'
import { renameFolder, deleteFolder } from '@/app/lib/api/bookmark'
import { FolderDTO, SessionProp } from '@/app/types/bookmark'

export interface FolderActionsProps {
  selected: FolderDTO | null
  folderList: FolderDTO[]
  setFolderList: (folders: FolderDTO[]) => void
  setSelected: (f: FolderDTO | null) => void
  session: SessionProp
  onFoldersChanged?: () => void
}

export default function FolderActions({
  selected, folderList, setFolderList, setSelected, session, onFoldersChanged
}: FolderActionsProps) {
  const [renameOpen, setRenameOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [newName, setNewName] = useState('')

  const handleRename = async () => {
    if (!selected) return
    const { error } = await renameFolder(session, selected.id, newName)
    if (!error) {
      setFolderList(
        folderList.map(f => f.id === selected.id ? { ...f, name: newName } : f)
      )
      setRenameOpen(false)
      onFoldersChanged?.()
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    const { error } = await deleteFolder(session, selected.id)
    if (!error) {
      setFolderList(folderList.filter(f => f.id !== selected.id))
      setSelected(null)
      setDeleteOpen(false)
      onFoldersChanged?.()
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button disabled={!selected} onClick={() => {
          setNewName(selected?.name ?? '')
          setRenameOpen(true)
        }}>
          フォルダ名変更
        </Button>
        <Button variant="destructive" disabled={!selected} onClick={() => setDeleteOpen(true)}>
          フォルダ削除
        </Button>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>フォルダ名を変更</DialogTitle>
            <DialogDescription>新しい名前を入力してください</DialogDescription>
          </DialogHeader>
          <Input value={newName} onChange={e => setNewName(e.target.value)} />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRenameOpen(false)}>キャンセル</Button>
            <Button onClick={handleRename} disabled={!newName.trim()}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>削除しますか？</DialogTitle>
            <DialogDescription>このフォルダを完全に削除します。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>キャンセル</Button>
            <Button variant="destructive" onClick={handleDelete}>削除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
