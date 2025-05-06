CREATE TYPE "public"."subscription_status" AS ENUM('free', 'premium');--> statement-breakpoint
CREATE TABLE "bookmark_folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookmark_id" integer NOT NULL,
	"folder_id" integer NOT NULL,
	CONSTRAINT "bookmark_folders_bookmark_id_folder_id_unique" UNIQUE("bookmark_id","folder_id")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"article_url" text NOT NULL,
	"og_image_url" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_user_id_article_url_unique" UNIQUE("user_id","article_url")
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "folders_user_id_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"avatar_url" varchar(255) NOT NULL,
	"nickname" varchar(255),
	"subscription_status" "subscription_status" DEFAULT 'free' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_nickname_unique" UNIQUE("nickname")
);
--> statement-breakpoint
ALTER TABLE "bookmark_folders" ADD CONSTRAINT "bookmark_folders_bookmark_id_bookmarks_id_fk" FOREIGN KEY ("bookmark_id") REFERENCES "public"."bookmarks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmark_folders" ADD CONSTRAINT "bookmark_folders_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookmark_folders_folder_id_index" ON "bookmark_folders" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "bookmark_folders_bookmark_id_index" ON "bookmark_folders" USING btree ("bookmark_id");--> statement-breakpoint
CREATE INDEX "bookmarks_user_id_index" ON "bookmarks" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "folders_user_id_index" ON "folders" USING btree ("user_id");