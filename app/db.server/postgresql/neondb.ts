import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

class NeonDB {
  private static _instance: NeonDB;

  private _connectionString;
  private _db;

  private constructor(connectionString: string) {
    this._connectionString = connectionString;
    this._db = drizzle(neon(this._connectionString), { schema });
  }

  public static getInstance = (connectionString: string): NeonDB => {
    if (!NeonDB._instance) {
      NeonDB._instance = new NeonDB(connectionString);
    }

    return NeonDB._instance;
  };

  public get db() {
    return this._db;
  }
}

export default NeonDB;
