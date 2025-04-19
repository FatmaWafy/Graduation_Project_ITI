"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface InstructorData {
  id: number;
}
interface Exam {
  temp_exam_id: number;
  exam_title: string;
}

export default function ExamLogsIndexPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ instructor_id?: number }>({});

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) throw new Error("Token not found");

      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      // Fetch instructor data
      const instructorResponse = await fetch(
        `http://127.0.0.1:8000/users/instructors/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!instructorResponse.ok) {
        if (instructorResponse.status === 404) {
          throw new Error("Instructor not found");
        }
        throw new Error(
          `Failed to fetch instructor data: ${instructorResponse.status}`
        );
      }

      const instructorData = await instructorResponse.json();
      setUser({ instructor_id: instructorData.id });

      // Fetch exams
      const examsUrl = `http://127.0.0.1:8000/exam/temp-exams/get_exam_info/?instructor_id=${instructorData.id}`;
      const examsResponse = await fetch(examsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!examsResponse.ok) {
        if (examsResponse.status === 404) {
          throw new Error("No exams found for this instructor");
        }
        throw new Error(`Failed to fetch exams: ${examsResponse.status}`);
      }

      const responseData = await examsResponse.json();
        console.log("Response Data:", responseData);
      const examsData = Array.isArray(responseData)
        ? responseData
        : [responseData];

      setExams(examsData);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Loading state with skeleton loader
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="bg-gray-100">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-red-600">
              {error.includes("404") || error.includes("not found")
                ? "No Exams Found"
                : "Something Went Wrong"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {error.includes("404") || error.includes("not found")
                ? "It looks like there are no exams available for this instructor."
                : error}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <FileText className="w-16 h-16 text-gray-400" />
            <Button
              onClick={fetchExams}
              className="bg-[#007acc] hover:bg-[#007abc] text-white flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No exams found
  if (exams.length === 0) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              No Exams Available
            </CardTitle>
            <CardDescription className="text-gray-600">
              It looks like there are no exams to display. Create a new exam to get started!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <FileText className="w-16 h-16 text-gray-400" />
            <Link href="/dashboard_instructor/create_exam" passHref>
              <Button className="bg-[#007acc] hover:bg-[#007abc] text-white">
                Create New Exam
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exams found
  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card
            key={exam.temp_exam_id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="bg-gray-100 rounded-t-lg">
              <CardTitle className="text-lg font-semibold text-[#000000]">
                {exam.exam_title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Exam ID: {exam.temp_exam_id}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <Link
                href={`/dashboard_instructor/exam_logs/${exam.temp_exam_id}`}
                passHref
              >
                <Button className="bg-[#007acc] hover:bg-[#007abc] text-white px-6 py-2 rounded-md">
                  View Logs
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}