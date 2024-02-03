import { defineConfig } from 'drizzle-kit'

export default defineConfig({
 schema: "./app/db/schema.ts",
 out: "./migrations",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
