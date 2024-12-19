import ArticleCard from "./ArticleCard";
import { Article } from '@/app/types/types';

type ArticleListProps = {
  items: Article[] | { error: string };
  itemsPerPage?: number;
};

const ArticleList = async ({ 
  items, 
}: ArticleListProps) => {
  // エラーレスポンスのチェック
  if (!Array.isArray(items)) {
    return <div className="py-20 text-center font-bold text-lg text-red-500">{items.error}</div>;
  }

  const totalItemsCount = items.length;
  
  if (totalItemsCount === 0) {
    return <div className="py-20 text-center font-bold text-lg text-base-light">No posts yet</div>;
  }

  return (
    <>
      <div className="flex flex-wrap justify-between">
        {items.map((item, i) => (
          <ArticleCard key={`post-item-${i}`} item={item} />
        ))}
      </div>
    </>
  );
};

export default ArticleList;
