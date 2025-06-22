# データベーステーブル定義書

## 1. 概要
本ドキュメントは、このアプリケーションで使用されるデータベースのテーブル構造について定義します。

---

## 2. テーブル一覧 (更新案)

### 2.1. `users` - ユーザー情報
ユーザーの基本情報とサブスクリプション状態を管理します。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY` | ユーザーID (AuthスキーマのIDと連携) |
| `stripe_customer_id` | `text` | `UNIQUE` | Stripeの顧客ID |
| `display_name` | `text` | | 画面表示名 |
| `email` | `text` | `NOT NULL`, `UNIQUE` | メールアドレス |
| `avatar_url` | `text` | | アバター画像のURL |
| `subscription_status`| `subscription_status` | `NOT NULL`, `DEFAULT 'free'`| 購読プラン (`free`, `premium`) |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 更新日時 |
| `full_name` | `text` | | User's full name |

### 2.2. `folders` - フォルダ
ブックマークを整理するためのフォルダ情報を管理します。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | フォルダID |
| `user_id` | `uuid` | `NOT NULL`, `REFERENCES users(id)` | このフォルダを所有するユーザーID |
| `name` | `text` | `NOT NULL` | フォルダ名 |
| `description` | `text` | | フォルダの説明 |
| `color` | `text` | `DEFAULT '#3B82F6'` | フォルダの表示色 |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

### 2.3. `bookmarks` - ブックマーク
ユーザーが保存したブックマークとAIによる分析結果を管理します。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | ブックマークID |
| `user_id` | `uuid` | `NOT NULL`, `REFERENCES users(id)` | このブックマークを所有するユーザーID |
| `folder_id` | `uuid` | `REFERENCES folders(id)` | 所属するフォルダID |
| `url` | `text` | `NOT NULL` | 記事の元URL |
| `title` | `text` | `NOT NULL` | 記事のタイトル |
| `description` | `text` | | 記事のメタディスクリプション |
| `og_image_url` | `text` | | OGP画像のURL |
| `ai_summary` | `text` | | AIによって生成された要約文 |
| `reading_time_minutes` | `integer` | | 推定読了時間（分） |
| `is_read` | `boolean` | `DEFAULT false` | 読了済みフラグ |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

### 2.4. `tags` - タグ
ブックマークに付与するタグのマスターデータです。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | タグID |
| `name` | `text` | `UNIQUE`, `NOT NULL` | タグ名 (例: 'React', 'TypeScript') |
| `category` | `text` | | タグのカテゴリ (例: 'tech', 'language') |
| `color` | `text` | `DEFAULT '#10B981'` | タグの表示色 |
| `created_at` | `timestamptz`| `NOT NULL`, `DEFAULT now()` | 作成日時 |

### 2.5. `bookmark_tags` - ブックマークとタグの関連
ブックマークとタグの多対多の関連を管理します。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `bookmark_id` | `uuid` | `PRIMARY KEY`, `REFERENCES bookmarks(id)` | ブックマークID |
| `tag_id` | `uuid` | `PRIMARY KEY`, `REFERENCES tags(id)` | タグID |
| `is_auto_generated`| `boolean`| `DEFAULT false` | AIによる自動生成フラグ |

### 2.6. `user_activities` - ユーザー行動履歴
レコメンデーション生成のためにユーザーの行動を記録します。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | アクティビティID |
| `user_id` | `uuid` | `NOT NULL`, `REFERENCES users(id)` | 行動したユーザーID |
| `bookmark_id` | `uuid`| `REFERENCES bookmarks(id)` | 対象のブックマークID |
| `activity_type` | `text` | `NOT NULL` | 行動種別 ('view', 'save', 'like'など) |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 作成日時 |

### 2.7. `summary_feedbacks` - AI要約フィードバック
AIが生成した要約に対するユーザーからの品質フィードバックを管理します。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | フィードバックID |
| `bookmark_id` | `uuid` | `NOT NULL`, `REFERENCES bookmarks(id)` | 対象のブックマークID |
| `user_id` | `uuid` | `NOT NULL`, `REFERENCES users(id)` | フィードバックを投稿したユーザーID |
| `rating` | `integer` | `NOT NULL` | 評価 (例: 1-5) |
| `comment` | `text` | | フリーテキストのコメント |
| `created_at` | `timestamptz`| `NOT NULL`, `DEFAULT now()` | 作成日時 |

### 2.8. `topics` - トピック
検索機能で利用されるトピックのマスターデータです。

| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | `PRIMARY KEY` | トピックID |
| `name` | `varchar(255)` | `NOT NULL` | トピック名 |
| `url` | `text` | `NOT NULL` | URL |
| `created_at` | `timestamptz`| | 作成日時 |
| `updated_at` | `timestamptz`| | 更新日時 |
| `path` | `text` | `NOT NULL` | パス | 

## 3. 現在のテーブル一覧

### 3.1. `users` - ユーザー情報
| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY` | ユーザーID |
| `full_name` | `text` | | フルネーム |
| `avatar_url` | `text` | | アバターURL |
| `nickname` | `text` | | ニックネーム |
| `subscription_status` | `subscription_status` | `NOT NULL`, `DEFAULT 'free'` | 購読ステータス |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamptz` | `NOT NULL` | 更新日時 |

### 3.2. `folders` - フォルダ
| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | `PRIMARY KEY` | フォルダID |
| `user_id` | `uuid` | `NOT NULL` | ユーザーID |
| `name` | `varchar(255)` | `NOT NULL` | フォルダ名 |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `updated_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 更新日時 |

### 3.3. `bookmarks` - ブックマーク
| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | `PRIMARY KEY` | ブックマークID |
| `user_id` | `uuid` | `NOT NULL` | ユーザーID |
| `article_url` | `text` | `NOT NULL` | 記事URL |
| `og_image_url` | `text` | | OGP画像URL |
| `created_at` | `timestamptz` | `NOT NULL`, `DEFAULT now()` | 作成日時 |
| `title` | `text` | `NOT NULL` | 記事タイトル |
| `published_at` | `timestamptz` | | 記事の公開日 |
| `folder_id` | `integer` | | フォルダID |

### 3.4. `topics` - トピック
| カラム名 | データ型 | 制約 | 説明 |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | `PRIMARY KEY` | トピックID |
| `name` | `varchar(255)` | `NOT NULL` | トピック名 |
| `url` | `text` | `NOT NULL` | URL |
| `created_at`