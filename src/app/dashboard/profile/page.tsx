import { createClient } from '@/app/lib/supabase/server';
import { ProfileClient } from './ProfileClient';
import { CombinedUser } from '@/app/types/user';
import { fetchBookmarkCount } from '@/app/lib/api/bookmark';

export default async function Page() {
    const supabase = await createClient()

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser()
  
    if (userErr || !user) {
      return (
        <div className="py-10 text-center text-red-500">
          ログインが必要です
        </div>
      )
    }

    /* 2. アクセストークンを取得（Cookie から JWT を読むだけ） */
    const {
        data: { session },
        error: sessErr,
    } = await supabase.auth.getSession()

    if (sessErr || !session?.access_token) {
        return (
        <div className="py-10 text-center text-red-500">
            セッションの取得に失敗しました
        </div>
        )
    }

    if (!user || !session?.access_token) {
        console.log('BookmarksPage: No valid session found')
        return (
        <div className="text-center py-10">
            <p className="text-red-500">ブックマークを取得するにはログインが必要です</p>
        </div>
        )
    }
    const count = await fetchBookmarkCount(session)

    try {
        // 認証されたユーザー情報を取得
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            // ユーザーが存在しない場合またはエラーが発生した場合
            return <ProfileClient initialUser={null} />;
        }

        const user = userData.user as CombinedUser;

        // 必要なユーザーデータを抽出
        const avatarUrl = user?.user_metadata?.avatar_url || null;
        const fullName = user.user_metadata?.full_name || null;
        const email = user.email || null;

        // 連携プロバイダー情報を取得
        const providers = user.app_metadata?.providers || [];

        return (
            <ProfileClient
                initialUser={{
                    avatarUrl,
                    fullName,
                    email,
                    providers: providers,
                }}
                count={count.data}
            />
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            // セッションがない場合はエラーを無視してログアウト状態を処理
            if (error.name === 'AuthSessionMissingError') {
                return <ProfileClient initialUser={null} />;
            }

            console.error('Unexpected error fetching authenticated user:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }

        return <ProfileClient initialUser={null} />;
    }
}
