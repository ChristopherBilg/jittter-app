import { InferSelectModel, and, eq, isNull } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { pbkdf2, pbkdf2Verify } from "~/app/utils/auth.server";
import { SubscriptionTier } from "~/app/utils/subscription";
import { getTimestampFields } from "../../../utils/db";
import NeonDB from "../neondb";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  passKey: text("pass_key").notNull(),
  subscriptionTier: text("subscription_tier")
    .notNull()
    .default(SubscriptionTier.Starter),
  ...getTimestampFields(),
});

export class User {
  static getByAuthenticating = async (
    connectionString: string,
    email: string,
    password: string,
  ) => {
    try {
      const user = await NeonDB.getInstance(
        connectionString,
      ).db.query.UserTable.findFirst({
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

  static getById = async (connectionString: string, id: string) => {
    try {
      const user = await NeonDB.getInstance(
        connectionString,
      ).db.query.UserTable.findFirst({
        where: eq(UserTable.id, id),
      });

      return user ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static create = async (
    connectionString: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    const passKey = await pbkdf2(password);

    try {
      const newUsers = await NeonDB.getInstance(connectionString)
        .db.insert(UserTable)
        .values({
          firstName,
          lastName,
          email,
          passKey,
        })
        .returning();

      if (newUsers.length !== 1) return null;

      return newUsers[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static update = async (
    connectionString: string,
    id: string,
    user: Partial<InferSelectModel<typeof UserTable>>,
  ) => {
    try {
      const updatedUsers = await NeonDB.getInstance(connectionString)
        .db.update(UserTable)
        .set({ ...user, updatedAt: new Date() })
        .where(eq(UserTable.id, id))
        .returning();

      if (updatedUsers.length !== 1) return null;

      return updatedUsers[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static updateAuthentication = async (
    connectionString: string,
    id: string,
    password: string,
  ) => {
    const passKey = await pbkdf2(password);

    try {
      const updatedUsers = await NeonDB.getInstance(connectionString)
        .db.update(UserTable)
        .set({ passKey, updatedAt: new Date() })
        .where(eq(UserTable.id, id))
        .returning();

      if (updatedUsers.length !== 1) return null;

      return updatedUsers[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}
