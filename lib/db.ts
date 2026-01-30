import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "empportaldb",
  password: "Vedika@09",
  port: 5432,
});
 
 
 