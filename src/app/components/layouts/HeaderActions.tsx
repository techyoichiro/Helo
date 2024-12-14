"use client";

import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "@/app/lib/hooks/useUserStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../elements/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../elements/ui/dropdown-menu";
import { Button } from "../elements/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../elements/ui/avatar";
import { LucideUser } from 'lucide-react';
import Login from "./Login";

export function HeaderActions() {
  const { user, loading, fetchUserData, logout } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const memoizedFetchUserData = useCallback(fetchUserData, [fetchUserData]);

  useEffect(() => {
    memoizedFetchUserData();
  }, [memoizedFetchUserData]);

  const handleLogout = async () => {
    await logout();
  };

  const handleLoginSuccess = async () => {
    setIsOpen(false);
    await memoizedFetchUserData();
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  const avatarUrl = user?.user_metadata?.avatarUrl ;
  const fullName = user?.user_metadata?.fullName;
  const email = user?.email;

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full ml-4">
              <Avatar>
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Profile" />
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
        <AlertDialog open={isOpen}>
          <AlertDialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>ログイン</Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogTitle></AlertDialogTitle>
            <Login
              onClose={() => setIsOpen(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

