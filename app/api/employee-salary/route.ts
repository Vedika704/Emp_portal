import { NextResponse } from "next/server";
import { pool } from "@/lib/db"; // your pg Pool connection

/* ================= GET ================= */

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        COALESCE(e.first_name || ' ' || e.last_name, 'Unknown') AS employee_name
      FROM employee_salary_details s
      LEFT JOIN employee_details e
        ON s.employee_id = e.employee_id  
      ORDER BY s.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET SALARY ERROR:", error);
    return NextResponse.json({ error: "Failed to load salary" }, { status: 500 });
  }
}


/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // ✅ CALCULATE NET SALARY INSIDE API
    const netSalary =
      Number(data.base_salary || 0) +
      Number(data.hra_amount || 0) +
      Number(data.conveyance_amount || 0) -
      Number(data.insurance_amount || 0) -
      Number(data.loan_amount || 0);

    const query = `
      INSERT INTO employee_salary_details (
        employee_id,
        pay_grade,
        pay_frequency,
        currency,
        base_salary,
        payment_mode,
        salary_from_month,
        salary_to_month,
        bank_name,
        account_number,
        ifsc_swift_code,
        insurance_amount,
        loan_amount,
        hra_amount,
        conveyance_amount,
        net_salary
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    `;

    const values = [
      data.employee_id,
      data.pay_grade,
      data.pay_frequency,
      data.currency,
      data.base_salary,
      data.payment_mode,
      data.salary_from_month,
      data.salary_to_month,
      data.bank_name,
      data.account_number,
      data.ifsc_swift_code,
      data.insurance_amount || 0,
      data.loan_amount || 0,
      data.hra_amount || 0,
      data.conveyance_amount || 0,
      netSalary   // ✅ use calculated
    ];

    await pool.query(query, values);

    return NextResponse.json({ message: "Salary saved successfully" });
  } catch (error) {
    console.error("POST SALARY ERROR:", error);
    return NextResponse.json({ error: "Failed to save salary" }, { status: 500 });
  }
}


/* ================= PUT ================= */

export async function PUT(req: Request) {
  try {
    const data = await req.json();

    const query = `
      UPDATE employee_salary_details SET
        employee_id=$1,
        pay_grade=$2,
        pay_frequency=$3,
        currency=$4,
        base_salary=$5,
        payment_mode=$6,
        salary_from_month=$7,
        salary_to_month=$8,
        bank_name=$9,
        account_number=$10,
        ifsc_swift_code=$11,
        insurance_amount=$12,
        loan_amount=$13,
        hra_amount=$14,
        conveyance_amount=$15,
        net_salary=$16
      WHERE salary_id=$17
    `;

    const values = [
      data.employee_id,
      data.pay_grade,
      data.pay_frequency,
      data.currency,
      data.base_salary,
      data.payment_mode,
      data.salary_from_month,
      data.salary_to_month,
      data.bank_name,
      data.account_number,
      data.ifsc_swift_code,
      data.insurance_amount || 0,
      data.loan_amount || 0,
      data.hra_amount || 0,
      data.conveyance_amount || 0,
      data.net_salary,
      data.salary_id
    ];

    await pool.query(query, values);

    return NextResponse.json({ message: "Salary updated successfully" });

  } catch (error) {
    console.error("UPDATE SALARY ERROR:", error);
    return NextResponse.json({ error: "Failed to update salary" }, { status: 500 });
  }
}



/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  try {
    const { salary_id } = await req.json();

    await pool.query(
      "DELETE FROM employee_salary_details WHERE salary_id=$1",
      [salary_id]
    );

    return NextResponse.json({ message: "Salary deleted successfully" });
  } catch (error) {
    console.error("DELETE SALARY ERROR:", error);
    return NextResponse.json({ error: "Failed to delete salary" }, { status: 500 });
  }
}
