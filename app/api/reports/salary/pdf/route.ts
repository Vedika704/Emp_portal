import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        s.employee_id,
        e.first_name,
        e.last_name,
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
        s.ifsc_swift_code
      FROM employee_salary_details s
      JOIN employee_details e
        ON e.employee_id = s.employee_id
      ORDER BY s.created_at DESC
    `);

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([595, 842]); // A4
    let y = 800;

    /* ---------- TITLE ---------- */
    page.drawText("Employee Salary Report", {
      x: 180,
      y,
      size: 18,
      font,
    });

    y -= 40;

    for (const s of result.rows) {
      const lines = [
        `Employee ID       : ${s.employee_id}`,
        `Employee Name     : ${s.first_name} ${s.last_name}`,
        ``,
        `Pay Grade         : ${s.pay_grade}`,
        `Pay Frequency     : ${s.pay_frequency}`,
        `Currency          : ${s.currency}`,
        ``,
        `Base Salary       : ${s.base_salary}`,
        `HRA Amount        : ${s.hra_amount}`,
        `Conveyance Amount : ${s.conveyance_amount}`,
        ``,
        `Insurance Deduct. : ${s.insurance_amount}`,
        `Loan Deduct.      : ${s.loan_amount}`,
        ``,
        `Net Salary        : ${s.net_salary}`,
        ``,
        `Payment Mode      : ${s.payment_mode}`,
        `Effective Period  : FROM ${
          s.salary_from_month?.toISOString().slice(0, 10)
        } TO ${
          s.salary_to_month?.toISOString().slice(0, 10)
        }`,
        ``,
        `Bank Name         : ${s.bank_name}`,
        `Account Number   : ${s.account_number}`,
        `IFSC / SWIFT     : ${s.ifsc_swift_code}`,
        `--------------------------------------------------`,
      ];

      for (const line of lines) {
        page.drawText(line, {
          x: 40,
          y,
          size: 11,
          font,
        });
        y -= 14; // ✅ CONTROLLED LINE HEIGHT
      }

      y -= 20; // space between employees

      if (y < 120) {
        page = pdfDoc.addPage([595, 842]);
        y = 800;
      }
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=employee_salary_report.pdf",
      },
    });
  } catch (error) {
    console.error("SALARY PDF ERROR:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
