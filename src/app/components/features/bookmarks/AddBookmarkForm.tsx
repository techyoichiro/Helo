"use client"

import { useState } from "react"
import { BookmarkIcon } from "@heroicons/react/24/outline"

export default function AddBookmarkForm() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleAddBookmark = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "ブックマークの追加に失敗しました。")
      } else {
        setSuccess("ブックマークが追加されました！")
        setUrl("") // 入力フィールドをリセット
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
            // 追加中はテキストを出すなど、お好みで対応
            "追加中..."
          ) : (
            // 通常時はアイコンだけ表示
            <BookmarkIcon className="h-5 w-5 text-white" aria-label="ブックマークを追加" />
          )}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  )
}
