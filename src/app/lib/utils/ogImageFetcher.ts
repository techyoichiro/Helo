import * as cheerio from 'cheerio';

// シンプルなキャッシュ実装
const cache = new Map<string, { value: string; timestamp: number }>();
const CACHE_TTL = 3600 * 1000; // 1時間

export const getOgImageUrl = async (url: string): Promise<string | undefined> => {
  // キャッシュをチェック
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.value;
  }

  try {
    // URLにリクエストを送信
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`ページの取得に失敗しました。ステータス: ${response.status}`);
      return undefined;
    }

    const html = await response.text();

    // cheerioでHTMLをパース
    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr('content');

    if (ogImage) {
      // キャッシュに保存
      cache.set(url, { value: ogImage, timestamp: Date.now() });
    }

    return ogImage || undefined;
  } catch (error) {
    console.error('OG画像の取得中にエラーが発生しました:', error);
    return undefined;
  }
};
