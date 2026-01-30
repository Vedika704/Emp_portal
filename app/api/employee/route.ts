import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/* GET */
export async function GET() {
  const result = await pool.query(
    `SELECT * FROM employee_details ORDER BY created_at DESC`
  );
  return NextResponse.json(result.rows);
} 


/* POST - CREATE */
export async function POST(req: Request) {
  const body = await req.json();

  const {
    employee_id,
    first_name,
    middle_name,
    last_name,
    email,
    mobile_number,
    nationality,
    emergency_contact_number,
    aadhaar_number,
    date_of_birth,
    gender,
    marital_status,
    profile_photo,
  } = body;

  await pool.query(
    `
    INSERT INTO employee_details (
      employee_id, first_name, middle_name, last_name, email,
      mobile_number, nationality, emergency_contact_number,
      aadhaar_number, date_of_birth, gender, marital_status, profile_photo
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
  `,
    [
      employee_id,
      first_name,
      middle_name,
      last_name,
      email,
      mobile_number,
      nationality,
      emergency_contact_number,
      aadhaar_number,
      date_of_birth,
      gender,
      marital_status,
      profile_photo,
    ]
  );

  return NextResponse.json({ success: true });
}

/* PUT - UPDATE  */
export async function PUT(req: Request) {
  const body = await req.json();

  const {
    employee_id,
    first_name,
    middle_name,
    last_name,
    email,
    mobile_number,
    nationality,
    emergency_contact_number,
    aadhaar_number,
    date_of_birth,
    gender,
    marital_status,
    profile_photo,
  } = body;

  await pool.query(
    `
    UPDATE employee_details SET
      first_name=$1,
      middle_name=$2,
      last_name=$3,
      email=$4,
      mobile_number=$5,
      nationality=$6,
      emergency_contact_number=$7,
      aadhaar_number=$8,
      date_of_birth=$9,
      gender=$10,
      marital_status=$11,
      profile_photo=$12,
      updated_at=NOW()
    WHERE employee_id=$13
  `,
    [
      first_name,
      middle_name,
      last_name,
      email,
      mobile_number,
      nationality,
      emergency_contact_number,
      aadhaar_number,
      date_of_birth,
      gender,
      marital_status,
      profile_photo,
      employee_id,  
    ]
  );

  return NextResponse.json({ success: true }); 
}

/* DELETE */
export async function DELETE(req: Request) {
  const { employee_id } = await req.json();

  await pool.query(
    `DELETE FROM employee_details WHERE employee_id=$1`,
    [employee_id]
  );

  return NextResponse.json({ success: true });
}
