import { NextResponse } from "next/server";
import {pool} from "@/lib/db";

export async function POST(req: Request) {
  try {
    const {
      emp_id,
      first_name,  
      middle_name,
      last_name,
      dob,
      gender,
      email,
      mobile_number,
      marital_status,
      nationality,
      emergency_contact,
      adhaar_number,
    } = await req.json();

    await pool.query(
      `INSERT INTO employee_details
      (emp_id, first_name, middle_name, last_name, dob, gender, email,
       mobile_number, marital_status, nationality,
       emergency_contact, adhaar_number)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        emp_id,
        first_name,
        middle_name,
        last_name,
        dob,
        gender,
        email,
        mobile_number,
        marital_status,
        nationality,
        emergency_contact,
        adhaar_number,
      ]
    );

    return NextResponse.json({ message: "Employee details saved" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save employee details" },
      { status: 500 }
    );
  }
}
