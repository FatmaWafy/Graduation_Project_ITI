"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedRole = Cookies.get("role");
    setRole(storedRole || "");
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (role !== "instructor") {
    return <p className="text-red-500 text-center mt-10">Access Denied</p>;
  }

  return (
    <div className="flex min-h-screen bg-white transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gray-300 text-black p-4 shadow-lg flex flex-col min-h-screen transition-all duration-300 rounded-tr-3xl rounded-br-3xl`}
      >
        <div className="flex justify-between items-center mb-6">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-center w-full">Instructor</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="flex flex-col gap-4">
          {[
            { href: "/dashboard_instructor", label: "Dashboard" },
            { href: "/dashboard_instructor/add-student", label: "Add Student" },
            { href: "/dashboard_instructor/add-exam", label: "Add Exam" },
            { href: "/dashboard_instructor/set-exam", label: "Set Exam" },
            { href: "/dashboard_instructor/add-note", label: "Send Note" },
            { href: "/dashboard_instructor/exam_logs", label: "Exam Logs" },
            { href: "/dashboard_instructor/students", label: "Student Management" },
          ].map((item, idx) => (
            <Link href={item.href} key={idx}>
              <p className="block px-4 py-3 bg-[#007acc] hover:bg-blue-700 rounded-xl text-center cursor-pointer transition duration-300 text-sm font-medium">
                {sidebarOpen ? item.label : item.label[0]}
              </p>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 rounded-xl transition-all duration-300">
        {children}
        <ToastContainer />
      </main>
    </div>
  );
}
