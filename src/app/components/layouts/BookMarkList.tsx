import { BookmarkCard } from './BookmarkCard'
import { BookMarkListProps } from "@/app/types/types"

const BookMarkList = ({ items }: BookMarkListProps) => {
  const totalItemsCount = items.length;
  
  if (totalItemsCount === 0) {
    return <div className="py-20 text-center font-bold text-lg text-base-light">No posts yet</div>;
  }

  return (
    <>
      <div className="flex flex-wrap justify-between">
        {items.map((item, i) => (
          <BookmarkCard key={`post-item-${i}`} item={item} />
        ))}
      </div>
    </>
  );
};

export default BookMarkList;

