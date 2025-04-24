"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  Bell, 
  BookOpen,
  Users,
  BarChart3,
  Layers,
} from "lucide-react";
const origin = process.env.NEXT_PUBLIC_API_URL;

import { useRouter } from "next/navigation";
import { getClientSideToken } from "@/lib/cookies";

const data = [
  { name: "Linux", score: 65 },
  { name: "Postgres", score: 80 },
  { name: "Django", score: 78 },
  { name: "OS", score: 30 },
];

export default function InstructorDashboard() {

    interface StudentData {
      username: string;
      // Add other properties of studentData if needed
    }

    const [studentData, setStudentData] = useState<StudentData | null>(null);

    useEffect(() => {
      const user = {}; // Replace with actual user data or context retrieval logic
      console.log("User data from context:", user);
  
      const fetchStudentData = async () => {
        try {
          const token = getClientSideToken()
          if (!token) throw new Error("Token not found")
  
          const decoded: any = jwtDecode(token)
          const userId = decoded.user_id
  
          console.log("User ID from token in Dashboard:", userId)
  
          const res = await fetch(`${origin}/users/instructors/${userId}/`)
          if (!res.ok) throw new Error("Failed to fetch student data")
  
          const data = await res.json()
          setStudentData(data)
          console.log("Student data fetched:", data)
        } catch (error) {
          console.error("Error fetching student data:", error)
          setStudentData(null)
        }
      }
  
      fetchStudentData()
    }, [])

  const router = useRouter();
  return (
    <div className="flex   ">

      <main className="flex-1 p-6  ">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome back, {studentData?.username || "Instructor"}!</h1>
          {/* <div className="flex gap-3">
            <Bell className="w-6 h-6 text-gray-600" />
            <UserCircle className="w-8 h-8 text-gray-600" />
          </div> */}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-xl transition">
            <CardHeader className="flex items-center gap-2">
              <BookOpen className="text-blue-600" />
              <CardTitle>Total Exams</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-800">12</CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition">
            <CardHeader className="flex items-center gap-2">
              <Users className="text-blue-600" />
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-800">+320</CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition">
            <CardHeader className="flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              <CardTitle>Average Scores</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-800">64.3%</CardContent>
          </Card>
          <Card className="shadow-md hover:shadow-xl transition">
            <CardHeader className="flex items-center gap-2">
              <Layers className="text-blue-600" />
              <CardTitle>Modules</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-800">4</CardContent>
          </Card>
        </div>

        {/* Graph & Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-blue-800">Average Exam Scores By Module</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#007acc" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-blue-800">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700 text-sm">
              <div className="bg-blue-50 px-3 py-2 rounded-md">📝 You created a new exam: <strong>Midterm Exam - SFSD</strong></div>
              <div className="bg-blue-50 px-3 py-2 rounded-md">🛠️ You edited the module: <strong>Advanced Database Systems</strong></div>
              <div className="bg-blue-50 px-3 py-2 rounded-md">🗑️ You deleted the exam: <strong>Quiz 1 - OOP</strong></div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="mt-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-blue-800">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* <div className="flex flex-wrap gap-4 my-6">
          <button
            onClick={() => router.push("/dashboard_instructor/add-exam")}
            className="px-6 py-3 bg-[#007acc] hover:bg-[#007abc] text-white rounded-lg transition duration-300"
          >
            Create Exam
          </button>
          <button
            onClick={() => router.push("/dashboard_instructor/set-exam")}
            className="px-6 py-3 bg-[#007acc] hover:bg-[#007abc] text-white rounded-lg transition duration-300"
          >
            Schedule Exam
          </button>
        </div> */}
      </main>
    </div>
  );
}
