'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/common/dropdown-menu"
import { Button } from "../common/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/common/avatar"
import { Bookmark, LucideUser } from 'lucide-react'
import { LoginDialog } from "@/app/components/common/LoginDialog"
import { signOut } from '@/app/actions/auth'
import { createBrowserSupabase } from '@/app/lib/supabase/client'
import { HeaderActionsClientProps } from '@/app/types/user'
import Link from "next/link"

export function HeaderActionsClient({ initialUser }: HeaderActionsClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
      
      await signOut()
      
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleDashboard = async () => {
    router.push('/dashboard')
  }

  const handleSetting = async () => {
    router.push('/dashboard/settings')
  }

  const handleGuide = async () => {
    router.push('/guide')
  }

  const handleLoginSuccess = () => {
    setIsOpen(false)
    router.refresh()
  }
  
  const avatarUrl = initialUser?.avatarUrl
  const fullName = initialUser?.fullName
  const email = initialUser?.email

  return (
    <>
      {initialUser ? (
        <><Link href="/dashboard">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bookmark className="h-5 w-5 text-gray-800" />
          </Button>
        </Link><DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-4">
                <Avatar>
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="プロフィール" />
                  ) : (
                    <AvatarFallback>
                      <LucideUser className="h-6 w-6" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>{fullName || email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDashboard}>ブックマーク</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSetting}>設定</DropdownMenuItem>
              <DropdownMenuItem onClick={handleGuide}>ガイドとヘルプ</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>ログアウト</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu></>
      ) : (
        <>
          <Button onClick={() => setIsOpen(true)}>ログイン</Button>
          <LoginDialog
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      )}
    </>
  )
}

