"use client";

import { useState, useEffect } from "react";
import { X } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { Button } from "@/app/components/elements/ui/button";
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/app/lib/utils/supabase/client'

interface LoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function Login({ onClose, onLoginSuccess }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        onLoginSuccess();
        router.push('/dashboard');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onLoginSuccess, router]);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error initiating GitHub login:", error);
      let errorMessage = "GitHubログインに失敗しました。再試行してください。";
      if (error instanceof Error) {
        errorMessage += ` エラー: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
        <X className="h-5 w-5" />
      </button>
      <div className="mb-2 text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="text-black text-4xl font-bold">Helo</div>
        </div>
        <p className="text-gray-600 mb-2 text-sm">
          Heloはブックマーク機能を提供します。トレンドの情報やアイデアを保存して活用しましょう。
        </p>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={handleGithubLogin}
          className="rounded-full py-6 flex items-center justify-center hover:bg-gray-100 border font-semibold w-[260px]"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
          ) : (
            <>
              <FaGithub className="h-5 w-5 mr-3" />
              GitHubでログイン
            </>
          )}
        </Button>
      </div>
    </>
  );
}

