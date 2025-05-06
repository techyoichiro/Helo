ALTER TABLE "bookmark_folders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "bookmark_folders" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_nickname_unique";--> statement-breakpoint
ALTER TABLE "bookmarks" ADD COLUMN "folder_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookmarks_folder_id_index" ON "bookmarks" USING btree ("folder_id");