// src/app/profile/page.tsx

import { createClient } from '@/app/lib/supabase/server';
import { ProfileClient } from './ProfileClient';
import { CombinedUser, SessionUser } from '@/app/types/user';

export default async function Page() {
    const supabase = await createClient();

    try {
        // 認証されたユーザー情報を取得
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            // ユーザーが存在しない場合またはエラーが発生した場合
            return <ProfileClient initialUser={null} />;
        }

        const user = userData.user as CombinedUser;

        // 必要なユーザーデータを抽出
        const avatarUrl = user.avatarUrl || null;
        const fullName = user.user_metadata?.fullName || null;
        const email = user.email || null;

        // 連携プロバイダー情報を取得
        const providers = user.app_metadata?.providers || [];

        return (
            <ProfileClient
                initialUser={{
                    user,
                    avatarUrl,
                    fullName,
                    email,
                    providers: providers,
                }}
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
