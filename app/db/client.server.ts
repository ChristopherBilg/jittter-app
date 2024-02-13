import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

class NeonDB {
  private static _instance: NeonDB;

  private _connectionString;
  private _sql;
  private _db;

  private constructor() {
    // TODO: Figure out how to get the connection string from the environment
    this._connectionString =
      "postgresql://christopherbilg:dv91LmpwCjVb@ep-weathered-sky-a5ilhn57-pooler.us-east-2.aws.neon.tech/jittter-product-db?sslmode=require";
    this._sql = neon(this._connectionString);
    this._db = drizzle(this._sql, { schema });
  }

  public static getInstance = (): NeonDB => {
    if (!NeonDB._instance) {
      NeonDB._instance = new NeonDB();
    }

    return NeonDB._instance;
  };

  public get db() {
    return this._db;
  }
}

export default NeonDB;
