"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "./button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/app/lib/utils/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  const handlePageChange = (page: number) => {
    router.push(createPageUrl(page))
  }

  const renderPageNumbers = () => {
    const pages = []

    // 常に最初のページを表示
    pages.push(
      <Button
        key={1}
        variant="outline"
        className={cn(
          currentPage === 1 && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
        )}
        onClick={() => handlePageChange(1)}
      >
        1
      </Button>
    )

    if (totalPages <= 3) {
      // 3ページ以下の場合は全て表示
      for (let i = 2; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant="outline"
            className={cn(
              currentPage === i && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
            )}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Button>
        )
      }
    } else {
      // 4ページ以上の場合
      if (currentPage <= 2) {
        // 1,2,3を表示してから...
        for (let i = 2; i <= 3; i++) {
          pages.push(
            <Button
              key={i}
              variant="outline"
              className={cn(
                currentPage === i && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
              )}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Button>
          )
        }
        pages.push(
          <span key="ellipsis" className="px-2">
            ...
          </span>
        )
        // 最後のページ
        pages.push(
          <Button
            key={totalPages}
            variant="outline"
            className={cn(
              currentPage === totalPages && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
            )}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>
        )
      } else if (currentPage === 3) {
        // 1,2,3,4を表示してから...
        for (let i = 2; i <= 4; i++) {
          pages.push(
            <Button
              key={i}
              variant="outline"
              className={cn(
                currentPage === i && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
              )}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Button>
          )
        }
        pages.push(
          <span key="ellipsis" className="px-2">
            ...
          </span>
        )
        // 最後のページ
        pages.push(
          <Button
            key={totalPages}
            variant="outline"
            className={cn(
              currentPage === totalPages && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
            )}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>
        )
      } else if (currentPage >= totalPages - 2) {
        // 最後の3ページを表示
        pages.push(
          <span key="ellipsis" className="px-2">
            ...
          </span>
        )
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(
            <Button
              key={i}
              variant="outline"
              className={cn(
                currentPage === i && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
              )}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Button>
          )
        }
      } else {
        // 中間のページ
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        )
        // 現在のページとその前後のページ
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(
            <Button
              key={i}
              variant="outline"
              className={cn(
                currentPage === i && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
              )}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Button>
          )
        }
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        )
        // 最後のページ
        pages.push(
          <Button
            key={totalPages}
            variant="outline"
            className={cn(
              currentPage === totalPages && "bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
            )}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </Button>
        )
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {renderPageNumbers()}

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 