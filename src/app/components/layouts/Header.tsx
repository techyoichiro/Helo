import { Search, Bookmark } from "lucide-react"
import { Button } from "@/app/components/elements/ui/button"
import { HeaderActions } from "./HeaderActions"
import Link from "next/link"

export default function Header() {

  return (
    <header>
      <div className="mx-auto container px-4 max-w-[960px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              Helo
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center">
            {/* Search */}
            <Link href="/search">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="h-5 w-5 text-gray-800"/>
              </Button>
            </Link>
            {/* bookmarks */}
            <Link href="/bookmark">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Bookmark className="h-5 w-5 text-gray-800"/>
              </Button>
            </Link>
            {/* Login */}
            <HeaderActions />
          </div>
        </div>
      </div>
    </header>
  )
}