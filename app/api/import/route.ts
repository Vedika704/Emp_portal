import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";

/* ================= CONFIG ================= */

const TABLE_CONFIG = [
  {
    sheet: "EmployeeDetails",
    table: "employee_details",
    columns: [
      "employee_id",
      "first_name",
      "middle_name",
      "last_name",
      "date_of_birth",
      "gender",
      "email",
      "mobile_number",
      "marital_status",
      "nationality",
      "emergency_contact_number",
      "aadhaar_number",
      "profile_photo",
    ],
    conflict: "email",
  },
  {
    sheet: "EmployeeSalary",
    table: "employee_salary_details",
    columns: [
      "employee_id",
      "pay_grade",
      "pay_frequency",
      "currency",
      "base_salary",
      "payment_mode",
      "salary_from_month",
      "salary_to_month",
      "bank_name",
      "account_number",
      "ifsc_swift_code",
      "insurance_amount",
      "loan_amount",
      "hra_amount",
      "conveyance_amount",
      "net_salary",
    ],
  },
  {
    sheet: "EmployeeQualification",
    table: "employee_qualification_details",
    columns: [
      "employee_id",
      "education_level",
      "study_type",
      "year_of_passing",
      "major_specialization",
      "university_institute",
      "grade_percentage",
      "country",
    ],
  },
  {
    sheet: "PreviousEmployment",
    table: "employee_previous_employment",
    columns: [
      "employee_id",
      "employee_name",
      "previous_company_name",
      "previous_job_title",
      "previous_department_name",
      "start_date",
      "end_date",
      "reason_for_leaving",
      "last_drawn_salary",
    ],
  },
];

const DATE_COLUMNS = new Set([
  "date_of_birth",
  "salary_from_month",
  "salary_to_month",
  "start_date",
  "end_date",
]);

const NUMERIC_COLUMNS = new Set([
  "base_salary",
  "insurance_amount",
  "loan_amount",
  "hra_amount",
  "conveyance_amount",
  "net_salary",
  "last_drawn_salary",
  "year_of_passing",
]);

/* ================= HELPERS ================= */

function fixExcelDate(val: any) {
  if (val === null || val === undefined || val === "") return null;

  if (typeof val === "number" && val > 25569) {
    const d = new Date((val - 25569) * 86400 * 1000);
    return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
  }

  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val;
  }

  return null;
}

function fixNumeric(val: any) {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function isEmptyRow(row: any[]) {
  return row.every(v => v === null || v === undefined || v === "");
}

/* ================= API ================= */

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const client = await pool.connect();
  let totalInserted = 0;

  try {
    await client.query("BEGIN");

    for (const cfg of TABLE_CONFIG) {
      const sheet = workbook.Sheets[cfg.sheet];
      if (!sheet) continue;

      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        blankrows: false,
      });

      if (rows.length < 2) continue;

      for (const row of rows.slice(1)) {
        if (isEmptyRow(row)) continue;

        const values = cfg.columns.map((col, i) => {
          const cell = row[i];
          if (DATE_COLUMNS.has(col)) return fixExcelDate(cell);
          if (NUMERIC_COLUMNS.has(col)) return fixNumeric(cell);
          return cell ?? null;
        });

        let query = `
          INSERT INTO ${cfg.table} (${cfg.columns.join(",")})
          VALUES (${cfg.columns.map((_, i) => `$${i + 1}`).join(",")})
        `;

        if (cfg.conflict) {
          query += ` ON CONFLICT (${cfg.conflict}) DO NOTHING RETURNING 1`;
        } else {
          query += ` ON CONFLICT (employee_id) DO NOTHING RETURNING 1`;
        }

        const result = await client.query(query, values);
        totalInserted += result.rowCount ?? 0;
      }
    }

    await client.query("COMMIT");

    if (totalInserted === 0) {
      return NextResponse.json({
        success: false,
        message: "This file / data is already present in the Employee Portal",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${totalInserted} new record(s) successfully`,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { error: err.message || "Import failed" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
