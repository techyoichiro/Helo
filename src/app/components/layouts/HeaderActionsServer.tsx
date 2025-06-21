// src/app/components/layouts/header/HeaderActionsServer.tsx
import { createClient }         from '@/app/lib/supabase/server'
import { HeaderActionsClient }  from './HeaderActionsClient'

export const dynamic = 'force-dynamic'

export async function HeaderActionsServer() {
  /* ────────── Supabase Server Client ────────── */
  const supabase = await createClient()

  /* 1. ユーザーを取得（リモート検証） */
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  /* 2. 取得失敗 or 未ログインなら null を渡して終了 */
  if (error || !user) {
    return <HeaderActionsClient initialUser={null} />
  }

  /* 3. SessionUser 形式で必要データを抽出 */
  const initialUser = {
    user,                                       // 👈 必須
    avatarUrl: user.user_metadata?.avatar_url ?? undefined,
    fullName:  user.user_metadata?.full_name  ?? undefined,
    email:     user.email                      ?? undefined,
  }

  return <HeaderActionsClient initialUser={initialUser} />
}