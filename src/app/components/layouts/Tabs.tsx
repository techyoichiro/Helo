"use client"

import { TabProps } from "@/app/types/common"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/app/lib/utils/utils"

/**
 * タブコンポーネント
 */
export function Tabs({ items, className, ...props }: TabProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex items-center space-x-2 border-b border-gray-200",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        // 現在のURL が item.href と一致していれば "アクティブ" と判断
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm transition-all",
              isActive
                ? "font-semibold text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-orange-600"
            )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
