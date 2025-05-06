import {
  pgTable,
  serial,
  uuid,
  integer,
  text,
  timestamp,
  varchar,
  pgEnum,
  unique,
  index,
} from 'drizzle-orm/pg-core'

/* ===== ENUM ===================================================== */
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'free',
  'premium',
])

/* ===== users ==================================================== */
export const users = pgTable(
  'users',
  {
    id: uuid('id').notNull().primaryKey(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    avatarUrl: varchar('avatar_url', { length: 255 }).notNull(),
    nickname: varchar('nickname', { length: 255 }),
    subscriptionStatus: subscriptionStatusEnum('subscription_status')
                         .default('free')
                         .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
)

/* ===== folders ================================================== */
export const folders = pgTable(
  'folders',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
              .notNull()
              .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.userId, t.name), // 同一ユーザー内でフォルダ名一意
    index().on(t.userId),
  ],
)

/* ===== bookmarks =============================================== */
export const bookmarks = pgTable(
  'bookmarks',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
              .notNull()
              .references(() => users.id, { onDelete: 'cascade' }),
    folderId: integer('folder_id')
               .notNull()
               .references(() => folders.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    articleUrl: text('article_url').notNull(),
    ogImageUrl: text('og_image_url'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    unique().on(t.userId, t.articleUrl), // URL 重複防止
    index().on(t.userId),
    index().on(t.folderId),
  ],
)