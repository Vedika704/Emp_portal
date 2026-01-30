import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        q.employee_id,
        e.first_name,
        e.last_name,
        q.education_level,
        q.major_specialization,
        q.university_institute,
        q.study_type,
        q.country,
        q.year_of_passing,
        q.grade_percentage
      FROM employee_qualification_details q
      JOIN employee_details e
        ON e.employee_id = q.employee_id
      ORDER BY q.created_at DESC
    `);

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([595, 842]);
    let y = 800;

    page.drawText("Employee Qualification Report", {
      x: 170,
      y,
      size: 18,
      font,
    });

    y -= 40;

    for (const q of result.rows) {
      const block = [
        `Employee ID      : ${q.employee_id}`,
        `Employee Name    : ${q.first_name} ${q.last_name}`,
        `Education Level  : ${q.education_level}`,
        `Specialization  : ${q.major_specialization}`,
        `University      : ${q.university_institute}`,
        `Study Type      : ${q.study_type}`,
        `Country         : ${q.country}`,
        `Year of Passing : ${q.year_of_passing}`,
        `Grade           : ${q.grade_percentage}`,
        "---------------------------------------------",
      ];

      block.forEach((line) => {
        page.drawText(line, {
          x: 40,
          y,
          size: 11,
          font,
        });
        y -= 14;
      });

      y -= 10;

      if (y < 100) {
        page = pdfDoc.addPage([595, 842]);
        y = 800;
      }
    }

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "attachment; filename=qualification_report.pdf",
      },
    });
  } catch (error) {
    console.error("QUALIFICATION PDF ERROR:", error);
    return NextResponse.json(
      { error: "Qualification PDF failed" },
      { status: 500 }
    );
  }
}
