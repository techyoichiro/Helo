import type { Context, Next } from 'hono'
import { getSupabaseClient, supabaseAdmin } from '@/app/lib/supabase/edge'
import type { Env, AppState } from './types'

export async function authMiddleware(
  c: Context<{
    Bindings: Env
    Variables: AppState
  }>,
  next: Next
) {
  // ─── 1) トークン取得 ─────────────────────────
  const bearer = c.req.header('Authorization')    // "Bearer xxx"
  const token  = bearer?.split(' ')[1]
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // ─── 2) Supabase Auth でユーザー検証 ────────────
  const supabase = getSupabaseClient(token)
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // ─── 3) Service Role 版でも DB からユーザー行を取得 ───
  const { data: dbUser, error: dbErr } = await supabaseAdmin
    .from('users')
    .select('id, subscription_status')
    .eq('id', user.id)
    .single()
  if (dbErr || !dbUser) {
    return c.json({ error: 'User not found' }, 404)
  }

  // ─── 4) Context にセット ────────────────────────
  c.set('supabase',       supabase)
  c.set('supabaseAdmin',  supabaseAdmin)
  c.set('user',           dbUser)
  c.set('isSubscribed',   dbUser.subscription_status === 'premium')

  await next()
}



/* ──────────────────────────────
 * 💳  サブスク判定ミドルウェア
 * ──────────────────────────── */
// export async function subscriptionMiddleware (c: Context, next: Next) {
//   const user = c.get<UserRow>('user')     // 型安全に取得
//   c.set('isSubscribed', user.subscription_status === 'premium')
//   await next()
// }
