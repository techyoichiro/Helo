import React from "react"
import Image from "next/image"
import { Bookmark as bookmark } from "@/app/types/types"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

function getFaviconSrcFromOrigin(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${hostname}`
}

export async function BookmarkCard({ item }: { item: bookmark }) {
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
    <article className="rounded-lg overflow-hidden mb-4 w-full md:w-[calc(50%-0.5rem)] border border-gray-300">
      <div className="px-4 mt-4 cursor-pointer" onClick={handleCardClick}>
        <div className="flex justify-between gap-4 mb-4">
          <h2 className="text-lg font-medium flex-1 line-clamp-3">{title}</h2>
          {ogImageUrl && (
            <div className="flex-shrink-0">
              <Image
                src={ogImageUrl}
                width={140}
                height={100}
                className="rounded-lg object-cover"
                alt=""
              />
            </div>
          )}
        </div>
      </div>
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-gray-400 text-xs">
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
              {dayjs(publishedAt).fromNow()}
            </time>
          </div>
        </div>
      </div>
    </article>
  )
}

