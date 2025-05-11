import { client } from '@/app/lib/hono/hono'
import type { ApiResponse } from '@/app/types/common'
import type {
  BookmarkDTO,
  FolderDTO,
  RawBookmarkRow,
  BookmarkResponse,
  BookmarkQuery,
} from '@/app/types/bookmark'

/* ──────────────── 共通ヘッダ ──────────────── */
const auth = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
})

/* ──────────────── 行→DTO 変換 ──────────────── */
const toDTO = (r: RawBookmarkRow): BookmarkDTO => ({
  id:          r.id,
  title:       r.title,
  articleUrl:  r.article_url,
  ogImageUrl:  r.og_image_url,
  publishedAt: r.published_at ?? null,
  createdAt: r.created_at
})
const toDTOs = (rows: RawBookmarkRow[]) => rows.map(toDTO)

/* ================================================================
   1. ブックマーク一覧
================================================================ */
export async function fetchBookmarks(
  session: { access_token: string },
  page: number = 1,
  perPage: number = 12,
): Promise<ApiResponse<{ bookmarks: BookmarkDTO[], total: number }>> {
  try {
    const query: BookmarkQuery = {
      page: page.toString(),
      perPage: perPage.toString()
    }
    const res = await client.api.bookmark.$get(
      { query },
      auth(session.access_token)
    )
    if (!res.ok) return fail(res)

    const data = await res.json() as BookmarkResponse
    return { 
      data: {
        bookmarks: toDTOs(data.bookmarks),
        total: data.total
      }
    }
  } catch (err) {
    console.error(err)
    return { error: 'ブックマークの取得に失敗しました' }
  }
}

/* ================================================================
   2. ブックマーク追加
================================================================ */
export async function addBookmark(
  session: { access_token: string },
  payload: { title: string; articleUrl: string; ogImageUrl: string; publishedAt: string; folderId: number | null },
): Promise<ApiResponse<BookmarkDTO>> {
  try {
    const res = await client.api.bookmark.$post(
      { json: payload },
      auth(session.access_token),
    )
    if (!res.ok) return fail(res)

    return { data: toDTO(await res.json() as RawBookmarkRow) }
  } catch (err) {
    console.error(err)
    return { error: 'ブックマーク追加に失敗しました' }
  }
}

/* ================================================================
   3. ブックマーク削除
================================================================ */
export async function deleteBookmark(
  session: { access_token: string },
  bookmarkId: string,
): Promise<ApiResponse<null>> {
  try {
    const res = await client.api.bookmark[':id'].$delete(
      { param: { id: bookmarkId.toString() } },
      auth(session.access_token),
    )
    if (!res.ok) return fail(res)
    return { data: null }
  } catch (err) {
    console.error(err)
    return { error: 'ブックマーク削除に失敗しました' }
  }
}

/* ================================================================
   4. ブックマーク数
================================================================ */
export async function fetchBookmarkCount(
  session: { access_token: string },
): Promise<ApiResponse<number>> {
  try {
    const res = await client.api.bookmark.count.$get(undefined, auth(session.access_token))
    if (!res.ok) return fail(res)

    const { count } = (await res.json()) as { count: number }
    return { data: count }
  } catch (err) {
    console.error(err)
    return { error: 'ブックマーク数取得に失敗しました' }
  }
}

/* ================================================================
   5. フォルダ CRUD
================================================================ */
export async function fetchFolders(
  session: { access_token: string },
): Promise<ApiResponse<FolderDTO[]>> {
  try {
    const res = await client.api.bookmark.folders.$get(undefined, auth(session.access_token))
    if (!res.ok) return fail(res)

    return { data: await res.json() as FolderDTO[] }
  } catch (err) {
    console.error(err)
    return { error: 'フォルダ取得に失敗しました' }
  }
}

export async function addFolder(
  session: { access_token: string },
  name: string,
): Promise<ApiResponse<FolderDTO>> {
  try {
    const res = await client.api.bookmark.folders.$post(
      { json: { name } },
      auth(session.access_token),
    )
    if (!res.ok) return fail(res)
    return { data: await res.json() as FolderDTO }
  } catch (err) {
    console.error(err)
    return { error: 'フォルダ追加に失敗しました' }
  }
}

export async function renameFolder(
  session: { access_token: string },
  folderId: number,
  name: string,
): Promise<ApiResponse<FolderDTO>> {
  try {
    const res = await client.api.bookmark.folders[':id'].$put(
      { param: { id: folderId.toString() }, json: { name } },
      auth(session.access_token),
    )
    if (!res.ok) return fail(res)
    return { data: await res.json() as FolderDTO }
  } catch (err) {
    console.error(err)
    return { error: 'フォルダ名変更に失敗しました' }
  }
}

export async function deleteFolder(
  session: { access_token: string },
  folderId: number,
): Promise<ApiResponse<null>> {
  try {
    const res = await client.api.bookmark.folders[':id'].$delete(
      { param: { id: folderId.toString() } },
      auth(session.access_token),
    )
    if (!res.ok) return fail(res)
    return { data: null }
  } catch (err) {
    console.error(err)
    return { error: 'フォルダ削除に失敗しました' }
  }
}

/* ================================================================
   6. フォルダ内ブックマーク取得 / 追加
================================================================ */
export async function fetchBookmarksByFolder(
  session: { access_token: string },
  folderId: number | null,
  page: number = 1,
  perPage: number = 12,
): Promise<ApiResponse<{ bookmarks: BookmarkDTO[], total: number }>> {
  try {
    let res: Response
    if (folderId === null) {
      // 未分類のブックマークを取得（folder_id が null のもの）
      const query: BookmarkQuery = {
        page: page.toString(),
        perPage: perPage.toString(),
        unclassified: 'true'
      }
      res = await client.api.bookmark.$get(
        { query },
        auth(session.access_token)
      )
    } else {
      // 特定のフォルダのブックマークを取得
      const query: BookmarkQuery = {
        page: page.toString(),
        perPage: perPage.toString()
      }
      res = await client.api.bookmark.folders[':folderId'].bookmarks.$get(
        { 
          param: { folderId: folderId.toString() },
          query
        } as any, // Honoの型定義の制限により一時的にanyを使用
        auth(session.access_token),
      )
    }
    if (!res.ok) return fail(res)

    const data = await res.json() as BookmarkResponse
    return { 
      data: {
        bookmarks: toDTOs(data.bookmarks),
        total: data.total
      }
    }
  } catch (err) {
    console.error(err)
    return { error: 'ブックマークの取得に失敗しました' }
  }
}

export async function addBookmarkToFolder(
  session: { access_token: string },
  folderId: number,
  bookmarkId: number,
): Promise<ApiResponse<null>> {
  const res = await client.api.bookmark.folders[':folderId'].bookmarks.$post(
    { param: { folderId: folderId.toString() }, json: { bookmarkId } },
    auth(session.access_token),
  )
  if (!res.ok) return fail(res)
  return { data: null }
}

/* ================================================================
   ヘルパ
================================================================ */
async function fail(res: Response): Promise<{ error: string }> {
  let msg = 'API error'
  try {
    const json = await res.json()
    msg = json.error ?? msg
  } catch {}
  // 404エラーは正常なケースとして扱う
  if (res.status !== 404) {
    console.error('API error', res.status, msg)
  }
  return { error: msg }
}
