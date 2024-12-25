import { createClient } from "@/app/lib/utils/supabase/server";
import ArticleCard from "./ArticleCard";
import { Article } from '@/app/types/types';

type ArticleListProps = {
  items: Article[] | { error: string };
  itemsPerPage?: number;
};

const ArticleList = async ({ 
  items, 
}: ArticleListProps) => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">セッションの取得中にエラーが発生しました。</p>
      </div>
    )
  }
  const session = data.session
  console.log(session)
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
          <ArticleCard key={`post-item-${i}`} item={item} session={session} />
        ))}
      </div>
    </>
  );
};

export default ArticleList;

