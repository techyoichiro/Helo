import { LucideUser } from 'lucide-react'
import { HeaderActionsClientProps } from '@/app/types/user'
import { Badge } from "@/app/components/common/badge"

export function ProfileClient({ initialUser }: HeaderActionsClientProps) {
  const avatarUrl = initialUser?.avatarUrl || null
  const fullName = initialUser?.fullName || null
  const providers = initialUser?.providers || []

  return (
    <div className="flex flex-col items-start p-4">
      {/* アイコンと名前を横に並べる */}
      <div className="flex items-center">
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

        {fullName && (
          <span className="ml-4 text-xl font-semibold">
            {fullName}
          </span>
        )}
      </div>

      {providers.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">連携済み:</span>
          {providers.map((provider) => (
            <Badge key={provider} provider={provider} />
          ))}
        </div>
      )}
    </div>
  )
}
