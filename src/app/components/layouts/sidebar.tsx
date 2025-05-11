"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/utils/utils"
import { Button } from "@/app/components/common/button"
import { SidebarProps } from "@/app/types/common"

export function Sidebar({ className, items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "w-full mb-4 scrollbar-hide bg-background overflow-y-auto md:pb-12 md:w-48 md:sticky md:top-[1.8rem] md:h-[calc(100vh-1.8rem)] md:mr-6",
        className
      )}
    >
      <div
        // モバイルでは横並び、デスクトップでは縦並び
        className="flex flex-row items-center justify-around space-x-0 md:space-x-4 md:flex-col md:space-x-0 md:space-y-4"
      >
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant="ghost"
              // モバイル時は幅自動、デスクトップでは全幅
              className={cn(
                "flex items-center rounded-3xl",
                isActive
                  ? "bg-orange-100 text-orange-600 font-bold"
                  : "text-muted-foreground hover:bg-gray-100",
                "w-auto md:w-full justify-start"
              )}
              asChild
            >
              <Link href={item.href}>
                {item.icon}
                <span className="ml-0.5 md:ml-2">{item.title}</span>
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
