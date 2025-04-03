"use client";

import { useEffect, useState } from "react";
import { Clock, BookOpen, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Exam, getExams } from "@/src/lib/api";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTokenFromCookies = (): string => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token" || name === "authToken") {
        return value;
      }
    }
    throw new Error("No authentication token found in cookies");
  };
  function calculateDuration(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  }
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = getTokenFromCookies();
        const response = await getExams(token);

        // Transform API data to match your frontend Exam type
        const examsData = (response.temp_exams || []).map((apiExam: any) => ({
          id: apiExam.id,
          title: `Exam ${apiExam.exam}`,
          courseName: apiExam.track ? `Track ${apiExam.track}` : "General Exam",
          date: apiExam.start_datetime,
          duration: calculateDuration(
            apiExam.start_datetime,
            apiExam.end_datetime
          ),
          questionsCount: 10, // Replace with actual data
          preparationProgress: 0, // Replace with actual data
        }));

        setExams(examsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load exams");
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
        <p className="text-muted-foreground">
          View and manage your upcoming exams
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exams?.length ? (
          exams.map((exam) => (
            <Card key={exam.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <FileText className="h-16 w-16 text-gray-400" />
              </div>
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription>{exam.courseName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(exam.date).toLocaleDateString()} • {exam.duration}{" "}
                    minutes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {exam.questionsCount} questions
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Preparation</span>
                    <span>{exam.preparationProgress}%</span>
                  </div>
                  <Progress value={exam.preparationProgress} />
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {exam.preparationProgress < 30
                    ? "Need to start preparing"
                    : exam.preparationProgress < 70
                    ? "In progress"
                    : "Well prepared"}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No exams found.
          </p>
        )}
      </div>
    </div>
  );
}
