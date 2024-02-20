import { and, desc, eq, isNull } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { getTimestampFields } from "../../utils/db";
import NeonDB from "../client.server";
import { UserTable } from "./user";

export const NoteTable = pgTable("note", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => UserTable.id)
    .notNull(),
  content: text("content"),
  ...getTimestampFields(),
});

export class Note {
  static getByUserId = async (userId: string) => {
    try {
      return NeonDB.getInstance().db.query.NoteTable.findMany({
        where: and(eq(NoteTable.userId, userId), isNull(NoteTable.deletedAt)),
        orderBy: desc(NoteTable.createdAt),
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  static create = async (userId: string, content?: string) => {
    try {
      const newNotes = await NeonDB.getInstance()
        .db.insert(NoteTable)
        .values({
          userId,
          content,
        })
        .returning();

      if (newNotes.length !== 1) return null;

      return newNotes[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static updateById = async (id: string, content: string) => {
    try {
      const updatedNotes = await NeonDB.getInstance()
        .db.update(NoteTable)
        .set({ content, updatedAt: new Date() })
        .where(eq(NoteTable.id, id))
        .returning();

      if (updatedNotes.length !== 1) return null;

      return updatedNotes[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static deleteById = async (id: string) => {
    try {
      const deletedNotes = await NeonDB.getInstance()
        .db.update(NoteTable)
        .set({ deletedAt: new Date() })
        .where(eq(NoteTable.id, id))
        .returning();

      if (deletedNotes.length !== 1) return null;

      return deletedNotes[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}
