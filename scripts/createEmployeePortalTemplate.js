const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const wb = XLSX.utils.book_new();

/* EMPLOYEE DETAILS */
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.aoa_to_sheet([[
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
  ]]),
  "EmployeeDetails"
);

/* EMPLOYEE SALARY */
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.aoa_to_sheet([[
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
  ]]),
  "EmployeeSalary"
);

/* QUALIFICATION */
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.aoa_to_sheet([[
    "employee_id",
    "education_level",
    "study_type",
    "year_of_passing",
    "major_specialization",
    "university_institute",
    "grade_percentage",
    "country",
  ]]),
  "EmployeeQualification"
);

/* PREVIOUS EMPLOYMENT */
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.aoa_to_sheet([[
    "employee_id",
    "employee_name",
    "previous_company_name",
    "previous_job_title",
    "previous_department_name",
    "start_date",
    "end_date",
    "reason_for_leaving",
    "last_drawn_salary",
  ]]),
  "PreviousEmployment"
);

const outputDir = path.join(process.cwd(), "public", "templates");
fs.mkdirSync(outputDir, { recursive: true });

const filePath = path.join(outputDir, "employee_portal_import.xlsx");
XLSX.writeFile(wb, filePath);

console.log("✅ Template created at:", filePath);
