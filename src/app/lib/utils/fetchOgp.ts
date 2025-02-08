import { load } from 'cheerio'

export async function fetchOgp(url: string) {
  // 1. fetch URL
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}, status: ${res.status}`)
  }

  // 2. HTMLをテキストで取得
  const html = await res.text()

  // 3. cheerioでパース（loadを直接利用）
  const $ = load(html)

  // 4. OGP情報を取得
  const titleTag = $("title").text()
  const ogTitle = $('meta[property="og:title"]').attr('content')
  const ogImage = $('meta[property="og:image"]').attr('content')

  // 例: OGP優先、なければ<title>タグを使う
  const finalTitle = ogTitle || titleTag || "No Title"

  return {
    title: finalTitle,
    ogImage: ogImage || null,
  }
}
