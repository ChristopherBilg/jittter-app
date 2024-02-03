import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const db = (connectionString: string) => {
  const sql = neon(connectionString);
  return drizzle(sql);
};

export default db;
