import { createClient } from '@/app/lib/utils/supabase/server'
import { HeaderActionsClient } from './HeaderActionsClient'

export async function HeaderActionsServer() {
  const supabase = await createClient()

  try {
    // 認証されたユーザー情報を取得
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      // ユーザーが存在しない場合
      return <HeaderActionsClient initialUser={null} />
    }

    const user = userData.user

    // 必要なユーザーデータを抽出
    const avatarUrl = user.user_metadata?.avatar_url || null
    const fullName = user.user_metadata?.full_name || null

    return (
      <HeaderActionsClient
        initialUser={{
          user,
          avatarUrl,
          fullName,
        }}
      />
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      // セッションがない場合はエラーを無視してログアウト状態を処理
      if (error.name === 'AuthSessionMissingError') {
        return <HeaderActionsClient initialUser={null} />
      }

      console.error('Unexpected error fetching authenticated user:', error.message)
    } else {
      console.error('An unknown error occurred:', error)
    }

    return <HeaderActionsClient initialUser={null} />
  }
}
