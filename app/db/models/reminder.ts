import { and, desc, eq, isNull } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { getTimestampFields } from "../../utils/db";
import NeonDB from "../client.server";
import { UserTable } from "./user";

export const ReminderTable = pgTable("reminder", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => UserTable.id)
    .notNull(),
  content: text("content"),
  ...getTimestampFields(),
});

export class Reminder {
  static getByUserId = async (userId: string) => {
    try {
      const reminders =
        await NeonDB.getInstance().db.query.ReminderTable.findMany({
          where: and(
            eq(ReminderTable.userId, userId),
            isNull(ReminderTable.deletedAt),
          ),
          orderBy: desc(ReminderTable.createdAt),
        });

      return reminders;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  static create = async (userId: string, content?: string) => {
    try {
      const newReminders = await NeonDB.getInstance()
        .db.insert(ReminderTable)
        .values({
          userId,
          content,
        })
        .returning();

      if (newReminders.length !== 1) return null;

      return newReminders[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static updateById = async (id: string, content: string) => {
    try {
      const updatedReminders = await NeonDB.getInstance()
        .db.update(ReminderTable)
        .set({ content, updatedAt: new Date() })
        .where(eq(ReminderTable.id, id))
        .returning();

      if (updatedReminders.length !== 1) return null;

      return updatedReminders[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static deleteById = async (id: string) => {
    try {
      const deletedReminders = await NeonDB.getInstance()
        .db.update(ReminderTable)
        .set({ deletedAt: new Date() })
        .where(eq(ReminderTable.id, id))
        .returning();

      if (deletedReminders.length !== 1) return null;

      return deletedReminders[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}
