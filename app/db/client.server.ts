import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// TODO: Find a method to get the connectionString from the environment
const db = (connectionString: string) => {
  const sql = neon(connectionString);
  return drizzle(sql);
};

export default db;
