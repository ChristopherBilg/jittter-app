import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { getTimestampFields } from "../../utils/db";

export const NoteTable = pgTable("note", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content"),
  ...getTimestampFields(),
});
