"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/elements/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function Sidebar({ className, items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 w-48 bg-background sticky top-[1.8rem] h-[calc(100vh-1.8rem)]", className)}>
      <div className="space-y-4">
            <div className="space-y-1">
              {items.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-accent"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
      </div>
    </div>
  )
}

