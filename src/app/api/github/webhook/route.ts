import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { verify } from 'jsonwebtoken'
import { z } from 'zod'

// GitHub Webhookのペイロードの型定義
const GitHubWebhookPayload = z.object({
  action: z.string().optional(),
  repository: z.object({
    name: z.string(),
    full_name: z.string(),
    html_url: z.string(),
  }),
  sender: z.object({
    login: z.string(),
    avatar_url: z.string(),
  }),
  // 必要に応じて他のフィールドを追加
})

export async function POST(request: Request) {
  try {
    // GitHub Webhookのシークレットを検証
    const signature = request.headers.get('x-hub-signature-256')
    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 401 })
    }

    const payload = await request.json()
    
    // ペイロードの検証
    const validatedPayload = GitHubWebhookPayload.safeParse(payload)
    if (!validatedPayload.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // ここでGitHubのイベントを処理
    // 例: リポジトリの更新をブックマークに追加するなど
    const supabase = await createClient()
    
    // イベントタイプに応じた処理
    const eventType = request.headers.get('x-github-event')
    switch (eventType) {
      case 'push':
        // プッシュイベントの処理
        await handlePushEvent(validatedPayload.data, supabase)
        break
      case 'issues':
        // イシューイベントの処理
        await handleIssueEvent(validatedPayload.data, supabase)
        break
      // 必要に応じて他のイベントタイプを追加
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('GitHub webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePushEvent(payload: z.infer<typeof GitHubWebhookPayload>, supabase: any) {
  // プッシュイベントの処理を実装
  // 例: リポジトリの更新をブックマークに追加
  try {
    // ここにプッシュイベントの処理を実装
    console.log('Handling push event:', payload)
  } catch (error) {
    console.error('Error handling push event:', error)
  }
}

async function handleIssueEvent(payload: z.infer<typeof GitHubWebhookPayload>, supabase: any) {
  // イシューイベントの処理を実装
  try {
    // ここにイシューイベントの処理を実装
    console.log('Handling issue event:', payload)
  } catch (error) {
    console.error('Error handling issue event:', error)
  }
} 