"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/utils/utils"
import { Button } from "@/app/components/common/button"
import { SidebarProps } from "@/app/types/common"

export function Sidebar({ className, items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-48 bg-background sticky top-[1.8rem] h-[calc(100vh-1.8rem)] mr-6", className)}>
      <div className="space-y-4">
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start rounded-3xl",
                  isActive
                    ? "bg-orange-100 text-orange-600 font-bold" // アクティブ時のスタイル
                    : "text-muted-foreground hover:bg-gray-100"
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  <span className="ml-2">{item.title}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
