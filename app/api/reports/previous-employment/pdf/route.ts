import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const runtime = "nodejs";

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

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([595, 842]); // A4
    let y = 800;

    page.drawText("Previous Employment Report", {
      x: 170,
      y,
      size: 18,
      font,
    });

    y -= 40;

    for (const r of result.rows) {
      const block =
`Employee ID      : ${r.employee_id}
Employee Name    : ${r.employee_name}
Company          : ${r.previous_company_name}
Department       : ${r.previous_department_name}
Job Title        : ${r.previous_job_title}
Start Date       : ${r.start_date?.toISOString().slice(0,10)}
End Date         : ${r.end_date?.toISOString().slice(0,10)}
Reason           : ${r.reason_for_leaving}
Last Salary      : ${r.last_drawn_salary}
----------------------------------------------------`;

      page.drawText(block, {
        x: 40,
        y,
        size: 11,
        font,
        lineHeight: 14,
      });

      y -= 160;

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
          "attachment; filename=previous_employment_report.pdf",
      },
    });
  } catch (error) {
    console.error("PREVIOUS EMP PDF ERROR:", error);
    return NextResponse.json(
      { error: "Previous Employment PDF failed" },
      { status: 500 }
    );
  }
}
