import { ScrollArea } from "@/app/components/elements/ui/scroll-area"

export default function BookmarksPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">ブックマーク</h1>

      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">

      </div>
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="rounded-lg border bg-card">
            {/* ブックマークリストのプレースホルダー */}
            <div className="p-4 text-center text-sm text-muted-foreground">
            ブックマークはまだありません
            </div>
        </div>
      </ScrollArea>
    </div>
  )
}

