import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        e.employee_id,
        e.first_name || ' ' || e.last_name AS employee_name,
        e.email,
        e.mobile_number,
        e.gender,
        e.marital_status,
        e.nationality,
        e.date_of_birth,
        e.emergency_contact_number,
        e.aadhaar_number,
        e.profile_photo
      FROM employee_details e
      ORDER BY e.employee_id
    `);

    if (result.rows.length === 0) {
      return new NextResponse("No data", { status: 200 });
    }

    const headers = Object.keys(result.rows[0]).join(",");

    const rows = result.rows
      .map(row =>
        Object.values(row)
          .map(val => `"${val ?? ""}"`)
          .join(",")
      )
      .join("\n");

    const csv = `${headers}\n${rows}`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=employee_report.csv",
      },
    });
  } catch (err) {
    console.error("EMPLOYEE CSV ERROR:", err);
    return NextResponse.json(
      { error: "Employee CSV failed" },
      { status: 500 }
    );
  }
}
