import { createClient } from "@/app/lib/supabase/server";
import ArticleCard from "@/app/components/features/articles/ArticleCard";
import { ArticleListProps } from "@/app/types/article";

const ArticleList = async ({ items }: ArticleListProps) => {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;

  // エラーレスポンスのチェック
  if (!Array.isArray(items)) {
    return <div className="py-20 text-center font-bold text-lg text-red-500">{items.error}</div>;
  }

  if (items.length === 0) {
    return <div className="py-20 text-center font-bold text-lg text-base-light">No posts yet</div>;
  }

  return (
    <div className="flex flex-wrap justify-between">
      {items.map((item, i) => (
        <ArticleCard 
          key={`post-item-${i}`} 
          item={item}
          user={user}
          session={session}
        />
      ))}
    </div>
  );
};

export default ArticleList;
