"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Bookmark, ExternalLink, Sparkles } from 'lucide-react'
import { ArticleCardProps } from "@/app/types/article"
import dayjs from "dayjs"
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime"
import { LoginDialog } from "@/app/components/common/LoginDialog"
import { addBookmark, deleteBookmark } from "@/app/lib/api/bookmark"
import { createBrowserSupabase } from "@/app/lib/supabase/client"
import { SessionProp } from "@/app/types/bookmark"

dayjs.extend(relativeTime)
dayjs.locale("ja");

// favicon取得用のヘルパー
function getFaviconSrcFromOrigin(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${hostname}`
}

export default function ArticleCard({
  item,
  initialIsBookmarked = false,
  bookmarkId: initialBookmarkId,
  session,
}: ArticleCardProps) {
  const [bookmarkId, setBookmarkId] = useState<string | null>(initialBookmarkId || null)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const { title, url, og_image_url, topics, published_at } = item
  const { hostname, origin } = new URL(url)
  const displayHostname = hostname.endsWith("hatenablog.com") ? "hatenablog.com" : hostname

  // ブックマーク追加
  const handleBookmarkAction = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!session) {
      setIsLoginDialogOpen(true)
      return
    }

    setIsBookmarking(true)
    try {
      if (isBookmarked && bookmarkId) {
        await deleteBookmark(session, bookmarkId)
        setBookmarkId(null)
      } else {
        const response = await addBookmark(session, {
          title,
          articleUrl: url,
          ogImageUrl: og_image_url ?? "",
          publishedAt: published_at,
          folderId: null
        })

        if (response.error) {
          console.error(response.error)
          return
        }
        if (response.data) {
          setBookmarkId(response.data.id.toString())
        }
      }
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Failed to handle bookmark:", error)
    } finally {
      setIsBookmarking(false)
    }
  }

  // AI要約ボタンのハンドラー
  const handleAISummary = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: AI要約機能の実装
    console.log('AI要約機能は実装予定です')
  }

  // 外部リンク遷移ボタンのハンドラー
  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <article className="rounded-lg overflow-hidden mb-4 w-full md:w-[calc(50%-0.5rem)] border border-gray-300 bg-white hover:shadow-md transition-shadow">
        <div className="px-4 mt-4">
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

          <div className="flex justify-between gap-4 mb-3">
            <h2 className="text-lg font-medium flex-1 line-clamp-3">{title}</h2>
            {og_image_url && (
              <div className="relative hidden sm:block w-[160px] h-[90px]">
                <Image
                  src={og_image_url}
                  sizes="160px"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                  alt="OGP画像"
                />
              </div>
            )}
          </div>

          {/* 投稿日時とサイト情報を上に移動 */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center">
              <Image
                src={getFaviconSrcFromOrigin(origin)}
                width={14}
                height={14}
                className="rounded-sm mr-1"
                alt={displayHostname}
              />
              {displayHostname}
            </div>
            <time dateTime={published_at}>
              <p>{dayjs(published_at).fromNow()}に投稿</p>
            </time>
          </div>
        </div>

        {/* カード下部のボタン群 */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* ブックマークボタン */}
              <button
                onClick={handleBookmarkAction}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                  isBookmarked 
                    ? 'border-orange-300 text-orange-600 hover:border-orange-400' 
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                } ${isBookmarking ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isBookmarking}
                title={isBookmarked ? 'ブックマークを解除' : 'ブックマークに追加'}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
                />
                <span className="hidden sm:inline">
                  {isBookmarked ? '解除' : '保存'}
                </span>
              </button>

              {/* AI要約ボタン */}
              <button
                onClick={handleAISummary}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
                title="AI要約を生成"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI要約</span>
              </button>
            </div>

            {/* 外部リンク遷移ボタン */}
            <button
              onClick={handleExternalLink}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
              title="記事を新しいタブで開く"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">記事を読む</span>
            </button>
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
