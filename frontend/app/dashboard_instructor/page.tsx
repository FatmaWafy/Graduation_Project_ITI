"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { UserCircle, Bell } from "lucide-react";

const data = [
  { name: "OOP", score: 65 },
  { name: "SFSD", score: 80 },
  { name: "ALSDS", score: 78 },
  { name: "BD", score: 30 },
];

export default function InstructorDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">👋 Welcome back, Teacher!</h1>
          <div className="flex gap-3">
            <Bell className="w-6 h-6 text-gray-600" />
            <UserCircle className="w-8 h-8 text-gray-600" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader>Total Exams</CardHeader>
            <CardContent>12</CardContent>
          </Card>
          <Card>
            <CardHeader>Students</CardHeader>
            <CardContent>+320</CardContent>
          </Card>
          <Card>
            <CardHeader>Average Scores</CardHeader>
            <CardContent>64.3%</CardContent>
          </Card>
          <Card>
            <CardHeader>Modules</CardHeader>
            <CardContent>4</CardContent>
          </Card>
        </div>

        {/* Graph & Activities */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>Average Exam Scores By Module</CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Recent Activities</CardHeader>
            <CardContent>
              <p>You created a new exam: "Midterm Exam - SFSD"</p>
              <p>You edited the module: "Advanced Database Systems"</p>
              <p>You deleted the exam: "Quiz 1 - OOP"</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div className="mt-6">
          <Card>
            <CardHeader>Upcoming Events</CardHeader>
            <CardContent>
              <Calendar />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <Button className="bg-green-500 text-white">Generate Exam With AI</Button>
          <Button>Create Exam</Button>
          <Button>Schedule Exam</Button>
        </div>
      </main>
    </div>
  );
}