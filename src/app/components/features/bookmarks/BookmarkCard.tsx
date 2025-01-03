"use client"

import React from "react"
import Image from "next/image"
import { Bookmark } from "@/app/types/bookmark"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function getFaviconSrcFromOrigin(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${hostname}`
}

export function BookmarkCard({ item }: { item: Bookmark }) {
  const { title, articleUrl, ogImageUrl, publishedAt } = item
  const { hostname, origin } = new URL(articleUrl)
  const displayHostname = hostname.endsWith("hatenablog.com") ? "hatenablog.com" : hostname

  const handleCardClick = (e: React.MouseEvent) => {
    // ブックマークボタンがクリックされた場合は、新しいタブで開かない
    if ((e.target as HTMLElement).closest('.bookmark-button')) {
      return
    }
    window.open(articleUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="rounded-lg overflow-hidden mb-4 w-full border border-gray-300">
      <div className="px-4 mt-4 cursor-pointer" onClick={handleCardClick}>
        <div className="flex justify-between gap-4 mb-2">
          <h2 className="text-gray-700 text-lg font-medium flex-1 line-clamp-3">{title}</h2>
          {ogImageUrl && (
            <div className="flex-shrink-0">
              <Image
                src={ogImageUrl}
                width={160}
                height={90}
                className="rounded-lg object-cover"
                alt=""
              />
            </div>
          )}
        </div>
      </div>
      <div className="px-4 mb-3">
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
            <time dateTime={publishedAt.toString()} className="text-gray-400">
              <p>{dayjs(publishedAt).fromNow()}に投稿</p>
            </time>
          </div>
        </div>
      </div>
    </article>
  )
}

