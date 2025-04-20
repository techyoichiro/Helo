"use client"

import Image from "next/image"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { BookmarkCardProps } from "@/app/types/bookmark"
import { ActionMenu } from "@/app/components/features/bookmarks/ActionMenu"

dayjs.extend(relativeTime)

function getFaviconSrcFromOrigin(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${hostname}`
}

export function BookmarkCard({ item, session }: BookmarkCardProps) {
  const { title, articleUrl, ogImageUrl } = item
  const { hostname, origin } = new URL(articleUrl)
  const displayHostname = hostname.endsWith("hatenablog.com")
    ? "hatenablog.com"
    : hostname

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".bookmark-button")) return
    window.open(articleUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <article className="rounded-lg overflow-hidden mb-4 w-full border border-gray-300">
      <div
        className="px-4 my-2 flex justify-between gap-2 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* 左: タイトル・サイト名 */}
        <div className="flex-1 pr-4 flex flex-col justify-between">
          <h2 className="text-gray-700 text-lg font-medium line-clamp-3 mb-2">
            {title}
          </h2>

          <div className="mt-auto flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center">
              <Image
                src={getFaviconSrcFromOrigin(origin)}
                width={14}
                height={14}
                alt={displayHostname}
                className="rounded-sm mr-1"
              />
              {displayHostname}
            </div>
          </div>
        </div>

        {/* 右: アクション + OGP */}
        <div className="flex flex-col items-end gap-2">
          

          {ogImageUrl && (
            <div className="relative w-[160px] h-[90px]">
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
        </div>
        <div className="flex items-center">
          <ActionMenu bookmarkId={item.id} session={session} />
        </div>
      </div>
    </article>
  )
}
