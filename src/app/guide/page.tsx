import Link from 'next/link'
import { ContentWrapper } from '@/app/components/layouts/ContentWrapper'

export default function Guide() {
  return (
    <ContentWrapper>
      <div className="min-h-screen py-8">
        {/* --- ヘッダーとナビゲーション --- */}
        <header className="border-b mb-8">
          <nav className="mx-auto py-4 flex space-x-6">
            <Link href="/guide" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
              ガイドとヘルプ
            </Link>
            <Link href="/terms" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
              利用規約
            </Link>
            <Link href="/privacy" className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
              プライバシーポリシー
            </Link>
          </nav>
        </header>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Heloとは</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Heloの概要</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Heloは、技術記事を効率的に収集・管理できるサービスです。
              最新の技術トレンドから新着記事まで、あなたの興味に合わせて記事を閲覧・管理できます。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">主な機能</h2>
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">未ログインユーザー向け機能</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• トレンドの技術記事を一箇所で閲覧</li>
                  <li>• 新着記事の確認</li>
                  <li>• トピックに応じた記事検索</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">ログインユーザー向け機能</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• 記事のブックマーク機能</li>
                  <li>• フォルダによるブックマーク管理</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">今後の展開</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p className="text-gray-700">
                AIを活用した以下の機能を順次リリース予定です：
              </p>
              <ul className="text-gray-700 mt-2 space-y-2">
                <li>• AIによる記事レコメンド機能</li>
                <li>• 記事の要約機能</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">使い方ガイド</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">1. 記事の閲覧</h3>
                <p className="text-gray-700">
                  トップページでは、トレンドの技術記事や新着記事を確認できます。
                  気になる記事をクリックして詳細を読むことができます。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">2. 記事の検索</h3>
                <p className="text-gray-700">
                  検索バーに興味のあるトピックを入力すると、関連する記事が表示されます。
                  技術分野やキーワードで検索可能です。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">3. ブックマーク管理（ログイン時）</h3>
                <p className="text-gray-700">
                  気に入った記事をブックマークに保存し、フォルダで整理できます。
                  後で読み返したい記事を効率的に管理できます。
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">よくある質問（FAQ）</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">Q: Heloは無料で使えますか？</h3>
                <p className="text-gray-700">
                  A: はい、基本的な機能は無料でご利用いただけます。ログインすることで、ブックマーク機能などの追加機能が利用可能になります。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">Q: 記事の更新頻度はどのくらいですか？</h3>
                <p className="text-gray-700">
                  A: 新着記事は定期的に更新され、常に最新の技術情報を提供しています。
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-medium mb-2">Q: スマートフォンでも使えますか？</h3>
                <p className="text-gray-700">
                  A: はい、Heloはスマートフォンやタブレットなど、様々なデバイスで最適化されています。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ContentWrapper>
  )
}
