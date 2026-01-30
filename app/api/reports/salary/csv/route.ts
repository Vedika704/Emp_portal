import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

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
        s.payment_mode,
        s.salary_from_month,
        s.salary_to_month,
        s.bank_name,
        s.account_number,
        s.ifsc_swift_code,
        s.insurance_amount,
        s.loan_amount,
        s.hra_amount,
        s.conveyance_amount,
        s.net_salary,
        s.created_at,
        s.updated_at
      FROM employee_salary_details s
      JOIN employee_details e
        ON e.employee_id = s.employee_id
      ORDER BY s.created_at DESC
    `);

    if (result.rows.length === 0) {
      return new NextResponse("No data");
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
        "Content-Disposition": "attachment; filename=salary_report.csv",
      },
    });
  } catch (error) {
    console.error("SALARY CSV ERROR:", error);
    return NextResponse.json({ error: "Salary CSV failed" }, { status: 500 });
  }
}
