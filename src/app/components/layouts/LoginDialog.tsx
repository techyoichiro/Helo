"use client";

import { useState, useEffect, useCallback } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { createSupabaseClient } from '@/app/lib/utils/supabase/client';
import { Provider } from '@supabase/supabase-js';
import { LoginButton } from '@/app/components/layouts/LoginButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/elements/ui/dialog";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
}

export function LoginDialog({ isOpen, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        onLoginSuccess();
        onOpenChange(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [onLoginSuccess, router, supabase.auth, onOpenChange]);

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-4xl font-bold">Helo</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Heloはブックマーク機能を提供します。トレンドの情報やアイデアを保存して活用しましょう。
          </DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}

