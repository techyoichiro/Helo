import { Metadata } from "next"
import { Bookmark, User, Settings, HelpCircle } from "lucide-react"
import { Sidebar } from "@/app/components/layouts/sidebar"
import { ContentWrapper } from "@/app/components/layouts/ContentWrapper"

export const metadata: Metadata = {
  title: "Dashboard | Helo",
  description: "Dashboard for managing your bookmarks and settings",
}

const sidebarNavItems = [
  {
    title: "ブックマーク",
    href: "/dashboard",
    icon: <Bookmark className="h-4 w-4" />,
  },
  {
    title: "プロフィール",
    href: "/dashboard/profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    title: "設定",
    href: "/dashboard/settings",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: "ガイドとヘルプ",
    href: "/dashboard/support",
    icon: <HelpCircle className="h-4 w-4" />,
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ContentWrapper>
      <div className="flex flex-col md:flex-row mt-8">
        {/* モバイル時は上部に表示、デスクトップ時は左側に表示 */}
        <Sidebar items={sidebarNavItems} />
        <section className="flex-1 md:ml-6">{children}</section>
      </div>
    </ContentWrapper>
  )
}
