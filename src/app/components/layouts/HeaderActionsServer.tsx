import { createClient } from '@/app/lib/utils/supabase/server'
import { HeaderActionsClient } from './HeaderActionsClient'

export async function HeaderActionsServer() {
  const supabase = await createClient()
  const { data: session, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error fetching session:', error)
    return null
  }

  if (!session || !session.session) {
    // セッションが存在しない場合は初期ユーザーを null として設定
    return <HeaderActionsClient initialUser={null} />
  }

  const user = session.session.user

  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name
  const email = user.email

  return <HeaderActionsClient initialUser={{ user, avatarUrl, fullName, email }} />
}
