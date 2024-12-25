import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

export const migrateDB = async () => {
  ("Migrating database...");
  await migrate(db, { migrationsFolder: "src/server/db/migrations" });
  ("Database migration completed.");
};
