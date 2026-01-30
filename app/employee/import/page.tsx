"use client";

import { useState } from "react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleImport = async () => {
    if (!file) {
      alert("Please choose a CSV or Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("");

    const res = await fetch("/api/import", {
      method: "POST",
      body: formData,
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    setLoading(false);

    if (res.ok) {
      setMessage(
        data.message || "✅ Import completed successfully"
      );
    } else {
      setMessage(
        data.error || "❌ Import failed"
      );
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-3xl">
      <h2 className="text-2xl font-bold text-teal-700 mb-6">
        Import Data
      </h2>

      {/* FILE INPUT */}
      <label className="border-2 border-dashed border-teal-400 rounded-lg px-6 py-4 cursor-pointer inline-flex items-center gap-3 hover:bg-teal-50">
        📂 Choose CSV / Excel File
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        /> 
      </label>

      {file && (
        <p className="mt-3 text-sm text-gray-700">
          Selected: <b>{file.name}</b>
        </p>
      )}

      {/* IMPORT BUTTON */}
      <div className="mt-6">
        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Importing..." : "Import"}
        </button>
      </div>

      {/* TEMPLATE DOWNLOAD */}
      <a
        href="/templates/employee_portal_import.xlsx"
        download
        className="text-sm text-teal-600 underline mt-3 inline-block"
      >
        Download Employee Portal Template
      </a>

      {/* STATUS MESSAGE */}
      {message && (
        <div className="mt-4 font-semibold">{message}</div>
      )}
    </div>
  );
}
