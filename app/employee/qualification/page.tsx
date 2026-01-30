"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function QualificationPage() {
  const searchParams = useSearchParams();
  const isReport = searchParams.get("report") === "true";

  const [form, setForm] = useState<any>({});
  const [qualificationList, setQualificationList] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  /* ================= LOAD ================= */
  const loadQualifications = async () => {
    const res = await fetch("/api/employee-qualification");
    setQualificationList(await res.json());
  };

  const loadEmployees = async () => {
    const res = await fetch("/api/employees");
    setEmployees(await res.json());
  };

  useEffect(() => {
    loadQualifications();
    loadEmployees();
  }, []);

  /* ================= CHANGE ================= */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE ================= */
  const saveQualification = async () => {
    await fetch("/api/employee-qualification", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        qualification_id: editId,
      }),
    });

    setForm({});
    setEditId(null);
    loadQualifications();
  };

  /* ================= EDIT ================= */
  const editQualification = (row: any) => {
    setForm(row);
    setEditId(row.qualification_id);
  };

  /* ================= DELETE ================= */
  const deleteQualification = async (id: number) => {
    await fetch("/api/employee-qualification", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qualification_id: id }),
    });
    loadQualifications();
  };

  return (
    <>
      {/* ================= FORM ================= */}
      <div className="bg-white p-8 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold text-purple-600 mb-6">
          Qualification Details
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <select
            name="employee_id"
            value={form.employee_id || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.employee_id} - {e.first_name} {e.last_name}
              </option>
            ))}
          </select>

          <select
            name="education_level"
            value={form.education_level || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Degree</option>
            <option>High School</option>
            <option>Associate Degree</option>
            <option>Bachelor&apos;s Degree</option>
            <option>Master&apos;s Degree</option>
            <option>Doctorate</option>
            <option>Diploma</option>
            <option>Other</option>
          </select>

          <input
            name="major_specialization"
            placeholder="Major / Specialization"
            value={form.major_specialization || ""}
            onChange={handleChange}
            className="input"
          />

          <input
            name="university_institute"
            placeholder="University / Institute"
            value={form.university_institute || ""}
            onChange={handleChange}
            className="input"
          />

          <select
            name="study_type"
            value={form.study_type || ""}
            onChange={handleChange}
            className="input"
          >
            <option value="">Study Type</option>
            <option>Regular</option>
            <option>Part-Time</option>
          </select>

          <input
            name="country"
            placeholder="Country"
            value={form.country || ""}
            onChange={handleChange}
            className="input"
          />

          <input
            name="year_of_passing"
            placeholder="Year of Passing"
            value={form.year_of_passing || ""}
            onChange={handleChange}
            className="input"
          />

          <input
            name="grade_percentage"
            placeholder="Grade / Percentage"
            value={form.grade_percentage || ""}
            onChange={handleChange}
            className="input"
          />
        </div>

        {!isReport && (
          <button
            onClick={saveQualification}
            className="mt-6 bg-purple-600 text-white px-6 py-2 rounded"
          >
            {editId ? "Update Qualification" : "Save Qualification"}
          </button>
        )}
      </div>

      {/* ================= REPORT BUTTONS ================= */}
      {isReport && (
        <div className="flex gap-3 mb-6">
          <a
            href="/api/reports/qualification/csv"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            CSV
          </a>
          <a
            href="/api/reports/qualification/excel"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Excel
          </a>
          <a
            href="/api/reports/qualification/pdf"
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            PDF
          </a>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">Qualification List</h3>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Emp ID</th>
              <th className="border p-2">Emp Name</th>
              <th className="border p-2">Degree</th>
              <th className="border p-2">Specialization</th>
              <th className="border p-2">University</th>
              <th className="border p-2">Study Type</th>
              <th className="border p-2">Country</th>
              <th className="border p-2">Year</th>
              <th className="border p-2">Grade</th>
              {!isReport && <th className="border p-2">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {qualificationList.map((q) => (
              <tr key={q.qualification_id}>
                <td className="border p-2">{q.employee_id}</td>
                <td className="border p-2">
                  {q.first_name} {q.last_name}
                </td>
                <td className="border p-2">{q.education_level}</td>
                <td className="border p-2">{q.major_specialization}</td>
                <td className="border p-2">{q.university_institute}</td>
                <td className="border p-2">{q.study_type}</td>
                <td className="border p-2">{q.country}</td>
                <td className="border p-2">{q.year_of_passing}</td>
                <td className="border p-2">{q.grade_percentage}</td>

                {!isReport && (
                  <td className="border p-2">
                    <button
                      onClick={() => editQualification(q)}
                      className="text-blue-600 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQualification(q.qualification_id)}
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
