'use client'

import { LucideUser } from 'lucide-react'
import { ProfileClientProps } from '@/app/types/user'
import { Badge } from "@/app/components/common/badge"
import { createBrowserSupabase } from '@/app/lib/supabase/client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter, usePathname } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/app/components/common/dialog'
import { loadStripe } from '@stripe/stripe-js'
import { UpgradeModal } from '@/app/components/features/bookmarks/UpgradeModal'

export function SettingsClient({ initialUser, count }: ProfileClientProps) {
  const [isUnlinking, setIsUnlinking] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const avatarUrl = initialUser?.avatarUrl || null
  const fullName = initialUser?.fullName || null
  const providers = initialUser?.providers || []
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Premium状態を取得
    fetch('/api/user/subscription', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsSubscribed(data.isSubscribed ?? false))
      .catch(() => setIsSubscribed(false))
  }, [])

  const handleUnlinkProvider = async (provider: string) => {
    try {
      setIsUnlinking(provider)
      const supabase = createBrowserSupabase()
      
      // 現在のプロバイダーが1つだけの場合は解除できない
      if (providers.length <= 1) {
        toast.error('少なくとも1つの認証方法が必要です')
        return
      }

      // 現在のセッションを取得
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('セッションが見つかりません')
      }

      // 現在のユーザー情報を取得
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('ユーザー情報が見つかりません')
      }

      // 残りのプロバイダーを取得（解除対象を除く）
      const remainingProviders = providers.filter(p => p !== provider)
      if (remainingProviders.length === 0) {
        throw new Error('少なくとも1つの認証方法が必要です')
      }

      // 現在のセッションを保存
      const currentSession = session

      // ログアウト
      await supabase.auth.signOut()

      // 残りのプロバイダーのいずれかで再ログインを促す
      toast.success('再ログインが必要です。別の認証方法でログインしてください。')
      
      // ログインページにリダイレクト
      router.push('/login')
    } catch (error) {
      console.error('Error unlinking provider:', error)
      toast.error('連携解除に失敗しました')
    } finally {
      setIsUnlinking(null)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">設定</h1>

      <div className="space-y-8">
        {/* プロフィールセクション */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">プロフィール</h2>
          <div className="flex items-center">
            {/* 左側：プロフィール写真 */}
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="プロフィール"
                  className="h-full w-full object-cover"
                />
              ) : (
                <LucideUser className="h-12 w-12 text-gray-600" />
              )}
            </div>

            {/* 右側：縦に並ぶ３つの要素 */}
            <div className="ml-2 md:ml-6 flex flex-col justify-center space-y-2">
              {/* 1. 名前 */}
              <div className="text-xl font-semibold">
                {fullName}
              </div>

              {/* 2. ブックマーク数 */}
              <div className="text-sm font-semibold">
                ブックマークした数: {count}
              </div>

              {/* 3. 連携プロバイダー */}
              <div className="flex items-center">
                {providers.length > 0 && (
                  <>
                    <span className="text-sm font-medium text-gray-700 mr-2">連携済み:</span>
                    <div className="flex flex-wrap gap-2">
                      {providers.map((provider) => (
                        <div key={provider} className="flex items-center gap-2">
                          <Badge provider={provider} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Premiumバッジ表示 */}
              {isSubscribed === true && (
                <span className="inline-block bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">Premium</span>
              )}
            </div>
          </div>
        </div>

        {/* 設定セクション */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">アプリケーション設定</h2>
          <div className="space-y-4">
            {/* Premium未加入ならアップグレードボタン */}
            {isSubscribed === false && (
              <button
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-2 px-4 rounded shadow hover:opacity-90 transition"
                onClick={() => setUpgradeOpen(true)}
              >
                Premiumにアップグレード
              </button>
            )}
            {/* ここに設定項目を追加 */}
            <p className="text-sm text-muted-foreground">
              設定項目は準備中です
            </p>
          </div>
        </div>
      </div>

      {/* Premiumアップグレードモーダル */}
      <UpgradeModal isOpen={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  )
}
