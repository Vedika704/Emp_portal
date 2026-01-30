import { NextResponse } from "next/server";
import {pool} from "@/lib/db";

/* ================= GET ================= */
export async function GET() {
  const result = await pool.query(`
    SELECT
      q.*,
      e.first_name,
      e.last_name
    FROM employee_qualification_details q
    JOIN employee_details e
      ON q.employee_id = e.employee_id
    ORDER BY q.created_at DESC
  `);

  return NextResponse.json(result.rows);
}

/* ================= POST ================= */
export async function POST(req: Request) {
  const body = await req.json();

  await pool.query(
    `
    INSERT INTO employee_qualification_details (
      employee_id,
      education_level,
      major_specialization,
      university_institute,
      study_type,
      country,
      year_of_passing,
      grade_percentage
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,
    [
      body.employee_id,
      body.education_level,
      body.major_specialization,
      body.university_institute,
      body.study_type,
      body.country,
      body.year_of_passing,
      body.grade_percentage,
    ]
  );

  return NextResponse.json({ message: "Qualification saved" });
}

/* ================= PUT ================= */
export async function PUT(req: Request) {
  const body = await req.json();

  await pool.query(
    `
    UPDATE employee_qualification_details
    SET
      employee_id = $1,
      education_level = $2,
      major_specialization = $3,
      university_institute = $4,
      study_type = $5,
      country = $6,
      year_of_passing = $7,
      grade_percentage = $8
    WHERE qualification_id = $9
    `,
    [
      body.employee_id,
      body.education_level,
      body.major_specialization,
      body.university_institute,
      body.study_type,
      body.country,
      body.year_of_passing,
      body.grade_percentage,
      body.qualification_id,
    ]
  );

  return NextResponse.json({ message: "Qualification updated" });
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  const { qualification_id } = await req.json();

  await pool.query(
    `DELETE FROM employee_qualification_details WHERE qualification_id = $1`,
    [qualification_id]
  );

  return NextResponse.json({ message: "Qualification deleted" });
}
