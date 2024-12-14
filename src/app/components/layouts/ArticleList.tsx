import ArticleCard from "./ArticleCard";
import { Article } from '@/app/types/types';

type ArticleListProps = {
  items: Article[];
  page: number;
  itemsPerPage?: number;
};

export default function ArticleList({ 
  items, 
  page = 1, 
  itemsPerPage = 100 
}: ArticleListProps) {
  const totalItemsCount = items.length;
  
  if (totalItemsCount === 0) {
    return <div className="py-20 text-center font-bold text-lg text-base-light">No posts yet</div>;
  }

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = items.slice(startIndex, endIndex);

  return (
    <div className="flex flex-wrap justify-between">
      {currentPageItems.map((item, i) => (
        <ArticleCard key={`post-item-${i}`} item={item} />
      ))}
    </div>
  );
}

