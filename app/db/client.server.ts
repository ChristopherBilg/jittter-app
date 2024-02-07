import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

export default class NeonDB {
  private static _instance: NeonDB;

  private _connectionString: string;
  private _sql: ReturnType<typeof neon>;
  private _db: ReturnType<typeof drizzle>;

  private constructor() {
    this._connectionString =
      "postgresql://christopherbilg:dv91LmpwCjVb@ep-weathered-sky-a5ilhn57-pooler.us-east-2.aws.neon.tech/jittter-product-db?sslmode=require";
    this._sql = neon(this._connectionString);
    this._db = drizzle(this._sql);
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
