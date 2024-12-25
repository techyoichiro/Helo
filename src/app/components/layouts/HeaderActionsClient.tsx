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
} from "@/app/components/elements/ui/dropdown-menu"
import { Button } from "../elements/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/elements/ui/avatar"
import { LucideUser } from 'lucide-react'
import { LoginDialog } from "./LoginDialog"
import { signOut } from '@/app/actions/auth'
import { createClient } from '@/app/lib/utils/supabase/client'

interface User {
  user: any
  avatarUrl?: string
  fullName?: string
  email?: string
}

interface HeaderActionsClientProps {
  initialUser: User | null
}

export function HeaderActionsClient({ initialUser }: HeaderActionsClientProps) {
  const [user, setUser] = useState(initialUser?.user || null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      await signOut()
      
      setUser(null)
      
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleLoginSuccess = () => {
    setIsOpen(false)
    router.refresh()
  }
  
  const avatarUrl = user?.user_metadata?.avatar_url
  const fullName = user?.user_metadata?.full_name
  const email = user?.email

  return (
    <>
      {user ? (
        <DropdownMenu>
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
            <DropdownMenuItem>プロフィール</DropdownMenuItem>
            <DropdownMenuItem>ブックマーク</DropdownMenuItem>
            <DropdownMenuItem>設定</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>ログアウト</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

