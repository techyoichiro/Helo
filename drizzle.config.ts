export default {
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./migrations",
  strict: true,
};