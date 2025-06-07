'use client'

import { LucideUser } from 'lucide-react'
import { ProfileClientProps } from '@/app/types/user'
import { Badge } from "@/app/components/common/badge"
import { createBrowserSupabase } from '@/app/lib/supabase/client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/app/components/common/dialog'
import { loadStripe } from '@stripe/stripe-js'

export function SettingsClient({ initialUser, count }: ProfileClientProps) {
  const [isUnlinking, setIsUnlinking] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const router = useRouter()
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

  // Stripe決済ボタン押下時の処理
  const handleStripeCheckout = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', { method: 'POST' })
      const data = await res.json()
      if (!data.url) throw new Error('Checkout URLが取得できませんでした')
      // Stripe Checkoutにリダイレクト
      window.location.href = data.url
    } catch (err) {
      toast.error('決済ページへの遷移に失敗しました')
    } finally {
      setIsLoading(false)
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
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="max-w-2xl">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 左：できることリスト＋イラスト */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <DialogHeader>
                <DialogTitle>Premiumでできること</DialogTitle>
                <DialogDescription>
                  <ul className="mt-4 space-y-3 text-left">
                    <li className="flex items-center gap-2">
                      <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" fill="#facc15" /></svg>
                      フォルダ作成数が無制限
                    </li>
                    <li className="flex items-center gap-2">
                      <svg width="24" height="24" fill="none"><rect x="4" y="4" width="16" height="16" fill="#fbbf24" /></svg>
                      優先サポート
                    </li>
                    <li className="flex items-center gap-2">
                      <svg width="24" height="24" fill="none"><polygon points="12,2 22,22 2,22" fill="#fde68a" /></svg>
                      今後の新機能を先行利用
                    </li>
                  </ul>
                </DialogDescription>
              </DialogHeader>
            </div>
            {/* 右：Stripe決済ボタン */}
            <div className="flex-1 flex flex-col items-center justify-center border-l pl-6">
              <h3 className="font-bold mb-4">アップグレードはこちら</h3>
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded shadow disabled:opacity-60"
                onClick={handleStripeCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'リダイレクト中...' : 'Stripeで決済'}
              </button>
            </div>
          </div>
          <DialogClose asChild>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">×</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
