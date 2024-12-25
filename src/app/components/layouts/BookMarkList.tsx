import { Bookmark } from '@/app/types/types'
import { BookmarkCard } from './BookmarkCard'

type BookMarkListProps = {
  items: Bookmark[];
};

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

