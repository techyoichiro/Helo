-- =================================================================
-- 1. 新規テーブルの作成
-- =================================================================

-- tags: ブックマークに付与するタグ
CREATE TABLE "public"."tags" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text UNIQUE NOT NULL,
    "category" text,
    "color" text DEFAULT '#10B981',
    "created_at" timestamptz NOT NULL DEFAULT now()
);

-- bookmark_tags: ブックマークとタグの中間テーブル
CREATE TABLE "public"."bookmark_tags" (
    "bookmark_id" uuid NOT NULL,
    "tag_id" uuid NOT NULL,
    "is_auto_generated" boolean DEFAULT false,
    PRIMARY KEY ("bookmark_id", "tag_id")
    -- FOREIGN KEY制約は、bookmarksとtagsのidがuuidになった後に設定します
);

-- user_activities: ユーザー行動履歴
CREATE TABLE "public"."user_activities" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" uuid NOT NULL REFERENCES "public"."users"(id),
    "bookmark_id" uuid, -- REFERENCES bookmarks(id) は後で設定
    "activity_type" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now()
);

-- summary_feedbacks: AI要約フィードバック
CREATE TABLE "public"."summary_feedbacks" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "bookmark_id" uuid NOT NULL, -- REFERENCES bookmarks(id) は後で設定
    "user_id" uuid NOT NULL REFERENCES "public"."users"(id),
    "rating" integer NOT NULL,
    "comment" text,
    "created_at" timestamptz NOT NULL DEFAULT now()
);

-- =================================================================
-- 2. 既存テーブルのカラム追加・変更
-- =================================================================

-- usersテーブルの更新
ALTER TABLE "public"."users"
ADD COLUMN "stripe_customer_id" text UNIQUE,
ADD COLUMN "display_name" text,
ADD COLUMN "email" text;
-- emailのNOT NULL, UNIQUE制約は既存データ投入後に設定するのが安全
-- subscription_statusのENUMへの変更はデータ移行が必要なため別途対応

-- foldersテーブルの更新
ALTER TABLE "public"."folders"
ADD COLUMN "description" text,
ADD COLUMN "color" text DEFAULT '#3B82F6';
-- idのuuidへの変更はデータ移行が必要なため別途対応

-- bookmarksテーブルの更新
ALTER TABLE "public"."bookmarks"
ADD COLUMN "description" text,
ADD COLUMN "ai_summary" text,
ADD COLUMN "reading_time_minutes" integer,
ADD COLUMN "is_read" boolean DEFAULT false;
-- id, folder_idのuuidへの変更はデータ移行が必要なため別途対応


-- =================================================================
-- 3. 主キーと外部キーの更新 (データ移行が必要なため要注意)
-- =================================================================
/*
-- Step 1: UUIDカラムを一時的に追加
ALTER TABLE "public"."folders" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();
ALTER TABLE "public"."bookmarks" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();
ALTER TABLE "public"."bookmarks" ADD COLUMN "folder_uuid_id" uuid;

-- Step 2: 既存の関連を新しいUUIDで更新 (要アプリケーションロジック)
-- UPDATE "public"."bookmarks" SET folder_uuid_id = f.uuid_id FROM "public"."folders" f WHERE folder_id = f.id;

-- Step 3: 古いintegerカラムを削除
ALTER TABLE "public"."folders" DROP COLUMN "id";
ALTER TABLE "public"."bookmarks" DROP COLUMN "id";
ALTER TABLE "public"."bookmarks" DROP COLUMN "folder_id";

-- Step 4: UUIDカラムを主キーにリネーム
ALTER TABLE "public"."folders" RENAME COLUMN "uuid_id" TO "id";
ALTER TABLE "public"."bookmarks" RENAME COLUMN "uuid_id" TO "id";
ALTER TABLE "public"."bookmarks" RENAME COLUMN "folder_uuid_id" TO "folder_id";

-- Step 5: 主キー制約と外部キー制約を再設定
ALTER TABLE "public"."folders" ADD PRIMARY KEY (id);
ALTER TABLE "public"."bookmarks" ADD PRIMARY KEY (id);
ALTER TABLE "public"."bookmarks" ADD CONSTRAINT "bookmarks_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"(id);

-- 中間テーブルの外部キーを設定
ALTER TABLE "public"."bookmark_tags" ADD CONSTRAINT "bookmark_tags_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "public"."bookmarks"(id);
ALTER TABLE "public"."bookmark_tags" ADD CONSTRAINT "bookmark_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"(id);
ALTER TABLE "public"."user_activities" ADD CONSTRAINT "user_activities_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "public"."bookmarks"(id);
ALTER TABLE "public"."summary_feedbacks" ADD CONSTRAINT "summary_feedbacks_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "public"."bookmarks"(id);
*/
