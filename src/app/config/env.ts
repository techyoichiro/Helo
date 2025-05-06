import { z } from "zod";

const serverSchema = z.object({
  // Node
  NODE_ENV: z.enum(["development", "test", "production"]),
  // Database
  POSTGRES_URL: z.string().min(1),
  // Supabase
  SUPABASE_URL: z.string().min(1),
  SUPABASE_SERVICE_ROLE: z.string().min(1),
});

const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  POSTGRES_URL: process.env.POSTGRES_URL,
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const _serverEnv = serverSchema.safeParse(processEnv);

if (!_serverEnv.success) {
  console.error("❌ Invalid environment variables:\n", 
    JSON.stringify(_serverEnv.error.format(), null, 4));
  throw new Error("Invalid environment variables");
}

export const env = _serverEnv.data;

console.log("✅ Environment variables loaded");