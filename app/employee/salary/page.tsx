"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function EmployeeSalaryPage() {
  const searchParams = useSearchParams();
  const isReport = searchParams.get("report") === "true";

  const [form, setForm] = useState<any>({});
  const [salaryList, setSalaryList] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  /* ================= LOAD DATA ================= */
  const loadSalary = async () => {
    const res = await fetch("/api/employee-salary");
    setSalaryList(await res.json());
  };

  const loadEmployees = async () => {
    const res = await fetch("/api/employees");
    setEmployees(await res.json());
  };

  useEffect(() => {
    loadSalary();
    loadEmployees();
  }, []);

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const updated = { ...form, [name]: value };

    updated.net_salary =
      Number(updated.base_salary || 0) +
      Number(updated.hra_amount || 0) +
      Number(updated.conveyance_amount || 0) -
      Number(updated.insurance_amount || 0) -
      Number(updated.loan_amount || 0);

    setForm(updated);
  };

  /* ================= SAVE ================= */
  const saveSalary = async () => {
    await fetch("/api/employee-salary", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, salary_id: editId }),
    });

    setForm({});
    setEditId(null);
    loadSalary();
  };

  /* ================= EDIT ================= */
 const editSalary = (row: any) => {
    setForm({
      ...row,
      salary_from_month: row.salary_from_month?.split("T")[0],
      salary_to_month: row.salary_to_month?.split("T")[0],
    });
    setEditId(row.salary_id);
  };


  /* ================= DELETE ================= */
  const deleteSalary = async (salary_id: number) => {
    await fetch("/api/employee-salary", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salary_id }),
    });
    loadSalary();
  };

  return (
    <>
      {/* ================= FORM ================= */}
      <div className="bg-white p-8 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold text-green-600 mb-6">
          Employee Salary Details
        </h2>

        <div className="grid grid-cols-3 gap-4">

  {/* EXISTING FIELDS - UNTOUCHED */}
  <select name="employee_id" value={form.employee_id || ""} onChange={handleChange} className="input">
    <option value="">Select Employee ID</option>
    {employees.map((e) => (
      <option key={e.employee_id} value={e.employee_id}>
        {e.employee_id} - {e.first_name} {e.last_name}
      </option>
    ))}
  </select>

  <select name="pay_grade" value={form.pay_grade || ""} onChange={handleChange} className="input">
    <option value="">Pay Grade</option>
    <option>Entry Level</option>
    <option>Junior</option>
    <option>Mid Level</option>
    <option>Senior Level</option>
    <option>Team Lead</option>
    <option>Manager</option>
    <option>Director</option>
    <option>Executive</option>
  </select>

  <select name="pay_frequency" value={form.pay_frequency || ""} onChange={handleChange} className="input">
    <option value="">Pay Frequency</option>
    <option>Weekly</option>
    <option>Bi-weekly</option>
    <option>Monthly</option>
    <option>Quarterly</option>
    <option>Annually</option>
  </select>

  <select name="currency" value={form.currency || ""} onChange={handleChange} className="input">
    <option value="">Currency</option>
    <option>INR(Indian Rupees)</option>
    <option>USD(US Dollar)</option>
    <option>EUR(European Dolar)</option>
    <option>GBP(Great British Pound)</option>
    <option>SGD(Singapore Dollar)</option>
    <option>JPY(Japanese Yen)</option>
  </select>

  <input name="base_salary" placeholder="Base Salary"
    value={form.base_salary || ""} onChange={handleChange} className="input" />

  <select name="payment_mode" value={form.payment_mode || ""} onChange={handleChange} className="input">
    <option value="">Payment Mode</option>
    <option>Cash</option>
    <option>Check</option>
    <option>Bank Transfer</option>
  </select>

 <div>
  <label className="text-sm font-semibold mb-1 block">
    Effective From
  </label>
  <input
    type="date"
    name="salary_from_month"
    value={form.salary_from_month || ""}
    onChange={handleChange}
    className="input"
  />
</div>

<div>
  <label className="text-sm font-semibold mb-1 block">
    Effective To
  </label>
  <input
    type="date"
    name="salary_to_month"
    value={form.salary_to_month || ""}
    onChange={handleChange}
    className="input"
  />
</div>



  {/* ====== NEW REQUIRED FIELDS ====== */}

  <input name="insurance_amount" placeholder="Insurance Amount"
    value={form.insurance_amount || ""} onChange={handleChange} className="input" />

  <input name="loan_amount" placeholder="Loan Amount"
    value={form.loan_amount || ""} onChange={handleChange} className="input" />

  <input name="hra_amount" placeholder="HRA Amount"
    value={form.hra_amount || ""} onChange={handleChange} className="input" />

  <input name="conveyance_amount" placeholder="Conveyance Amount"
    value={form.conveyance_amount || ""} onChange={handleChange} className="input" />

  <input name="bank_name" placeholder="Bank Name"
    value={form.bank_name || ""} onChange={handleChange} className="input" />

  <input name="account_number" placeholder="Account Number"
    value={form.account_number || ""} onChange={handleChange} className="input" />

  <input name="ifsc_swift_code" placeholder="IFSC / SWIFT Code"
    value={form.ifsc_swift_code || ""} onChange={handleChange} className="input" />

</div>


        {/* NET SALARY */}
        <div className="mt-4">
          <label className="font-semibold mr-4">Net Salary</label>
          <input value={form.net_salary || 0} readOnly className="input bg-gray-100" />
        </div>

        {!isReport && (
          <button onClick={saveSalary} className="mt-4 bg-green-600 text-white px-6 py-2 rounded">
            {editId ? "Update Salary" : "Save Salary"}
          </button>
        )}
      </div>

      {/* ================= EXPORT BUTTONS ================= */}
      {isReport && (
        <div className="flex gap-3 mb-4">
          <a href="/api/reports/salary/csv" className="px-4 py-2 bg-blue-600 text-white rounded">CSV</a>
          <a href="/api/reports/salary/excel" className="px-4 py-2 bg-green-600 text-white rounded">Excel</a>
          <a href="/api/reports/salary/pdf" className="px-4 py-2 bg-red-600 text-white rounded">PDF</a>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">Salary List</h3>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Emp ID</th>
              <th className="border p-2">Emp Name</th>
              <th className="border p-2">Base Salary</th>
              <th className="border p-2">Net Salary</th>
              <th className="border p-2">Payment Mode</th>
              <th className="border p-2">Effective Period</th>
              {!isReport && <th className="border p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {salaryList.map((s) => (
              <tr key={s.salary_id}>
                <td className="border p-2">{s.employee_id}</td>
                <td className="border p-2">{s.employee_name}</td>
                <td className="border p-2">{s.base_salary}</td>
                <td className="border p-2">{s.net_salary}</td>
                <td className="border p-2">{s.payment_mode}</td>
                <td className="border p-2">
                  {s.salary_from_month?.split("T")[0]} → {s.salary_to_month?.split("T")[0]}

                                         
                </td>
                {!isReport && (
                  <td className="border p-2">
                    <button onClick={() => editSalary(s)} className="text-blue-600 mr-3">Edit</button>
                    <button onClick={() => deleteSalary(s.salary_id)} className="text-red-600">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
