import { pgTable, serial, uuid, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const subscriptionStatusEnum = pgEnum('subscription_status', ['free', 'premium']);

export const users = pgTable('users', {
  id: uuid('id').notNull().primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }).notNull(),
  nickname: varchar('nickname', { length: 255 }),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('free').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookmarks = pgTable('bookmarks', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  articleUrl: text('article_url').notNull(),
  ogImageUrl: text('og_image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const folders = pgTable('folders', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookmarkFolders = pgTable('bookmark_folders', {
  id: serial('id').primaryKey(),
  bookmarkId: serial('bookmark_id').references(() => bookmarks.id, { onDelete: 'cascade' }),
  folderId: serial('folder_id').references(() => folders.id, { onDelete: 'cascade' }),
});

