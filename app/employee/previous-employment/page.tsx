"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PreviousEmploymentPage() {
  const searchParams = useSearchParams();
  const isReport = searchParams.get("report") === "true";

  const [form, setForm] = useState<any>({});
  const [list, setList] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  /* ================= LOAD ================= */
  const loadData = async () => {
    const res = await fetch("/api/employee-previous-employment");
    setList(await res.json());
  };

  const loadEmployees = async () => {
    const res = await fetch("/api/employees");
    setEmployees(await res.json());
  };

  useEffect(() => {
    loadData();
    loadEmployees();
  }, []);

  /* ================= CHANGE ================= */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE ================= */
  const saveData = async () => {
    await fetch("/api/employee-previous-employment", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        previous_employment_id: editId,
      }),
    });

    setForm({});
    setEditId(null);
    loadData();
  };

  /* ================= EDIT ================= */
  const editRow = (row: any) => {
    setForm({
      ...row,
      start_date: row.start_date ? row.start_date.slice(0, 10) : "",
      end_date: row.end_date ? row.end_date.slice(0, 10) : "",
    });
    setEditId(row.previous_employment_id);
  };

  /* ================= DELETE ================= */
  const deleteRow = async (id: number) => {
    await fetch("/api/employee-previous-employment", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ previous_employment_id: id }),
    });
    loadData();
  };

  return (
    <>
      {/* ================= FORM ================= */}
      <div className="bg-white p-8 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold text-orange-600 mb-6">
          Previous Employment
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <select
            value={form.employee_id || ""}
            onChange={(e) => {
              const emp = employees.find(
                (x) => x.employee_id === e.target.value
              );
              setForm({
                ...form,
                employee_id: e.target.value,
                employee_name: emp
                  ? `${emp.first_name} ${emp.last_name}`
                  : "",
              });
            }}
            className="input"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.employee_id} - {e.first_name} {e.last_name}
              </option>
            ))}
          </select>

          <input
            name="previous_company_name"
            placeholder="Previous Company Name"
            value={form.previous_company_name || ""}
            onChange={handleChange}
            className="input"
          />

          <input
            name="previous_department_name"
            placeholder="Department Name"
            value={form.previous_department_name || ""}
            onChange={handleChange}
            className="input"
          />

          <input
            name="previous_job_title"
            placeholder="Job Title"
            value={form.previous_job_title || ""}
            onChange={handleChange}
            className="input"
          />

          <div>
            <label className="text-sm font-semibold">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date || ""}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">End Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date || ""}
              onChange={handleChange}
              className="input"
            />
          </div>

          <input
            name="last_drawn_salary"
            placeholder="Last Drawn Salary"
            value={form.last_drawn_salary || ""}
            onChange={handleChange}
            className="input"
          />

          <div className="col-span-3">
            <label className="block text-sm font-semibold mb-1">
              Reason for Leaving
            </label>
            <textarea
              name="reason_for_leaving"
              value={form.reason_for_leaving || ""}
              onChange={handleChange}
              className="input w-full h-32 resize-none"
            />
          </div>
        </div>

        {!isReport && (
          <button
            onClick={saveData}
            className="mt-6 bg-orange-600 text-white px-6 py-2 rounded"
          >
            {editId ? "Update Employment" : "Save Employment"}
          </button>
        )}
      </div>

      {/* ================= REPORT BUTTONS ================= */}
      {isReport && (
        <div className="flex gap-3 mb-6">
          <a
            href="/api/reports/previous-employment/csv"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            CSV
          </a>
          <a
            href="/api/reports/previous-employment/excel"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Excel
          </a>
          <a
            href="/api/reports/previous-employment/pdf"
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            PDF
          </a>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">Previous Employment List</h3>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Emp ID</th>
              <th className="border p-2">Emp Name</th>
              <th className="border p-2">Company</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">Job Title</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Last Salary</th>
              {!isReport && <th className="border p-2">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {list.map((r) => (
              <tr key={r.previous_employment_id}>
                <td className="border p-2">{r.employee_id}</td>
                <td className="border p-2">{r.employee_name}</td>
                <td className="border p-2">{r.previous_company_name}</td>
                <td className="border p-2">{r.previous_department_name}</td>
                <td className="border p-2">{r.previous_job_title}</td>
                <td className="border p-2">
                  {r.end_date?.slice(0, 10)}
                </td>
                <td className="border p-2">{r.reason_for_leaving}</td>
                <td className="border p-2">{r.last_drawn_salary}</td>

                {!isReport && (
                  <td className="border p-2">
                    <button
                      onClick={() => editRow(r)}
                      className="text-blue-600 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteRow(r.previous_employment_id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
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
