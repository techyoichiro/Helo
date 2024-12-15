"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from 'lucide-react';
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/app/lib/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { LoginButton } from '@/app/components/layouts/LoginButton';

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
  }, [onLoginSuccess, router, supabase.auth]);

  const handleLogin = useCallback(async (provider: Provider) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (error) {
      console.error(`Error initiating ${provider} login:`, error);
      let errorMessage = `${provider}ログインに失敗しました。再試行してください。`;
      if (error instanceof Error) {
        errorMessage += ` エラー: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  const handleGithubLogin = useCallback(() => handleLogin('github'), [handleLogin]);
  const handleGoogleLogin = useCallback(() => handleLogin('google'), [handleLogin]);

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
        <LoginButton
          provider="google"
          icon={<FaGoogle className="h-5 w-5 mr-3" />}
          text="Googleでログイン"
          onClick={handleGoogleLogin}
          isLoading={isLoading}
        />
        <LoginButton
          provider="github"
          icon={<FaGithub className="h-5 w-5 mr-3" />}
          text="GitHubでログイン"
          onClick={handleGithubLogin}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}

