"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Bookmark } from 'lucide-react'
import { Article } from "@/app/types/types"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { client } from '@/app/lib/hono'
import { fetcher, type FetcherResponse } from '@/app/lib/utils'
import { useUserStore } from '@/app/lib/hooks/useUserStore'

dayjs.extend(relativeTime)

function getFaviconSrcFromOrigin(hostname: string) {
  return `https://www.google.com/s2/favicons?sz=32&domain_url=${hostname}`
}

export default function ArticleCard({ item }: { item: Article }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isBookmarking, setIsBookmarking] = useState(false)
  const { title, url, og_image_url, topics, published_at } = item
  const { hostname, origin } = new URL(url)
  const displayHostname = hostname.endsWith("hatenablog.com") ? "hatenablog.com" : hostname

  const { user, session } = useUserStore()
  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isBookmarking) return

    if (!user || !session) {
      alert('ブックマークするにはログインが必要です')
      return
    }

    if (!session.access_token) {
      console.log('セッションが無効です。再度ログインしてください。')
      return
    }

    setIsBookmarking(true)
    try {
      const bookmarkUrl = client.api.bookmark.$url()
      const response = await fetcher<{ id: string }>(bookmarkUrl.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          articleUrl: url,
          ogImageUrl: og_image_url,
        }),
      })

      if ('error' in response) {
        throw new Error(response.error)
      }

      setIsBookmarked(true)
    } catch (error) {
      console.error('Error bookmarking:', error)
    } finally {
      setIsBookmarking(false)
    }
  }

  return (
    <article className="rounded-lg overflow-hidden mb-4 w-full md:w-[calc(50%-0.5rem)] border border-gray-300">
      <a href={url} className="block p-4" target="_blank" rel="noopener noreferrer">
        {topics && topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {topics.map((topic, index) => (
              <span
                key={index}
                className="text-gray-600 text-xs px-2 py-0.5 bg-gray-100 rounded-full"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between gap-4 mb-4">
          <h2 className="text-lg font-medium flex-1 line-clamp-3">{title}</h2>
          {og_image_url && (
            <div className="flex-shrink-0">
              <Image
                src={og_image_url}
                width={140}
                height={100}
                className="rounded-lg object-cover"
                alt=""
              />
            </div>
          )}
        </div>

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
            <time dateTime={published_at} className="text-gray-400">
              {dayjs(published_at).fromNow()}
            </time>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <button
              onClick={handleBookmark}
              className="flex items-center gap-1"
              disabled={isBookmarking}
            >
              <Bookmark 
                className={`w-4 h-4 ${isBookmarked ? 'text-orange-500 fill-orange-500' : ''}`} 
              />
            </button>
          </div>
        </div>
      </a>
    </article>
  )
}

