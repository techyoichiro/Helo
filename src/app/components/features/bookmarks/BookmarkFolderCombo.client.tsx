"use client"

import FolderCombo from "./FolderCombo.client"
import { FolderDTO } from "@/app/types/bookmark"

interface Props {
  folders: FolderDTO[]
  /** “いま選択中” ― null は「すべて」を意味する */
  value: FolderDTO | null
  /** 選択が変わったら親へ通知。null は「すべて」 */
  onSelect: (folder: FolderDTO | null) => void
}

export default function BookmarkFolderCombo({
  folders,
  value,
  onSelect,
}: Props) {
  /* 先頭に “すべて” を差し込んだ配列（id=0 を特例扱い） */
  const comboFolders: FolderDTO[] = [
    { id: 0, name: "すべて" } as FolderDTO,
    ...folders,
  ]

  /* ───────── 選択ハンドラ ───────── */
  const handleSelect = (f: FolderDTO) => {
    onSelect(f.id === 0 ? null : f) // id=0 は null 扱い
  }

  /* フォルダ削除で value が存在しなくなったときは “すべて” にフォールバック */
  const isValid =
    value && folders.some((f) => f.id === value.id) ? true : false
  const keyForReset = value ? String(value.id) : "all"

  return (
    <FolderCombo
      key={keyForReset}
      folders={comboFolders}
      onSelect={handleSelect}
      placeholder="フォルダーで絞り込み"
    />
  )
}
