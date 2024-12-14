import { env } from "./src/app/config/env";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/libs/database/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;