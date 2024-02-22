import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/db/postgresql/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.NEON_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
