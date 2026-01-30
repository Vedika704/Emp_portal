import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query(
    "SELECT employee_id, first_name, last_name FROM employee_details ORDER BY employee_id"
  );
  return NextResponse.json(result.rows);
}
