import { client } from "@/app/lib/hono/hono"
import { BookmarkDTO, FolderDTO, RawBookmark } from '@/app/types/bookmark'
import { ApiResponse } from '@/app/types/common'

// ブックマーク一覧の取得
export async function fetchBookmarks(session: { access_token: string }): Promise<ApiResponse<BookmarkDTO[]>> {
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
): Promise<ApiResponse<BookmarkDTO>> {
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

// ブックマークの数を取得
export async function fetchBookmarkCount(session: { access_token: string }): Promise<ApiResponse<number>> {
  try {
    const response = await client.api.bookmark.count.$get(undefined, {
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
    
    const { count } = await response.json() as { count: number }

    return { data: count } 
  } catch (error) {
    console.error('Error fetching bookmarks count:', error)
    return { error: 'ブックマーク数取得に失敗しました' }
  }
}

// フォルダ一覧取得
export async function fetchFolders(session: { access_token: string }): Promise<ApiResponse<FolderDTO[]>> {
  try {
    const response = await client.api.bookmark.folders.$get(undefined, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('フォルダ一覧の取得に失敗しました:', errorData)
      return { error: 'Failed to fetch folders' }
    }

    const data: FolderDTO[] = await response.json()
    return { data: data }
  } catch (error) {
    console.error('フォルダ一覧の取得中にエラーが発生しました:', error)
    return { error: 'Error fetching folders' }
  }
}

// フォルダ作成
export async function addFolder(
  session: { access_token: string },
  payload: { name: string }
): Promise<ApiResponse<FolderDTO>> {
  try {
    const response = await client.api.bookmark.folders.$post(
      { json: { name: payload.name } },
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("フォルダの追加に失敗しました:", errorData)
      return { error: "Failed to add folder" }
    }

    const folder = (await response.json()) as FolderDTO
    return { data: folder }
  } catch (error) {
    console.error("フォルダの追加中にエラーが発生しました:", error)
    return { error: "Error adding folder" }
  }
}

// フォルダーにブックマーク追加
export async function addBookmarkToFolder(
  session: { access_token: string },
  folderId: number,
  bookmarkId: number
): Promise<ApiResponse<null>> {
  try {
    const response = await client.api.bookmark.folders[":folderId"].bookmarks.$post(
      {
        param: { folderId: folderId.toString() },
        json:  { bookmarkId }
      },
      {
        headers: { Authorization: `Bearer ${session.access_token}` }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("フォルダーにブックマークの追加に失敗しました:", errorData)
      return { error: "Failed to add bookmark to folder" }
    }

    return { data: null }
  } catch (error) {
    console.error("フォルダーにブックマークの追加中にエラーが発生しました:", error)
    return { error: "Error adding bookmark to folder" }
  }
}

// フォルダーに紐づくブックマーク一覧取得
export async function fetchBookmarksByFolder(
  session: { access_token: string },
  folderId: number
): Promise<ApiResponse<BookmarkDTO[]>> {
  const res = await client.api.bookmark.folders[":folderId"].bookmarks.$get(
    { param: { folderId: folderId.toString() } },
    { headers: { Authorization: `Bearer ${session.access_token}` } }
  )
  if (!res.ok) return { error: "Failed to fetch" }
  const data = (await res.json()) as BookmarkDTO[]
  return { data }
}

// フォルダ名変更
export async function renameFolder(
  session: { access_token: string },
  folderId: number,
  payload: { name: string }
): Promise<ApiResponse<FolderDTO>> {
  try {
    const response = await client.api.bookmark.folders[":id"].$put(
      { 
        param: { id: folderId.toString() },
        json:    { name: payload.name },
      },
      {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("フォルダ名の変更に失敗しました:", errorData) 
      return { error: "Failed to update folder name" }
    }

    const data = (await response.json()) as FolderDTO
    return { data }
  } catch (error) {
    console.error("フォルダ名の変更中にエラーが発生しました:", error)
    return { error: "Error updating folder name" }
  }
}

// フォルダ削除
export async function deleteFolder(
  session: { access_token: string },
  folderId: number
): Promise<ApiResponse<null>> {
  try {
    const response = await client.api.bookmark.folders[":id"].$delete(
      { param: { id: folderId.toString() } },
      { headers: { Authorization: `Bearer ${session.access_token}` } }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("フォルダの削除に失敗しました:", errorData)
      return { error: "Failed to delete folder" }
    }

    return { data: null }
  } catch (error) {
    console.error("フォルダの削除中にエラーが発生しました:", error)
    return { error: "Error deleting folder" }
  }
}



// 以下、受け取った RawBookmark データをパースするためのヘルパー関数
//
const parseResponse = (data: RawBookmark[]): BookmarkDTO[] => {
  return data.map(item => parseSingle(item))
}

// 単体用
const parseSingle = (item: RawBookmark): BookmarkDTO => {
  return {
    ...item,
    publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : null,
  }
}