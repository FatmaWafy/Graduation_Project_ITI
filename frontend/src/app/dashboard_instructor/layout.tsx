"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LogOut, Menu, X, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { getClientSideToken } from "@/lib/cookies";

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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } fixed top-0 left-0 h-screen border-r p-4 flex flex-col z-50 transition-all duration-300 bg-white text-black`}
      >
        <div className="flex justify-between items-center mb-6 border-b">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-center w-full   pb-3">
              Instructor Portal
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-[#007acc] focus:outline-none flex items-center mb-2"
          >
            <ChevronLeft
              className={`h-6 w-6 transition-transform ${
                sidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {[
            { href: "/dashboard_instructor", label: "Dashboard" },
            { href: "/dashboard_instructor/create-exam", label: "Create Exam" },
            { href: "/dashboard_instructor/set-exam", label: "Set Exam" },
            { href: "/dashboard_instructor/exam_logs", label: "Exam Logs" },
            { href: "/dashboard_instructor/uploadLabs", label: "Upload Labs" },
            { href: "/dashboard_instructor/add-note", label: "Send Note" },
            { href: "/dashboard_instructor/grades", label: "Grades" },
            {
              href: "/dashboard_instructor/students",
              label: "Student Management",
            },
            { href: "/dashboard_instructor/Scrapping", label: "Student Progress" },
            { href: "/dashboard_instructor/profile", label: "Profile" },
          ].map((item, idx) => (
            <Link href={item.href} key={idx}>
              <p className="bg-[#007acc] hover:bg-[#007abc] text-white rounded-md text-center flex items-center gap-3 px-3 py-2 text-sm transition-colors">
                {sidebarOpen ? item.label : item.label[0]}
              </p>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-t">
          <div className="flex items-center gap-3">
            {sidebarOpen && (
              <>
                {studentData ? (
                  <>
                    <Avatar>
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
                      <AvatarFallback>
                        {studentData.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {studentData.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {studentData.email}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar>
                      <AvatarImage src="" alt="Instructor" />
                      <AvatarFallback>
                        {studentData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{studentData.name}</p>
                      <p className="text-xs text-gray-400">
                        {studentData.email}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className={`text-white bg-[#007acc] hover:bg-[#007abc] hover:text-white ${
                !sidebarOpen ? "mx-auto" : ""
              }`}
            >
              <LogOut className="h-5 w-5" />
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
