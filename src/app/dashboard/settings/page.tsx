import { createClient } from '@/app/lib/supabase/server';
import { SettingsClient } from '@/app/dashboard/settings/SettingsClient';
import { CombinedUser } from '@/app/types/user';
import { fetchBookmarkCount } from '@/app/lib/api/bookmark';

export default async function SettingsPage() {
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

    const count = await fetchBookmarkCount(session)

    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            return <SettingsClient initialUser={null} />;
        }

        const user = userData.user as CombinedUser;

        const avatarUrl = user?.user_metadata?.avatar_url || null;
        const fullName = user.user_metadata?.full_name || null;
        const email = user.email || null;
        const providers = user.app_metadata?.providers || [];

        return (
            <SettingsClient
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
            if (error.name === 'AuthSessionMissingError') {
                return <SettingsClient initialUser={null} />;
            }
            console.error('Unexpected error fetching authenticated user:', error.message);
        } else {
            console.error('An unknown error occurred:', error);
        }

        return <SettingsClient initialUser={null} />;
    }
}
  
  