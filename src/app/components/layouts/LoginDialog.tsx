'use client'

import { useState } from "react"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { LoginButton } from '@/app/components/layouts/LoginButton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/elements/ui/dialog"
import { signIn } from '@/app/actions/auth'

interface LoginDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onLoginSuccess: () => void
}

export function LoginDialog({ isOpen, onOpenChange }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true)
    try {
      await signIn(provider)
    } catch (error) {
      console.error(`${provider}ログインエラー:`, error)
      let errorMessage = `${provider}ログインに失敗しました。再試行してください。`
      if (error instanceof Error) {
        errorMessage += ` エラー: ${error.message}`
      }
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

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
            onClick={() => handleLogin('google')}
            isLoading={isLoading}
          />
          <LoginButton
            provider="github"
            icon={<FaGithub className="h-5 w-5 mr-3" />}
            text="GitHubでログイン"
            onClick={() => handleLogin('github')}
            isLoading={isLoading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

