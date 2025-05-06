import type { SupabaseClient } from '@supabase/supabase-js'

export interface AppState {
  /** RLS 通過用に毎リクエスト生成するトークン付きクライアント */
  supabase: SupabaseClient
  /** Service Role 用の管理者クライアント */
  supabaseAdmin: SupabaseClient
  /** authMiddleware でセットする Supabase ユーザーオブジェクト */
  user:         { id: string; subscription_status: 'free'|'premium'; }
  /** subscriptionMiddleware でセット */
  isSubscribed?: boolean
}

export interface Env {}
