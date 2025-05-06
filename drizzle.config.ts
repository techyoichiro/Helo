import 'dotenv/config' 
import type { Config } from "drizzle-kit";

export default {
  schema: './src/server/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  strict: true, 
} satisfies Config;