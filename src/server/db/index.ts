import { drizzle } from "drizzle-orm/postgres-js";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from 'postgres';

import { env } from "@/app/config/env";
import * as schema from "./schema";

declare global {
  var db: PostgresJsDatabase<typeof schema> | undefined;
}

let db: PostgresJsDatabase<typeof schema>;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    const client = postgres(env.DATABASE_URL);
    db = drizzle(client, { schema });
  } else {
    if (!global.db) {
      const client = postgres(env.DATABASE_URL, { max: 5 });
      global.db = drizzle(client, { schema });
    }
    db = global.db;
  }
}

export { db };
