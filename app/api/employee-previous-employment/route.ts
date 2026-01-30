import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

/* ================= GET ================= */
export async function GET() {
  const result = await pool.query(`
    SELECT *
    FROM employee_previous_employment
    ORDER BY previous_employment_id DESC
  `);
  return NextResponse.json(result.rows);
}

/* ================= POST ================= */
export async function POST(req: Request) {
  const data = await req.json();

  await pool.query(
    `
    INSERT INTO employee_previous_employment
    (
      employee_id,
      employee_name,
      previous_company_name,
      previous_department_name,
      previous_job_title,
      start_date,
      end_date,
      reason_for_leaving,
      last_drawn_salary
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    `,
    [
      data.employee_id,
      data.employee_name,
      data.previous_company_name,
      data.previous_department_name,
      data.previous_job_title,
      data.start_date,
      data.end_date,
      data.reason_for_leaving,
      data.last_drawn_salary,
    ]
  );

  return NextResponse.json({ success: true });
}

/* ================= PUT ================= */
export async function PUT(req: Request) {
  const data = await req.json();

  await pool.query(
    `
    UPDATE employee_previous_employment
    SET
      employee_id=$1,
      employee_name=$2,
      previous_company_name=$3,
      previous_department_name=$4,
      previous_job_title=$5,
      start_date=$6,
      end_date=$7,
      reason_for_leaving=$8,
      last_drawn_salary=$9
    WHERE previous_employment_id=$10
    `,
    [
      data.employee_id,
      data.employee_name,
      data.previous_company_name,
      data.previous_department_name,
      data.previous_job_title,
      data.start_date,
      data.end_date,
      data.reason_for_leaving,
      data.last_drawn_salary,
      data.previous_employment_id,
    ]
  );

  return NextResponse.json({ success: true });
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  const { previous_employment_id } = await req.json();

  await pool.query(
    `DELETE FROM employee_previous_employment WHERE previous_employment_id=$1`,
    [previous_employment_id]
  );

  return NextResponse.json({ success: true });
}
