import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

export const migrateDB = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "src/server/db/migrations" });
  console.log("Database migration completed.");
};
