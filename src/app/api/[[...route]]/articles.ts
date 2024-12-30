import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { formatISO } from 'date-fns'
import { Article } from '@/app/types/types'
import { getOgImageUrl } from '@/app/lib/utils/ogImageFetcher'
import { QiitaItem } from '@/app/types/types'

const schema = z.object({
    topic: z.string()
})

const QIITA_URL = process.env.QIITA_ENDPOINT_URL
const QIITA_API_KEY = process.env.QIITA_API_KEY
const ZENN_URL = process.env.ZENN_ENDPOINT_URL

// Qiitaから記事を取得
const fetchQiitaPosts = async (url: string): Promise<Article[]> => {
    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${QIITA_API_KEY}`
    };

    try {
        const res = await fetch(url, { headers });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const text = await res.text();
        let json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse Qiita response:', text);
            throw new Error('Invalid JSON response from Qiita');
        }

        if (!Array.isArray(json)) {
            throw new Error('Unexpected Qiita API response format');
        }

        return Promise.all(json.map(async (item: QiitaItem) => ({
            topics: item.tags.map(tag => tag.name),
            title: item.title,
            published_at: item.created_at,
            url: item.url,
            og_image_url: await getOgImageUrl(item.url)
        })));
    } catch (err) {
        console.error('Error fetching Qiita posts:', err);
        throw err;
    }
};

// Qiita：トレンド記事
const getQiitaTrendingPosts = async (): Promise<Article[]> => {
    const nowdate = new Date();
    const limitdate = formatISO(nowdate.setDate(nowdate.getDate() - 10), { representation: 'date' });
    return fetchQiitaPosts(`${QIITA_URL}items?page=1&per_page=10&query=created%3A%3E${limitdate}+stocks%3A%3E20`);
};

// Qiita：タグ
const getQiitaPostsByTags = async (tag: string): Promise<Article[]> => {
    return fetchQiitaPosts(`${QIITA_URL}items?query=tag%3A${tag}+stocks%3A%3E20`);
};

// Qiita：最新記事
const getQiitaLatestPosts = async (): Promise<Article[]> => {
    return fetchQiitaPosts(`${QIITA_URL}items`);
};

// Zennから記事を取得
const fetchZennData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch Zenn posts');
    }
    return await response.json();
};

// スラグで記事の詳細を取得
const getZennArticleDetails = async (slug: string, path: string): Promise<Article> => {
    const details = await fetchZennData(`${ZENN_URL}/api/articles/${slug}`);
    const { title, topics, published_at, og_image_url } = details.article;
    return {
        title,
        url: `${ZENN_URL}${path}`,
        og_image_url,
        topics: topics ? topics.map((topic: any) => topic.display_name) : [],
        published_at
    };
};

// Zennの記事を取得する
const getZennPostsWithDetails = async (url: string): Promise<Article[]> => {
    const posts = await fetchZennData(url);
    return Promise.all(posts.articles.map((post: any) => getZennArticleDetails(post.slug, post.path)));
};

// Hono application
const app = new Hono()

    // トップページ
    // トレンド記事取得
    .get('/', async (c) => {
        try {
            const zennPosts = await getZennPostsWithDetails(`${ZENN_URL}/api/articles?count=10`);
            const qiitaPosts = await getQiitaTrendingPosts();
            const allPosts = [...zennPosts, ...qiitaPosts];

            // 日付順にソート (降順: 最新順)
            const sortedPosts = allPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

            return c.json(sortedPosts);
        } catch (error) {
            console.error('Failed to fetch trendPosts:', error);
            return c.json({ error: 'Failed to fetch posts' }, 500);
        }
    })
    
    .get('/:topic', zValidator('param', schema), async (c) => {
        try {
            const { topic } = c.req.valid('param')
            const zennPosts = await getZennPostsWithDetails(`${ZENN_URL}/api/articles?topicname=${topic}`);
            const qiitaPosts = await getQiitaPostsByTags(topic);
            return c.json([...zennPosts, ...qiitaPosts]);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            return c.json({ error: 'Failed to fetch posts' }, 500);
        }
    })


    // 最新記事取得
    .get('/latest', async (c) => {
        try {
            const zennPosts = await getZennPostsWithDetails(`${ZENN_URL}/api/articles?order=latest`);
            const qiitaPosts = await getQiitaLatestPosts();
            return c.json([...zennPosts, ...qiitaPosts]);
        } catch (error) {
            console.error('Failed to fetch latest posts:', error);
            return c.json({ error: 'Failed to fetch latest posts' }, 500);
        }
    })

export default app;
