import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import NeonDB from "../client.server";
import { getTimestampFields } from "./../../utils/db";

export const ContactUsTable = pgTable("contact_us", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  message: text("message"),
  ...getTimestampFields(),
});

export class ContactUs {
  static create = async (
    firstName: string,
    lastName: string,
    email: string,
    message: string,
  ) => {
    try {
      const newMessages = await NeonDB.getInstance()
        .db.insert(ContactUsTable)
        .values({
          firstName,
          lastName,
          email,
          message,
        })
        .returning();

      if (newMessages.length !== 1) return null;

      return newMessages[0];
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}
