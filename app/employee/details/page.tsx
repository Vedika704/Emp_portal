"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function EmployeeDetailsPage() {
  const searchParams = useSearchParams();
  const isReport = searchParams.get("report") === "true";

  const [employees, setEmployees] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState<any>({
    employee_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    nationality: "",
    emergency_contact_number: "",
    aadhaar_number: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    profile_photo: "",
  });

  /* LOAD */
  const loadEmployees = async () => {
    const res = await fetch("/api/employee");
    setEmployees(await res.json());
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* SAVE OR UPDATE */
  const saveEmployee = async () => {
    await fetch("/api/employee", {
      method: editMode ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    resetForm();
    loadEmployees();
  };

  const resetForm = () => {
    setEditMode(false);
    setForm({
      employee_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      nationality: "",
      emergency_contact_number: "",
      aadhaar_number: "",
      date_of_birth: "",
      gender: "",
      marital_status: "",
      profile_photo: "",
    });
  };

  /* EDIT */
  const editEmployee = (emp: any) => {
    setForm({
      ...emp,
      date_of_birth: emp.date_of_birth?.slice(0, 10),
    });
    setEditMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* DELETE */
  const deleteEmployee = async (id: string) => {
    await fetch("/api/employee", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: id }),
    });
    loadEmployees();
  };

  const logout = async () => {
  await fetch("/api/auth/logout", {
    method: "POST",
  });

  window.location.href = "/login";
};


  return (
    <div className="space-y-10">

      {/* ================= FORM (UNCHANGED) ================= */}
      <div className="bg-white p-8 rounded shadow">
        <h2 className="text-purple-600 font-semibold mb-6">
          Employee Personal Details
        </h2>

        <div className="grid grid-cols-3 gap-4">

          <input className="input" placeholder="Employee ID"
            value={form.employee_id}
            disabled={editMode}
            onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
          />

          <input className="input" placeholder="First Name"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />

          <input className="input" placeholder="Middle Name"
            value={form.middle_name}
            onChange={(e) => setForm({ ...form, middle_name: e.target.value })}
          />

          <input className="input" placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />

          <input className="input" placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input className="input" placeholder="Mobile Number"
            value={form.mobile_number}
            onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
          />

          <input className="input" placeholder="Nationality"
            value={form.nationality}
            onChange={(e) => setForm({ ...form, nationality: e.target.value })}
          />

          <input className="input" placeholder="Emergency Contact"
            value={form.emergency_contact_number}
            onChange={(e) =>
              setForm({ ...form, emergency_contact_number: e.target.value })
            }
          />

          <input className="input" placeholder="Aadhaar Number"
            value={form.aadhaar_number}
            onChange={(e) =>
              setForm({ ...form, aadhaar_number: e.target.value })
            }
          />

          <input type="date" className="input"
            value={form.date_of_birth}
            onChange={(e) =>
              setForm({ ...form, date_of_birth: e.target.value })
            }
          />

          <select className="input"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <select className="input"
            value={form.marital_status}
            onChange={(e) =>
              setForm({ ...form, marital_status: e.target.value })
            }
          >
            <option value="">Marital Status</option>
            <option>Single</option>
            <option>Married</option>
          </select>

          {/* ===== PROFILE PHOTO (UNCHANGED) ===== */}
          <div className="col-span-3">
            <label
              htmlFor="profilePhoto"
              className="cursor-pointer border border-black px-4 py-2 rounded bg-white hover:bg-gray-100 inline-block"
            >
              Profile Photo
            </label>

            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();
                setForm({ ...form, profile_photo: data.path });
              }}
            />

            {form.profile_photo && (
              <img
                src={form.profile_photo}
                alt="Profile"
                className="mt-2 h-20 w-20 object-cover rounded-full border"
              />
            )}
          </div>
        </div>

        {!isReport && (
          <button
            onClick={saveEmployee}
            className={`mt-6 px-8 py-2 text-white rounded ${
              editMode ? "bg-blue-600" : "bg-purple-600"
            }`}
          >
            {editMode ? "Update Employee" : "Save Employee"}
          </button>
        )}
      </div>

      
      {/* ================= REPORT BUTTONS ================= */}
{/* ================= REPORT ACTION BAR ================= */}
{isReport && (
  <div className="relative bg-white p-6 rounded shadow">

    {/* 🔴 LOGOUT BUTTON (TOP RIGHT) */}
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }}
      className="absolute top-4 right-6 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
    >
      Logout
    </button>

    {/* 📊 EXPORT BUTTONS */}
    <div className="flex gap-3 mb-4">
      <a
        href="/api/reports/employee/csv"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        CSV
      </a>

      <a
        href="/api/reports/employee/excel"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Excel
      </a>

      <a
        href="/api/reports/employee/pdf"
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        PDF
      </a>
    </div>

    {/* 📑 REPORT TABS */}
    <div className="flex gap-6 border-b pb-2 text-sm font-semibold">
      <a
        href="/employee/details?report=true"
        className="text-purple-600 border-b-2 border-purple-600 pb-1"
      >
        Employee
      </a>

      <a
        href="/employee/salary?report=true"
        className="text-gray-600 hover:text-purple-600"
      >
        Salary
      </a>

      <a
        href="/employee/qualification?report=true"
        className="text-gray-600 hover:text-purple-600"
      >
        Qualification
      </a>

      <a
        href="/employee/previous-employment?report=true"
        className="text-gray-600 hover:text-purple-600"
      >
        Previous Employment
      </a>
    </div>
  </div>
)}


      {/* ================= TABLE (UNCHANGED) ================= */}
      <div className="bg-white p-8 rounded shadow">
        <h2 className="font-semibold mb-4">Employee List</h2>

        <table className="w-full border border-black border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Emp ID</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">DOB</th>
              <th className="border px-3 py-2">Email</th>
              {!isReport && <th className="border px-3 py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.employee_id}>
                <td className="border px-3 py-2">{e.employee_id}</td>
                <td className="border px-3 py-2">
                  {e.first_name} {e.last_name}
                </td>
                <td className="border px-3 py-2">
                  {new Date(e.date_of_birth).toLocaleDateString()}
                </td>
                <td className="border px-3 py-2">{e.email}</td>

                {!isReport && (
                  <td className="border px-3 py-2 text-center">
                    <button className="text-blue-600 mr-4" onClick={() => editEmployee(e)}>
                      Edit
                    </button>
                    <button className="text-red-600" onClick={() => deleteEmployee(e.employee_id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
