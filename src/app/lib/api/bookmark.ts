import { Bookmark, RawBookmark, ApiResponse } from '@/app/types/types'
import { client } from '@/app/lib/hono'

export async function fetchBookmarks(session: { access_token: string }): Promise<ApiResponse<Bookmark[]>> {
  try {
    const response = await client.api.bookmark.$get({
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })

    if (!response.ok) {
      if (response.status === 500) {
        console.error('Failed to fetch bookmarks')
        return { error: 'Failed to fetch bookmarks. Please try again later.' }
      }
      throw new Error('An unexpected error occurred.')
    }

    const data: RawBookmark[] = await response.json()
    return {
      data: parseResponse(data)
    }
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return { error: 'ブックマークの取得に失敗しました' }
  }
}

const parseResponse = (data: RawBookmark[]): Bookmark[] => {
  return data.map(item => ({
    ...item,
    createdAt: new Date(item.createdAt),
    publishedAt: new Date(item.publishedAt)
  }))
}

