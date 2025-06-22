'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { 
  User, 
  Settings, 
  Link, 
  CreditCard, 
  Trash2, 
  Edit3, 
  Shield, 
  Crown,
  Check,
  X,
  Github,
  Mail,
  Chrome
} from 'lucide-react'

import { updateProfile } from '@/app/actions/user'
import { UpgradeModal } from '@/app/components/features/bookmarks/UpgradeModal'
import { ProfileClientProps } from '@/app/types/user'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/app/components/common/alert-dialog'
import { Badge } from '@/app/components/common/badge'
import { Button } from '@/app/components/common/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/app/components/common/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/app/components/common/form'
import { Input } from '@/app/components/common/input'
import { useToast } from '@/app/components/common/use-toast'

const profileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: '2文字以上で入力してください。'
    })
    .max(50, {
      message: '50文字以内で入力してください。'
    })
})

type ProfileFormValues = z.infer<typeof profileSchema>

// プロバイダーアイコンのマッピング
const getProviderIcon = (provider: string) => {
  switch (provider.toLowerCase()) {
    case 'github':
      return Github
    case 'google':
      return Chrome
    case 'email':
      return Mail
    default:
      return Link
  }
}

// プロバイダー名の日本語化
const getProviderName = (provider: string) => {
  switch (provider.toLowerCase()) {
    case 'github':
      return 'GitHub'
    case 'google':
      return 'Google'
    case 'email':
      return 'メール'
    default:
      return provider
  }
}

export function SettingsClient({ initialUser }: ProfileClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false)
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const fullName = initialUser?.fullName || 'No Name'
  const providers = initialUser?.providers || []
  const avatarUrl = initialUser?.avatarUrl

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: fullName
    },
    mode: 'onChange'
  })

  useEffect(() => {
    fetch('/api/user/subscription')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => setIsSubscribed(data.isSubscribed ?? false))
      .catch(() => setIsSubscribed(false))
  }, [])

  async function onSubmit(data: ProfileFormValues) {
    setIsProfileSubmitting(true)
    try {
      await updateProfile(data)
      toast({
        title: '成功',
        description: 'プロフィールを更新しました。'
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'プロフィールの更新に失敗しました。',
        variant: 'destructive'
      })
    } finally {
      setIsProfileSubmitting(false)
    }
  }

  async function handleManageSubscription() {
    setIsSubscriptionLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST'
      })
      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      toast({
        title: 'エラー',
        description: '管理ページへの遷移に失敗しました。',
        variant: 'destructive'
      })
    } finally {
      setIsSubscriptionLoading(false)
    }
  }

  async function handleDeleteAccount() {
    toast({
      title: '準備中',
      description: 'アカウント削除機能は現在実装中です。'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 via-gray-900 to-black p-8 text-white shadow-2xl border-l-4 border-orange-400">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center space-x-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm border-2 border-orange-400/50 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="プロフィール"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                {isSubscribed && (
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-orange-400 flex items-center justify-center">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">設定</h1>
                <p className="text-gray-300 text-lg">
                  こんにちは、{fullName}さん
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-orange-400/30">
                    <Shield className="h-3 w-3 mr-1" />
                    {isSubscribed ? 'Premium' : 'Free'} プラン
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-orange-400/30">
                    <Link className="h-3 w-3 mr-1" />
                    {providers.length}個の連携
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-orange-300 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 border-2 border-orange-200 flex items-center justify-center">
                  <Edit3 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">プロフィール</CardTitle>
                  <CardDescription className="text-gray-600">
                    表示名とアカウント情報を管理
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">表示名</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="新しい表示名"
                            {...field}
                            className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20"
                          />
                        </FormControl>
                        <FormDescription className="text-gray-500">
                          他のユーザーに表示される名前です。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={isProfileSubmitting}
                    className="w-full bg-white border-2 border-orange-400 text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isProfileSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent"></div>
                        <span>更新中...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4" />
                        <span>表示名を更新</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Login Connections Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-orange-300 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 border-2 border-orange-200 flex items-center justify-center">
                  <Link className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">ログイン連携</CardTitle>
                  <CardDescription className="text-gray-600">
                    連携しているサービスを管理
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {providers.length > 0 ? (
                providers.map(provider => {
                  const IconComponent = getProviderIcon(provider)
                  const providerName = getProviderName(provider)
                  
                  return (
                    <div
                      key={provider}
                      className="group/item relative overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-orange-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative h-10 w-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center group-hover/item:border-orange-200 transition-colors duration-200">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{providerName}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" disabled className="text-gray-400 hover:text-gray-600">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="h-16 w-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto mb-4">
                    <Link className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">連携しているサービスがありません</p>
                  <p className="text-sm text-gray-500 mt-1">新しいサービスを連携してみましょう</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-orange-300 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 border-2 border-orange-200 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">サブスクリプション</CardTitle>
                  <CardDescription className="text-gray-600">
                    プランと請求情報を管理
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">現在のプラン</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {isSubscribed === null ? (
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent"></div>
                          <span className="text-gray-500">読み込み中...</span>
                        </div>
                      ) : (
                        <>
                          {isSubscribed ? (
                            <Crown className="h-5 w-5 text-orange-500" />
                          ) : (
                            <Shield className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="font-semibold text-lg text-gray-800">
                            {isSubscribed ? 'Premium' : 'Free'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              {isSubscribed ? (
                <Button
                  onClick={handleManageSubscription}
                  disabled={isSubscriptionLoading}
                  className="w-full bg-white border-2 border-orange-400 text-orange-600 hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubscriptionLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400 border-t-transparent"></div>
                      <span>準備中...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>請求情報を管理</span>
                    </div>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={() => setUpgradeOpen(true)}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4" />
                    <span>Premiumにアップグレード</span>
                  </div>
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Danger Zone Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-red-300 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gray-100 border-2 border-red-200 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-red-600">危険な操作</CardTitle>
                  <CardDescription className="text-gray-600">
                    アカウントの完全削除
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">
                  ⚠️ この操作は元に戻すことができません。アカウントと関連するすべてのデータが完全に削除されます。
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="w-full bg-white border-2 border-red-400 text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <Trash2 className="h-4 w-4" />
                      <span>アカウントを削除</span>
                    </div>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center space-x-2 text-red-600">
                      <Trash2 className="h-5 w-5" />
                      <span>本当に削除しますか？</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      この操作は元に戻すことができません。アカウントと関連するすべてのデータが完全に削除されます。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      削除
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </div>
      </div>

      <UpgradeModal isOpen={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  )
}
