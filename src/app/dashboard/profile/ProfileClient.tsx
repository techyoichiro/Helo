import { LucideUser } from 'lucide-react'
import { ProfileClientProps } from '@/app/types/user'
import { Badge } from "@/app/components/common/badge"

export function ProfileClient({ initialUser, count }: ProfileClientProps) {
  const avatarUrl = initialUser?.avatarUrl || null
  const fullName = initialUser?.fullName || null
  const providers = initialUser?.providers || []

  return (
    <div className="flex items-center px-4">
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
                  <Badge key={provider} provider={provider} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
