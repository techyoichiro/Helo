import { fetchTrendArticles } from '@/app/lib/api/article';
import ArticleList from '@/app/components/features/articles/ArticleList';
import { Article } from '@/app/types/article';
import { ErrorResponse } from '@/app/types/common';

export default async function Articles() {
  const articlesOrError: Article[] | ErrorResponse = await fetchTrendArticles();

  return (
    <div className="w-full max-w-4xl">
      {Array.isArray(articlesOrError) ? (
        <ArticleList items={articlesOrError} />
      ) : (
        <div className="text-center py-10">
          <p className="text-red-500">{articlesOrError.error}</p>
        </div>
      )}
    </div>
  );
}

export function generateMetadata() {
  return {
    title: 'Trending Articles',
    description: 'View the latest trending articles',
  };
}
