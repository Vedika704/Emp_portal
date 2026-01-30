import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import ExcelJS from "exceljs";

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
      return NextResponse.json("No data", { status: 200 });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Employee Report");

    sheet.columns = Object.keys(result.rows[0]).map((key) => ({
      header: key,
      key,
      width: 25,
    }));

    sheet.addRows(result.rows);

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          "attachment; filename=employee_report.xlsx",
      },
    });
  } catch (err) {
    console.error("EMPLOYEE EXCEL ERROR:", err);
    return NextResponse.json(
      { error: "Employee Excel failed" },
      { status: 500 }
    );
  }
}
