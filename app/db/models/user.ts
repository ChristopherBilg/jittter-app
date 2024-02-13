import { and, eq, isNull } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { pbkdf2, pbkdf2Verify } from "utils/auth";
import NeonDB from "../client.server";
import { getTimestampFields } from "./../../../utils/db";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  passKey: text("pass_key").notNull(),
  ...getTimestampFields(),
});

export const getUserByAuthenticating = async (
  email: string,
  password: string,
) => {
  try {
    const user = await NeonDB.getInstance().db.query.UserTable.findFirst({
      where: and(eq(UserTable.email, email), isNull(UserTable.deletedAt)),
    });
    if (!user) return null;

    const valid = await pbkdf2Verify(user.passKey, password);
    if (!valid) return null;

    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await NeonDB.getInstance().db.query.UserTable.findFirst({
      where: eq(UserTable.id, id),
    });

    return user ?? null;
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

export const updateUser = async (
  id: string,
  user: Partial<typeof UserTable.$inferSelect>,
) => {
  try {
    const updatedUsers = await NeonDB.getInstance()
      .db.update(UserTable)
      .set(user)
      .where(eq(UserTable.id, id))
      .returning();

    if (updatedUsers.length !== 1) return null;

    return updatedUsers[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
