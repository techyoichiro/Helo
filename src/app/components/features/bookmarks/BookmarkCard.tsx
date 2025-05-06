"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import { useCallback } from "react"
import { BookmarkCardProps } from "@/app/types/bookmark"

const ActionMenu = dynamic(() => import("./ActionMenu"), { 
  ssr: false,
  loading: () => (
    <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
  )
})

function favicon(host: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${host}`
}

export default function BookmarkCard({
  item,
  session,
  folders,
}: BookmarkCardProps) {
  const { title, articleUrl, ogImageUrl } = item
  const { hostname, origin } = new URL(articleUrl)
  const site = hostname.endsWith("hatenablog.com") ? "hatenablog.com" : hostname

  const openArticle = useCallback(
    () => window.open(articleUrl, "_blank", "noopener,noreferrer"),
    [articleUrl]
  )

  return (
    <article
      className="mb-4 w-full border border-gray-300 rounded-lg overflow-hidden"
      onClick={openArticle}
    >
      <div className="px-4 py-3 flex gap-4 items-center">
        {/* 左列 ─ タイトル & サイト名 */}
        <div className="flex-1 min-w-0">
          <h2 className="text-gray-700 text-lg font-medium line-clamp-3">
            {title}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
            <Image
              src={favicon(origin)}
              alt={site}
              width={14}
              height={14}
              className="rounded-sm"
            />
            {site}
          </div>
        </div>

        {/* 右列 ─ サムネイル（あれば） */}
        {ogImageUrl && (
          <div className="relative w-[160px] h-[90px] flex-shrink-0">
            <Image
              src={ogImageUrl}
              alt="OG Image"
              fill
              sizes="160px"
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
        )}

        {/* 最右列 ─ ActionMenu ボタン */}
        <div
          className="flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <ActionMenu
            bookmarkId={item.id}
            session={session}
            folders={folders}
          />
        </div>
      </div>
    </article>
  )
}