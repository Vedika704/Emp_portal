import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        employee_id,
        first_name,
        middle_name, 
        last_name,   
        email,   
        mobile_number,
        gender,
        marital_status,
        nationality,
        emergency_contact_number,
        aadhaar_number,
        date_of_birth,
        
        profile_photo
      FROM employee_details
      ORDER BY employee_id
    `);

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([595, 842]); // A4
    let y = 800;

    /* -------- TITLE -------- */
    page.drawText("Employee Details Report", {
      x: 180,
      y,
      size: 18,
      font,
    });

    y -= 40;

    for (const e of result.rows) {
      const fullName = `${e.first_name} ${e.middle_name || ""} ${e.last_name}`.trim();

      /* -------- PROFILE PHOTO -------- */
      if (e.profile_photo) {
        try {
          const imagePath = path.join(
            process.cwd(),
            "public",
            e.profile_photo.replace(/^\/+/, "")
          );

          if (fs.existsSync(imagePath)) {
            const imageBytes = fs.readFileSync(imagePath);
            const image =
              imagePath.endsWith(".png")
                ? await pdfDoc.embedPng(imageBytes)
                : await pdfDoc.embedJpg(imageBytes);

            page.drawImage(image, {
              x: 430,
              y: y - 60,
              width: 80,
              height: 80,
            });
          }
        } catch (imgErr) {
          console.warn("Image load failed:", imgErr);
        }
      }

      /* -------- EMPLOYEE DATA -------- */
      const block = `
Employee ID        : ${e.employee_id}
Name               : ${fullName}
Email              : ${e.email}
Mobile             : ${e.mobile_number}
Gender             : ${e.gender}
Marital Status     : ${e.marital_status}
Nationality        : ${e.nationality}
DOB                : ${e.date_of_birth?.toISOString().slice(0, 10)}
Emergency Contact  : ${e.emergency_contact_number}
Aadhaar Number     : ${e.aadhaar_number}
--------------------------------------------------
`;

      page.drawText(block, {
        x: 40,
        y,
        size: 11,
        font,
        lineHeight: 14,
      });

      y -= 170;

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
          "attachment; filename=employee_details_report.pdf",
      },
    });
  } catch (error) {
    console.error("EMPLOYEE PDF ERROR:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

