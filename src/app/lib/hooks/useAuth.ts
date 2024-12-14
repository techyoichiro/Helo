import { useEffect, useState, useCallback } from 'react';
import { createSupabaseClient } from '@/app/lib/utils/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    error: null,
  });

  const supabase = createSupabaseClient();

  const fetchSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      setAuthState(prev => ({
        ...prev,
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        session: null,
        user: null,
        loading: false,
        error: error instanceof Error ? error : new Error('認証エラーが発生しました'),
      }));
    }
  }, [supabase]);

  useEffect(() => {
    // 初期セッションの取得
    fetchSession();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          error: null,
        }));
      }
    );

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchSession]);

  // ログアウト関数の追加
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('ログアウト中にエラーが発生しました'),
      }));
    }
  }, [supabase]);

  return {
    ...authState,
    signOut,
    isAuthenticated: !!authState.session,
  };
};