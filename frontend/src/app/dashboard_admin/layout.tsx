"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { LayoutDashboard, UserCircle, School, Users, Settings, LogOut } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A61B1B] text-white">
              <School className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">Admin Panel</span>
              <span className="text-xs text-[#A61B1B]">Instructor Management</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard_admin/Instructors"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  pathname.includes("/dashboard_admin/Instructors")
                    ? "bg-[#A61B1B]/10 text-[#A61B1B] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard_admin/profile"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  pathname.includes("/dashboard_admin/profile")
                    ? "bg-[#A61B1B]/10 text-[#A61B1B] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <UserCircle className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </li>
            {/* <li>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                <Users className="h-5 w-5" />
                <span>Instructors</span>
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </li> */}
          </ul>
        </nav>

        <div className="p-2 border-t border-gray-100">
          <button className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="h-16 border-b border-gray-100 bg-white px-6 flex items-center">
          <div className="text-lg font-medium text-gray-900">
            {pathname.includes("/Instructors")
              ? "Instructor Dashboard"
              : pathname.includes("/profile")
                ? "Admin Profile"
                : "Admin Dashboard"}
          </div>
        </header>

        <main className="flex-1 overflow-auto w-full p-6">
          <ToastContainer />
          {children}
        </main>
      </div>
    </div>
  )
}
