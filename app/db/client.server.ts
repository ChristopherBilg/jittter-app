import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const db = (connection: string) => {
  const sql = neon(connection);
  return drizzle(sql);
};

export default db;
