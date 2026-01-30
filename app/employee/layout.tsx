"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded ${
      pathname.startsWith(path)
        ? "bg-teal-200 font-semibold"
        : "hover:bg-gray-200"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-xl font-bold text-teal-700 mb-6">
          Employee Portal
        </h1>

        <nav className="space-y-2">
          <Link
            href="/employee/details"
            className={linkClass("/employee/details")}
          >
            Employee Details
          </Link>

          <Link
            href="/employee/salary"
            className={linkClass("/employee/salary")}
          >
            Employee Salary
          </Link>

          <Link
            href="/employee/qualification"
            className={linkClass("/employee/qualification")}
          >
            Qualification
          </Link>

          <Link
            href="/employee/previous-employment"
            className={linkClass("/employee/previous-employment")}
          >
            Previous Employment
          </Link>

          <Link
            href="/employee/details?report=true"
            className={linkClass("/employee/details")}
          >
            Reports
          </Link>

          {/* ✅ NEW IMPORT TAB */}
          <Link
            href="/employee/import"
            className={linkClass("/employee/import")}
          >
            Import
          </Link>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
