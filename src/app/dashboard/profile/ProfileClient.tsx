'use client'

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/common/avatar"
import { LucideUser } from 'lucide-react'
import { HeaderActionsClientProps } from '@/app/types/user'

export function ProfileClient({ initialUser }: HeaderActionsClientProps) {
  const [user] = useState(initialUser?.user || null)
  
  const avatarUrl = user?.user_metadata?.avatar_url
  const fullName = user?.user_metadata?.full_name

  return (
    <div className="flex items-center">
      <Avatar className="h-16 w-16">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="プロフィール" />
        ) : (
          <AvatarFallback>
            <LucideUser className="h-8 w-8" />
          </AvatarFallback>
        )}
      </Avatar>
      {fullName && (
        <span className="ml-4 text-xl font-semibold">
          {fullName}
        </span>
      )}
    </div>
  )
}
