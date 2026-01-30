import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";

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

    const formatted = result.rows.map((r) => ({
      ...r,
      created_at: r.created_at
        ? r.created_at.toISOString().replace("T", " ").slice(0, 19)
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);

    worksheet["!cols"] = Object.keys(formatted[0]).map(() => ({
      wch: 22,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Qualification Report"
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          "attachment; filename=qualification_report.xlsx",
      },
    });
  } catch (error) {
    console.error("QUALIFICATION EXCEL ERROR:", error);
    return NextResponse.json(
      { error: "Qualification Excel failed" },
      { status: 500 }
    );
  }
}
