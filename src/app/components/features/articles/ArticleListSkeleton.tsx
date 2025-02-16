export function ArticleListSkeleton() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-video bg-gray-200 rounded-lg" />
        ))}
      </div>
    )
  }