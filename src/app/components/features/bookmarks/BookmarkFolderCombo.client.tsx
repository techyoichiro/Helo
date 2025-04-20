/* app/components/features/bookmarks/BookmarkFolderCombo.client.tsx */
"use client"

import FolderCombo from "./FolderCombo.client"
import { FolderDTO } from "@/app/types/bookmark"

interface Props {
  folders: FolderDTO[]
  onSelect: (folder: FolderDTO | null) => void   // ← 親へ通知
}

export default function BookmarkFolderCombo({ folders, onSelect }: Props) {
  /* 先頭に “すべて” オプションを追加した配列を作る */
  const comboFolders = [{ id: 0, name: "すべて" }, ...folders]

  const handleSelect = (f: FolderDTO) => {
    onSelect(f.id === 0 ? null : f)   // id=0 は null 扱い
  }

  return (
    <FolderCombo
      folders={comboFolders}
      onSelect={handleSelect}
      placeholder="フォルダーで絞り込み"
    />
  )
}
