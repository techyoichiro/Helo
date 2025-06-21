'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/app/components/common/dialog'

interface UpgradeModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function UpgradeModal({ isOpen, onOpenChange }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleStripeCheckout = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnTo: pathname })
      })
      const data = await res.json()
      if (!data.url) throw new Error('Checkout URLが取得できませんでした')
      window.location.href = data.url
    } catch (err) {
      toast.error('決済ページへの遷移に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col items-center justify-center">
            <DialogHeader>
              <DialogTitle>Premiumでできること</DialogTitle>
              <DialogDescription asChild>
                <ul className="mt-4 space-y-3 text-left">
                  <li className="flex items-center gap-2">
                    <svg width="24" height="24" fill="none"><circle cx="12" cy="12" r="10" fill="#facc15" /></svg>
                    フォルダ作成数が無制限
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="24" height="24" fill="none"><rect x="4" y="4" width="16" height="16" fill="#fbbf24" /></svg>
                    優先サポート
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="24" height="24" fill="none"><polygon points="12,2 22,22 2,22" fill="#fde68a" /></svg>
                    今後の新機能を先行利用
                  </li>
                </ul>
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center border-l pl-6">
            <h3 className="font-bold mb-4">アップグレードはこちら</h3>
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded shadow disabled:opacity-60"
              onClick={handleStripeCheckout}
              disabled={isLoading}
            >
              {isLoading ? 'リダイレクト中...' : 'Stripeで決済'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 