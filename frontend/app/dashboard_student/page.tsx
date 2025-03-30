"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BookOpen, Calendar, CheckCircle, Clock, GraduationCap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Assignment, type Course, type Grade, getAssignments, getCourses, getGradeDistribution, getGrades } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<{ grade: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access"); // قراءة التوكن من الكوكيز
    console.log("Token from Cookies:", token);

    if (!token) {
      console.log("❌ No token found! Redirecting to login...");
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [coursesData, assignmentsData, gradesData, gradeDistData] = await Promise.all([
          getCourses(),
          getAssignments(),
          getGrades(),
          getGradeDistribution(),
        ]);

        setCourses(coursesData);
        setAssignments(assignmentsData);
        setGrades(gradesData);
        setGradeDistribution(gradeDistData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to Student Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl">{courses.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
