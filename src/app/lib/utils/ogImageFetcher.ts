import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';
import { RateLimiter } from 'limiter';

// キャッシュとレートリミッターの初期化
const cache = new NodeCache({ stdTTL: 3600 }); // デフォルトTTL: 1時間
const limiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: 'second', // 1秒間に5リクエスト
});

export const getOgImageUrl = async (url: string): Promise<string | undefined> => {
  // キャッシュをチェック
  const cachedImage = cache.get<string>(url);
  if (cachedImage) {
    return cachedImage;
  }

  // レート制限のトークンを消費
  await limiter.removeTokens(1);

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
      cache.set(url, ogImage);
    }

    return ogImage || undefined;
  } catch (error) {
    console.error('OG画像の取得中にエラーが発生しました:', error);
    return undefined;
  }
};
