"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUserStore } from '@/app/lib/hooks/useUserStore';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const fetchUserData = useUserStore(state => state.fetchUserData);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);

        if (error) {
          console.error("Error exchanging code for session:", error);
          alert("認証コードの交換に失敗しました。詳細はコンソールを確認してください。");
          router.push('/auth/auth-code-error');
          return;
        }

        console.log("Successfully authenticated");
        await fetchUserData();  // ユーザーデータを取得し、ストアを更新
        router.push('/'); // ログイン成功時にリダイレクト
      } catch (err) {
        console.error("Unexpected error during auth callback:", err);
        alert("不明なエラーが発生しました。詳細はコンソールを確認してください。");
        router.push('/auth/auth-code-error');
      }
    };

    handleAuthCallback();
  }, [router, supabase, fetchUserData]);

  return <div>認証処理を実行中...</div>;
}

