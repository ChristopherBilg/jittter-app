import { AppLoadContext } from "@remix-run/cloudflare";
import { and, eq, isNull, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import db from "../client.server";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  deletedAt: timestamp("deleted_at"),
});

export const getUserByAuthenticating = async (
  email: string,
  password: string,
  context: AppLoadContext,
) => {
  // TODO: Hash the password before querying the database

  const users = await db(context.env.NEON_DATABASE_URL)
    .select()
    .from(UserTable)
    .where(
      and(
        eq(UserTable.email, email),
        eq(UserTable.password, password),
        isNull(UserTable.deletedAt),
      ),
    )
    .limit(1);

  if (users.length !== 1) return null;

  return users[0];
};
