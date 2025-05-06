/* ------------------------------------------------------------------
 *  Supabase 認証ユーザー  ＋  DB(users テーブル) の行データ ＝ CombinedUser
 * ---------------------------------------------------------------- */
import type { User as SupabaseAuthUser } from '@supabase/supabase-js'
import { users }                         from '@/server/db/schema'

/* ────────────── 1. DB 行型 ────────────── */
export type UserRow   = typeof users.$inferSelect   // 1 行取得時
export type NewUser   = typeof users.$inferInsert   // INSERT 用

/* ────────────── 2. CombinedUser ─────────
 * SupabaseAuthUser … Supabase が返す「認証ユーザー」(id / email など)
 * UserRow           … DB に保存しているプロフィール情報
 * ---------------------------------------------------------------- */
export type CombinedUser = Omit<SupabaseAuthUser, 'id'>  // ← id は DB 側を使うので除外
                       & UserRow                         // DB の列（id, fullName …）
                       & {                               // optional な user_metadata
                           user_metadata?: {
                             fullName?:  string
                             avatarUrl?: string
                           }
                         }

/* ────────────── 3. SessionUser (フロント用ライト版) ────────────── */
export interface SessionUser {
  avatarUrl?: string | null
  fullName?:  string | null
  email?:     string | null
  /** サインイン済みプロバイダー（google など）*/
  providers?: string[]
}

/* ────────────── 4. コンポーネント用 Props ────────────── */
export interface HeaderActionsClientProps {
  initialUser: SessionUser | null
}

export interface ProfileClientProps {
  initialUser: SessionUser | null
  /** 自分のブックマーク総数（任意）*/
  count?: number
}
