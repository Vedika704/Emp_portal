import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        p.employee_id,
        e.first_name || ' ' || e.last_name AS employee_name,
        p.previous_company_name,
        p.previous_department_name,
        p.previous_job_title,
        p.start_date,
        p.end_date,
        p.reason_for_leaving,
        p.last_drawn_salary
      FROM employee_previous_employment p
      JOIN employee_details e
        ON e.employee_id = p.employee_id
      ORDER BY p.created_at DESC
    `);

    if (result.rows.length === 0) {
      return NextResponse.json("No data");
    }

    const headers = Object.keys(result.rows[0]).join(",");
    const rows = result.rows
      .map(row => Object.values(row).join(","))
      .join("\n");

    const csv = `${headers}\n${rows}`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          "attachment; filename=previous_employment_report.csv",
      },
    });
  } catch (error) {
    console.error("PREVIOUS EMP CSV ERROR:", error);
    return NextResponse.json(
      { error: "Previous Employment CSV failed" },
      { status: 500 }
    );
  }
}
