import { createClient } from "@/app/lib/utils/supabase/server";
import ArticleCard from "@/app/components/features/articles/ArticleCard";
import { ArticleListProps } from "@/app/types/types";

const ArticleList = async ({ items }: ArticleListProps) => {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">ユーザー情報の取得中にエラーが発生しました。</p>
      </div>
    );
  }
  const user = userData.user;

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">セッションの取得中にエラーが発生しました。</p>
      </div>
    );
  }
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
