"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = Cookies.get("role");
    setRole(storedRole || "");
    setLoading(false);
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  }

  if (role !== "instructor") {
    return <p className="text-red-500 text-center mt-10">Access Denied</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Instructor Panel
        </h2>
        <nav className="space-y-3">
          <Link href="/dashboard_instructor">
            <p className="block px-4 py-3 my-4 bg-green-600 hover:bg-green-500 rounded-lg text-center cursor-pointer transition duration-300">
              Dashboard
            </p>
          </Link>
          <Link href="/dashboard_instructor/add-student">
            <p className="block px-4 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-center cursor-pointer transition duration-300">
              Add Student
            </p>
          </Link>

          <Link href="/dashboard_instructor/add-exam">
            <p className="block px-4 py-3 my-4 bg-green-600 hover:bg-green-500 rounded-lg text-center cursor-pointer transition duration-300">
              Add Exam
            </p>
          </Link>
          <Link href="/dashboard_instructor/set-exam">
            <p className="block px-4 py-3 my-4 bg-green-600 hover:bg-green-500 rounded-lg text-center cursor-pointer transition duration-300">
              Set Exam
            </p>
          </Link>

          <Link href="/dashboard_instructor/add-note">
            <p className="block px-4 py-3 my-4 bg-green-600 hover:bg-green-500 rounded-lg text-center cursor-pointer transition duration-300">
              Send Note
            </p>
          </Link>
          <Link href="/dashboard_instructor/students" >
             <p className="block px-4 py-3 my-4 bg-green-600 hover:bg-green-500 rounded-lg text-center cursor-pointer transition duration-300">Student Management</p>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
