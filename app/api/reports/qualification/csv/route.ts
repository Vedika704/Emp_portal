import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        q.qualification_id,
        q.employee_id,
        e.first_name || ' ' || e.last_name AS employee_name,
        q.education_level,
        q.major_specialization,
        q.university_institute,
        q.study_type,
        q.country,
        q.year_of_passing,
        q.grade_percentage,
        q.created_at
      FROM employee_qualification_details q
      JOIN employee_details e
        ON e.employee_id = q.employee_id
      ORDER BY q.created_at DESC
    `);

    if (result.rows.length === 0) {
      return NextResponse.json("No data");
    }

    const headers = Object.keys(result.rows[0]).join(",");
    const rows = result.rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          "attachment; filename=qualification_report.csv",
      },
    });
  } catch (error) {
    console.error("QUALIFICATION CSV ERROR:", error);
    return NextResponse.json(
      { error: "Qualification CSV failed" },
      { status: 500 }
    );
  }
}
