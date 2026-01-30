import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        s.salary_id,
        s.employee_id,
        e.first_name || ' ' || e.last_name AS employee_name,
        s.pay_grade,
        s.pay_frequency,
        s.currency,
        s.base_salary,
        s.hra_amount,
        s.conveyance_amount,
        s.insurance_amount,
        s.loan_amount,
        s.net_salary,
        s.payment_mode,
        s.salary_from_month,
        s.salary_to_month,
        s.bank_name,
        s.account_number,
        s.ifsc_swift_code,
        s.created_at,
        s.updated_at
      FROM employee_salary_details s
      JOIN employee_details e
        ON e.employee_id = s.employee_id
      ORDER BY s.created_at DESC
    `);

    /* ✅ FORMAT DATES FOR EXCEL */
    const formatted = result.rows.map((r) => ({
      ...r,
      salary_from_month: r.salary_from_month
        ? r.salary_from_month.toISOString().slice(0, 10)
        : "",
      salary_to_month: r.salary_to_month
        ? r.salary_to_month.toISOString().slice(0, 10)
        : "",
      created_at: r.created_at
        ? r.created_at.toISOString().replace("T", " ").slice(0, 19)
        : "",
      updated_at: r.updated_at
        ? r.updated_at.toISOString().replace("T", " ").slice(0, 19)
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatted);

    /* ✅ AUTO COLUMN WIDTH */
    worksheet["!cols"] = Object.keys(formatted[0]).map(() => ({
      wch: 20,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Salary Report");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          "attachment; filename=salary_report.xlsx",
      },
    });
  } catch (error) {
    console.error("SALARY EXCEL ERROR:", error);
    return NextResponse.json(
      { error: "Salary Excel failed" },
      { status: 500 }
    );
  }
}
