"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"
import { client } from '@/app/lib/hono/hono';
import { useRouter } from "next/navigation"
import { z } from "zod"
import type { FolderDTO } from "@/app/types/bookmark"

interface AddBookmarkFormProps {
  session: { access_token: string }
}

// url は必須 & URL形式であることをチェック
const urlSchema = z.object({
  url: z.string().url()
})

export default function AddBookmarkForm({ session }: AddBookmarkFormProps) {
  const router = useRouter()  
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddBookmark = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    // バリデーション
    const parseResult = urlSchema.safeParse({ url })
    if (!parseResult.success) {
      // エラーの場合は API 呼び出しせずに終了
      setIsLoading(false)
      setError("有効なURLではありません。")
      return
    }

    // APIにリクエスト
    try {
      const res = await client.api.bookmark.url.$post(
        { json: { url } ,
      },{
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('ブックマークの追加に失敗しました:', errorData)
        setError('Failed to add bookmark')
      } else {
        setSuccess("ブックマークが追加されました！")
        setUrl("") // 入力フィールドをリセット
        router.refresh()
      }
    } catch (err: any) {
      console.error("Error adding bookmark:", err)
      setError("サーバーエラーが発生しました。")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="my-4">
      <label className="block mb-2 font-semibold">URLでブックマーク</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 px-2 w-full rounded"
          placeholder="https://example.com"
        />
        <button
          onClick={handleAddBookmark}
          disabled={!url || isLoading}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:bg-gray-300 flex items-center justify-center"
        >
          {isLoading ? (
            "追加中..."
          ) : (
            <Bookmark className="h-5 w-5 text-white" aria-label="ブックマークを追加" />
          )}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  )
}
