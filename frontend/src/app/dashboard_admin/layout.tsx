// app/dashboard_admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import clsx from "clsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#007acc] text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            href="/dashboard_admin/Instructors"
            className={clsx(
              "block px-4 py-2 rounded hover:bg-[#005f99]",
              pathname.includes("/Instructors") && "bg-[#005f99]"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard_admin/profile"
            className={clsx(
              "block px-4 py-2 rounded hover:bg-[#005f99]",
              pathname.includes("/profile") && "bg-[#005f99]"
            )}
          >
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
        <ToastContainer />

      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
