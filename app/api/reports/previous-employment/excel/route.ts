import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";

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

    /* 🔹 FORMAT DATA (DATES → STRING) */
    const formatted = result.rows.map((r) => ({
      employee_id: r.employee_id,
      employee_name: r.employee_name,
      previous_company_name: r.previous_company_name,
      previous_department_name: r.previous_department_name,
      previous_job_title: r.previous_job_title,
      start_date: r.start_date
        ? new Date(r.start_date).toISOString().slice(0, 10)
        : "",
      end_date: r.end_date
        ? new Date(r.end_date).toISOString().slice(0, 10)
        : "",
      reason_for_leaving: r.reason_for_leaving,
      last_drawn_salary: r.last_drawn_salary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);

    /* 🔹 FIX COLUMN WIDTHS */
    worksheet["!cols"] = [
      { wch: 12 }, // employee_id
      { wch: 20 }, // employee_name
      { wch: 22 }, // company
      { wch: 22 }, // department
      { wch: 20 }, // job title
      { wch: 14 }, // start_date
      { wch: 14 }, // end_date
      { wch: 35 }, // reason
      { wch: 18 }, // last salary
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Previous Employment"
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
          "attachment; filename=previous_employment_report.xlsx",
      },
    });
  } catch (error) {
    console.error("PREVIOUS EMP EXCEL ERROR:", error);
    return NextResponse.json(
      { error: "Previous Employment Excel failed" },
      { status: 500 }
    );
  }
}
