import Link from 'next/link'
import { ContentWrapper } from '@/app/components/layouts/ContentWrapper'

export default function TermsOfService() {
  return (
    <ContentWrapper>
      <div className="min-h-screen">
        {/* --- ヘッダーとナビゲーション --- */}
        <header className="border-b">
          <nav className="mx-auto py-4 flex space-x-6">
            {/* それぞれのリンクを実際のページに合わせて変更してください */}
            <Link href="/guide" legacyBehavior>
              <a className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                ガイドとヘルプ
              </a>
            </Link>
            <Link href="/terms" legacyBehavior>
              <a className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                利用規約
              </a>
            </Link>
            <Link href="/privacy" legacyBehavior>
              <a className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                プライバシーポリシー
              </a>
            </Link>
          </nav>
        </header>
        ガイドとヘルプは準備中です
      </div>
      
    </ContentWrapper>
  )
}
