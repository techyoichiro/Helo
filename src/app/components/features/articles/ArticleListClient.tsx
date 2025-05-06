'use client'

import { useEffect, useState } from 'react'
import { Article } from '@/app/types/article'
import { Session } from '@supabase/supabase-js'
import { fetchArticles } from '@/app/lib/api/article'
import ArticleCard from './ArticleCard'

interface ArticleListClientProps {
  session: Session | null
}

export function ArticleListClient({ session }: ArticleListClientProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadArticles = async () => {
      try {
        setLoading(true)
        const response = await fetchArticles(1, 12, session)
        if (!isMounted) return

        if ('error' in response) {
          setError(response.error || '記事の読み込みに失敗しました')
        } else if (response.data) {
          setArticles(response.data)
        }
      } catch (err) {
        if (!isMounted) return
        setError('記事の読み込みに失敗しました')
        console.error('Error loading articles:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadArticles()

    return () => {
      isMounted = false
    }
  }, [session])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (articles.length === 0) {
    return <div className="text-center text-gray-500">No posts yet</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard 
          key={`${article.url}-${article.published_at}`} 
          item={article} 
          user={null} 
          session={session} 
        />
      ))}
    </div>
  )
} 