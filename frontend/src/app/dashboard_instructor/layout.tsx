"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {  Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { getClientSideToken } from "@/lib/cookies";
import {
  LogOut,
  X,
  ChevronLeft,
  Home,
  FileText,
  Calendar,
  BookOpen,
  Bell,
  Users,
  Upload,
  BarChart2,
  User,
  TrendingUp,
} from "lucide-react"


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

  interface StudentData {
    username: string;
    email: string;
    profile_image?: string; // Added profile_image to the interface
  }

  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch role
        const storedRole = Cookies.get("role");
        setRole(storedRole || "");

        // Fetch student data
        const token = getClientSideToken();
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;

        console.log("User ID from token in Dashboard:", userId);

        const res = await fetch(
          `http://127.0.0.1:8000/users/instructors/${userId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch student data");

        const data: StudentData = await res.json();
        setStudentData(data);
        console.log("Student data fetched:", data);

        // Update user state with fetched data
        setUser({
          name: data.username || "Instructor",
          email: data.email || "",
          avatar: data.profile_image || "",
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setStudentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Cookies.remove("role");
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/";
  };
  const navItems = [
    { href: "/dashboard_instructor", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { href: "/dashboard_instructor/create-exam", label: "Create Exam", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard_instructor/set-exam", label: "Set Exam", icon: <Calendar className="h-5 w-5" /> },
    { href: "/dashboard_instructor/exam_logs", label: "Exam Logs", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/dashboard_instructor/uploadLabs", label: "Upload Labs", icon: <Upload className="h-5 w-5" /> },
    { href: "/dashboard_instructor/add-note", label: "Send Note", icon: <Bell className="h-5 w-5" /> },
    { href: "/dashboard_instructor/grades", label: "Grades", icon: <BarChart2 className="h-5 w-5" /> },
    { href: "/dashboard_instructor/Scrapping", label: "Student Progress", icon: <TrendingUp className="h-5 w-5" /> },
    { href: "/dashboard_instructor/students", label: "Student Management", icon: <Users className="h-5 w-5" /> },
    { href: "/dashboard_instructor/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    
  ]


  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (role !== "instructor") {
    return <p className='text-red-500 text-center mt-10'>Access Denied</p>;
  }

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <aside
    className={`${
      sidebarOpen ? "w-64" : "w-20"
    } fixed top-0 left-0 h-screen border-r border-gray-200 flex flex-col z-50 transition-all duration-300 bg-white shadow-md`}
  >
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      {sidebarOpen ? (
        <h2 className="text-xl font-bold text-[#007acc]">Instructor Portal</h2>
      ) : (
        <div className="mx-auto">
          <div className="h-10 w-10 rounded-full bg-[#007acc] text-white flex items-center justify-center font-bold text-lg">
            IP
          </div>
        </div>
      )}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-gray-500 hover:text-[#007acc] focus:outline-none"
      >
        <ChevronLeft
          className={`h-6 w-6 transition-transform ${sidebarOpen ? "" : "rotate-180"}`}
        />
      </button>
    </div>

    <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
      {navItems.map((item, idx) => {
        const isActive = typeof window !== "undefined" && window.location.pathname === item.href;
        return (
          <Link href={item.href} key={idx}>
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#007acc] text-white font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-[#007acc]"
              }`}
            >
              <div className={`${isActive ? "text-white" : "text-gray-500"}`}>{item.icon}</div>
              {sidebarOpen && (
                <span className={`${isActive ? "font-medium" : ""} truncate`}>{item.label}</span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>

    <div className="mt-auto p-4 border-t border-gray-200">
      <div className="flex items-center gap-3">
        {sidebarOpen && (
          <>
            {studentData ? (
              <>
                <Avatar className="border border-gray-200">
                  <AvatarImage
                    src={
                      studentData.profile_image?.startsWith("http")
                        ? studentData.profile_image
                        : studentData.profile_image
                        ? `http://127.0.0.1:8000${studentData.profile_image}`
                        : ""
                    }
                    alt={studentData.username}
                  />
                  <AvatarFallback className="bg-[#007acc] text-white">
                    {studentData.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{studentData.username}</p>
                  <p className="text-xs text-gray-500 truncate">{studentData.email}</p>
                </div>
              </>
            ) : (
              <>
                <Avatar className="border border-gray-200">
                  <AvatarImage src="/placeholder.svg" alt="Instructor" />
                  <AvatarFallback className="bg-[#007acc] text-white">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </>
            )}
          </>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className={`text-white bg-[#007acc] hover:bg-[#005fa3] rounded-full ${!sidebarOpen ? "mx-auto" : ""}`}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 rounded-xl transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
        <ToastContainer />
      </main>
    </div>
  );
}
