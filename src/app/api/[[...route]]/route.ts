import { Hono } from "hono"
import { handle } from "hono/vercel"
import type { PageConfig } from 'next'

import articles from "./articles"
import bookmark from "./bookmark"

export const runtime = "nodejs"

export const config: PageConfig = { api: { bodyParser: false } };

// basePath は API ルートのベースパスを指定します
// 以降、新たに生やす API ルートはこのパスを基準に追加されます
const app = new Hono().basePath('/api')
const route = app
    .route('/articles', articles)
    .route('/bookmark', bookmark)

export type AppType = typeof route

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);