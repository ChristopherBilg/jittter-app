import { sql } from "drizzle-orm";
import { date, integer, pgTable, text } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer("id").primaryKey().notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: date("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: date("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  deletedAt: date("deleted_at"),
});
