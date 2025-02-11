"use client"

import React from "react"
import Image from "next/image"
import { Bookmark } from "@/app/types/bookmark"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

function getFaviconSrcFromOrigin(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${hostname}`
}

export function BookmarkCard({ item }: { item: Bookmark }) {
  const { title, articleUrl, ogImageUrl, publishedAt } = item
  const { hostname, origin } = new URL(articleUrl)
  const displayHostname = hostname.endsWith("hatenablog.com")
    ? "hatenablog.com"
    : hostname

  const handleCardClick = (e: React.MouseEvent) => {
    // ブックマークボタンがクリックされた場合は、新しいタブで開かない
    if ((e.target as HTMLElement).closest(".bookmark-button")) {
      return
    }
    window.open(articleUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <article className="rounded-lg overflow-hidden mb-4 w-full border border-gray-300">
      <div className="px-4 my-2 cursor-pointer" onClick={handleCardClick}>
        <div className="flex justify-between gap-4">
          {/* タイトル */}
          <div className="flex-1">
            <h2 className="text-gray-700 text-lg font-medium line-clamp-3 mb-2">
              {title}
            </h2>
            {/* ホスト名と投稿日時 */}
            <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
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
              {publishedAt && (
                <time dateTime={publishedAt.toString()} className="text-gray-400">
                  {dayjs(publishedAt).fromNow()} に投稿
                </time>
              )}
            </div>
          </div>
          {/* OGP画像 */}
          {ogImageUrl && (
            <div className="relative w-[160px] h-[90px]">
              <Image
                src={ogImageUrl}
                alt=""
                fill
                sizes="160px"
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
