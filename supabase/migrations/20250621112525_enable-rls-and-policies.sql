-- 1. RLSを有効化
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summary_feedbacks ENABLE ROW LEVEL SECURITY;

-- 2. アクセスポリシーの作成

-- tags: 認証済みユーザーは閲覧可能
CREATE POLICY "select_for_authenticated"
ON public.tags FOR SELECT
TO authenticated
USING (true);

-- user_activities: 自身のデータのみフルアクセス可能
CREATE POLICY "manage_own_data"
ON public.user_activities FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- summary_feedbacks: 自身のデータのみフルアクセス可能
CREATE POLICY "manage_own_data"
ON public.summary_feedbacks FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

/*
-- bookmark_tags: 関連するブックマークの所有者のみフルアクセス可能
-- (注意: このポリシーはbookmarksテーブルの主キーがUUIDに移行した後に正しく機能します)
CREATE POLICY "manage_own_data"
ON public.bookmark_tags FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.bookmarks
    WHERE bookmarks.id = bookmark_tags.bookmark_id
      AND bookmarks.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.bookmarks
    WHERE bookmarks.id = bookmark_tags.bookmark_id
      AND bookmarks.user_id = auth.uid()
  )
);
*/
