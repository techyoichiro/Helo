import { Search, Bookmark } from 'lucide-react'
import { Button } from "@/app/components/common/button"
import { HeaderActionsServer } from "./HeaderActionsServer"
import Link from "next/link"
import Image from "next/image"

export default async function Header() {
  return (
    <header>
      <div className="mx-auto container px-4 max-w-[960px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Helo Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-primary">
                Helo
              </span>
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link href="/search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5 text-gray-800"/>
              </Button>
            </Link>
            {/* Login */}
            <HeaderActionsServer />
          </div>
        </div>
      </div>
    </header>
  )
}

