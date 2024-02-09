import { and, eq, isNull, sql } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pbkdf2, pbkdf2Verify } from "utils/auth";
import NeonDB from "../client.server";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  passKey: text("pass_key").notNull(),
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
) => {
  try {
    const users = await NeonDB.getInstance()
      .db.select()
      .from(UserTable)
      .where(and(eq(UserTable.email, email), isNull(UserTable.deletedAt)))
      .limit(1);

    if (users.length !== 1) return null;

    const valid = await pbkdf2Verify(users[0].passKey, password);
    if (!valid) return null;

    return users[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const key = await pbkdf2(password);

  try {
    const newUsers = await NeonDB.getInstance()
      .db.insert(UserTable)
      .values({
        firstName,
        lastName,
        email,
        passKey: key,
      })
      .returning();

    if (newUsers.length !== 1) return null;

    return newUsers[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
