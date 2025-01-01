import { client } from "@/app/lib/hono"
import { Bookmark, RawBookmark, ApiResponse } from '@/app/types/types'

// ブックマーク一覧の取得
export async function fetchBookmarks(session: { access_token: string }): Promise<ApiResponse<Bookmark[]>> {
  try {
    const response = await client.api.bookmark.$get(undefined, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      if (response.status === 500) {
        console.error('Failed to fetch bookmarks')
        return { error: 'Failed to fetch bookmarks. Please try again later.' }
      }
      if (response.status === 401) {
        const errorDetail = await response.json();
        console.error('Authorization failed:', errorDetail);
        return { error: 'Authorization Error' }
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

// ブックマーク追加
export async function addBookmark(
  session: { access_token: string },
  payload: { title: string; articleUrl: string; ogImageUrl: string; publishedAt: string }
): Promise<ApiResponse<Bookmark>> {
  try {
    const response = await client.api.bookmark.$post({
      json: {
        title: payload.title,
        articleUrl: payload.articleUrl,
        ogImageUrl: payload.ogImageUrl,
        publishedAt: payload.publishedAt
      }
    },{
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('ブックマークの追加に失敗しました:', errorData)
      return { error: 'Failed to add bookmark' }
    }

    const rawBookmark = await response.json() as RawBookmark
    return { data: parseSingle(rawBookmark) }
  } catch (error) {
    console.error('ブックマークの追加中にエラーが発生しました', error)
    return { error: 'Error adding bookmark' }
  }
}

// ブックマーク削除
export async function deleteBookmark(
  session: { access_token: string },
  bookmarkId: string
): Promise<ApiResponse<null>> {
  try {
    const response = await client.api.bookmark[':id'].$delete({
      param: { id: bookmarkId },
    },{
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('ブックマークの削除に失敗しました:', errorData)
      return { error: 'Failed to delete bookmark' }
    }

    return { data: null }
  } catch (error) {
    console.error('ブックマークの削除中にエラーが発生しました:', error)
    return { error: 'Error deleting bookmark' }
  }
}

//
// 以下、受け取った RawBookmark データをパースするためのヘルパー関数
//
const parseResponse = (data: RawBookmark[]): Bookmark[] => {
  return data.map(item => ({
    ...item,
    createdAt: new Date(item.createdAt),
    publishedAt: new Date(item.publishedAt),
  }))
}

const parseSingle = (item: RawBookmark): Bookmark => ({
  ...item,
  createdAt: new Date(item.createdAt),
  publishedAt: new Date(item.publishedAt),
})