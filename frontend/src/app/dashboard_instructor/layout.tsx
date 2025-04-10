"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  const handleLogout = () => {
    Cookies.remove("role");
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/";
  };

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
          <Link href="/dashboard_instructor/uploadLabs" >
             <p className="block px-4 py-3 bg-[#007acc] hover:bg-blue-700 rounded-xl text-center cursor-pointer transition duration-300 text-sm font-medium">Upload Labs</p>
          </Link>
          {/* Avatar and Logout Section */}
    
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
      <main className="flex-1 p-6 rounded-xl transition-all duration-300">
        {children}
        <ToastContainer />
      </main>
    </div>
  );
}
