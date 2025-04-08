"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "Instructor",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const storedRole = Cookies.get("role");
    const storedUser = Cookies.get("user"); // Assuming you store user info in cookies
    setRole(storedRole || "");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || "Instructor",
          email: parsedUser.email || "",
          avatar: parsedUser.avatar || "",
        });
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    Cookies.remove("role");
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/signin";
  };

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
          <Link href="/dashboard_instructor/students">
            <p className="block px-4 py-3 my-4 bg-green-600 hover:bg-green-500 rounded-lg text-center cursor-pointer transition duration-300">
              Student Management
            </p>
          </Link>
        </nav>

        {/* Avatar and Logout Section */}
        <div className="mt-auto pt-4 border-t border-green-600">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              {user.email && (
                <p className="text-xs text-green-200">{user.email}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white hover:bg-green-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <ToastContainer />
        {children}
      </main>
    </div>
  );
}
