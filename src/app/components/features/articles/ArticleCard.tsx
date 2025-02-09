"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Bookmark } from 'lucide-react'
import { ArticleCardProps } from "@/app/types/article"
import dayjs from "dayjs"
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime"
import { LoginDialog } from "@/app/components/common/LoginDialog"
import { addBookmark, deleteBookmark } from "@/app/lib/api/bookmark"

dayjs.extend(relativeTime)
dayjs.locale("ja");

// favicon取得用のヘルパー
function getFaviconSrcFromOrigin(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${hostname}`
}

export default function ArticleCard({
  item,
  initialIsBookmarked = false,
  user,
  session,
}: ArticleCardProps & {
  user?: any;
}) {
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const { title, url, og_image_url, topics, published_at } = item
  const { hostname, origin } = new URL(url)
  const displayHostname = hostname.endsWith("hatenablog.com") ? "hatenablog.com" : hostname

  // ブックマーク追加
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isBookmarking) return

    // ユーザーがいない (未ログイン) なら、ログインダイアログを出す
    if (!user || !session?.access_token) {
      setIsLoginDialogOpen(true)
      return
    }

    setIsBookmarking(true)
    try {
      const response = await addBookmark(session, {
        title,
        articleUrl: url,
        ogImageUrl: og_image_url ?? "",
        publishedAt: published_at
      })

      if (response.error) {
        console.error(response.error)
        return
      }
      if (response.data) {
        setBookmarkId(response.data.id.toString())
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error('ブックマークの追加中にエラーが発生しました', error)
    } finally {
      setIsBookmarking(false)
    }
  }

  // ブックマーク削除
  const handleDeleteBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isBookmarking || !bookmarkId) return

    if (!user || !session?.access_token) {
      setIsLoginDialogOpen(true)
      return
    }

    setIsBookmarking(true)
    try {
      const response = await deleteBookmark(session, bookmarkId)
      if (response.error) {
        console.error(response.error)
        return
      }

      // 成功したら状態をリセット
      setBookmarkId(null)
      setIsBookmarked(false)
    } catch (error) {
      console.error('ブックマークの削除中にエラーが発生しました', error)
    } finally {
      setIsBookmarking(false)
    }
  }

  // ユーザーアクション (登録/削除) をまとめる
  const handleBookmarkAction = (e: React.MouseEvent) => {
    if (isBookmarked) {
      handleDeleteBookmark(e)
    } else {
      handleBookmark(e)
    }
  }

  // 記事部分をクリック→新規タブで開く
  const handleCardClick = (e: React.MouseEvent) => {
    // ブックマークボタンのクリックだった場合は遷移しない
    if ((e.target as HTMLElement).closest('.bookmark-button')) {
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <article className="rounded-lg overflow-hidden mb-4 w-full md:w-[calc(50%-0.5rem)] border border-gray-300 bg-white">
        <div className="px-4 mt-4 cursor-pointer" onClick={handleCardClick}>
          {topics && topics.length > 0 && (
            <div className="flex flex-nowrap gap-2 mb-2">
              {topics.map((topic, index) => (
                <span
                  key={index}
                  className="text-gray-600 text-xs px-2 py-0.5 bg-gray-100 rounded-full whitespace-nowrap"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-between gap-4 mb-2">
            <h2 className="text-lg font-medium flex-1 line-clamp-3">{title}</h2>
            {og_image_url && (
              <div className="flex-shrink-0">
                <Image
                  src={og_image_url}
                  width={160}
                  height={90}
                  className="rounded-lg object-cover"
                  alt="OGP画像"
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-gray-400">
                <Image
                  src={getFaviconSrcFromOrigin(origin)}
                  width={14}
                  height={14}
                  className="rounded-sm mr-1"
                  alt={displayHostname}
                />
                {displayHostname}
              </div>
              <time dateTime={published_at} className="text-gray-400">
                <p>{dayjs(published_at).fromNow()}に投稿</p>
              </time>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              <button
                onClick={handleBookmarkAction}
                className={`flex items-center gap-1 bookmark-button ${isBookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isBookmarking}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'text-orange-500 fill-orange-500' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </article>

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        onLoginSuccess={() => {
          setIsLoginDialogOpen(false)
          // ログイン成功時、サーバー側の状態を反映するにはリロードが手っ取り早い
          location.reload()
        }}
      />
    </>
  );
}
