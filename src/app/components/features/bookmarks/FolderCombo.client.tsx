/* app/components/features/bookmarks/FolderCombo.client.tsx */
"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/app/components/common/popover"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/app/components/common/command"
import { Button } from "@/app/components/common/button"
import { cn } from "@/app/lib/utils/utils"           // shadcn のユーティリティ

import { FolderDTO } from "@/app/types/bookmark"

/* ---------- Props ---------- */
interface FolderComboProps {
  folders: FolderDTO[]              // 表示するフォルダー一覧
  placeholder?: string              // 未選択時テキスト
  className?: string
  onSelect?: (folder: FolderDTO) => void   // 選択コールバック
  initial?: FolderDTO | null        // 初期選択（任意）
}

export default function FolderCombo({
  folders,
  onSelect,
  placeholder = "フォルダを選択",
  className,
  initial = null,
}: FolderComboProps) {
  /* 開閉と選択状態 */
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<FolderDTO | null>(initial)
  const [query, setQuery] = useState("")

  /* シンプルなフロント側フィルタ */
  const filtered = query
    ? folders.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : folders

  const handleSelect = (folder: FolderDTO) => {
    setSelected(folder)
    setOpen(false)
    setQuery("")
    onSelect?.(folder)               // 親に通知
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ------- トリガー ------- */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className={cn("w-48 justify-between", className)}
        >
          <span className={selected ? "" : "text-muted-foreground"}>
            {selected ? selected.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* ------- ドロップダウン ------- */}
      <PopoverContent className="p-0 w-48">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="検索..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {filtered.length === 0 && <CommandEmpty>No result</CommandEmpty>}

            {filtered.map((folder) => (
              <CommandItem
                key={folder.id}
                value={String(folder.id)}
                onSelect={() => handleSelect(folder)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected?.id === folder.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {folder.name}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
