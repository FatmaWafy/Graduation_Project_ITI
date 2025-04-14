"use client";

import { useEffect, useState } from "react";

import { Clock, BookOpen, FileText, Filter } from "lucide-react";
import Link from "next/link";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Exam, getExams } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { getClientSideToken } from "@/lib/cookies";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ExamFilter = "all" | "upcoming" | "in-progress" | "finished" | "submitted";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [activeFilter, setActiveFilter] = useState<ExamFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatExamTime = (dateString: string) => {
    const date = new Date(dateString);
    // Adjust for the +2 hours offset by subtracting 2 hours
    date.setHours(date.getHours() - 2);

    return `${date.getUTCFullYear()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getUTCDate()}, ${String(date.getUTCHours()).padStart(
      2,
      "0"
    )}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
  };

  const isExamInProgress = (exam: Exam) => {
    const now = Date.now();
    const examDate = new Date(exam.date);
    examDate.setHours(examDate.getHours() - 2); // Adjust for +2 offset
    const examStartTime = examDate.getTime();
    const examEndTime = examStartTime + exam.duration * 60000;
    return now >= examStartTime && now <= examEndTime;
  };

  const isExamFinished = (exam: Exam) => {
    const examDate = new Date(exam.date);
    examDate.setHours(examDate.getHours() - 2); // Adjust for +2 offset
    const examEndTime = examDate.getTime() + exam.duration * 60000;
    return Date.now() > examEndTime;
  };

  const isExamUpcoming = (exam: Exam) => {
    const examDate = new Date(exam.date);
    examDate.setHours(examDate.getHours() - 2); // Adjust for +2 offset
    return Date.now() < examDate.getTime();
  };

  const isExamSubmitted = (examId: number) => {
    return localStorage.getItem(`submitted_exam_${examId}`) === "true";
  };

  const filterExams = (filter: ExamFilter) => {
    setActiveFilter(filter);
    switch (filter) {
      case "upcoming":
        setFilteredExams(exams.filter((exam) => isExamUpcoming(exam)));
        break;
      case "in-progress":
        setFilteredExams(exams.filter((exam) => isExamInProgress(exam)));
        break;
      case "finished":
        setFilteredExams(exams.filter((exam) => isExamFinished(exam)));
        break;
      case "submitted":
        setFilteredExams(exams.filter((exam) => isExamSubmitted(exam.id)));
        break;
      default:
        setFilteredExams([...exams]);
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getClientSideToken();
        if (!token) throw new Error("No authentication token found");

        const decoded = jwtDecode(token) as { user_id?: string };
        if (!decoded.user_id) throw new Error("User ID not found in token");

        const examsData = await getExams(token, decoded.user_id);
        if (!examsData) throw new Error("No exams data received");

        setExams(examsData);
        setFilteredExams(examsData);

        // Show only 3 most imminent upcoming exams
        const upcomingExams = examsData
          .filter((exam) => isExamUpcoming(exam))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 3);
        upcomingExams.forEach((exam) => {
          toast.info(
            `Upcoming: ${exam.title || exam.id} — Start at ${new Date(
              new Date(exam.date).getTime() - 2 * 60 * 60 * 1000
            ).toLocaleString()}`,
            { autoClose: 8000 }
          );
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load exams";
        setError(errorMessage);
        toast.error(errorMessage);
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
      <div className="col-span-full flex flex-col items-center justify-center py-12 space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">No exams found</p>
        <p className="text-muted-foreground text-sm">
          There are no Exams available for this Account.. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={5000} limit={3} />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Exams</h1>
        <p className="text-muted-foreground">
          View and manage your upcoming exams
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Tabs
          value={activeFilter}
          onValueChange={(value) => filterExams(value as ExamFilter)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all">All Exams</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="finished">Finished</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => {
            const submitted = isExamSubmitted(exam.id);
            const inProgress = isExamInProgress(exam);
            const upcoming = isExamUpcoming(exam);
            const finished = isExamFinished(exam);
            const totalQuestions = exam.questionsCount || 0;

            return (
              <Card key={exam.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{exam.title || `Exam ${exam.id}`}</CardTitle>
                      <CardDescription>{exam.courseName}</CardDescription>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        submitted
                          ? "bg-green-100 text-green-800"
                          : finished
                          ? "bg-gray-100 text-gray-800"
                          : inProgress
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {submitted
                        ? "Submitted"
                        : finished
                        ? "Finished"
                        : inProgress
                        ? "In Progress"
                        : "Upcoming"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {" "}
                      {new Date(
                        new Date(exam.date).getTime() - 2 * 60 * 60 * 1000
                      ).toLocaleString()}{" "}
                      • {exam.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{totalQuestions} questions</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {submitted ? (
                    <Button variant="secondary" disabled className="w-full">
                      Submitted ✅
                    </Button>
                  ) : finished ? (
                    <Button variant="secondary" disabled className="w-full">
                      Exam Closed
                    </Button>
                  ) : upcoming ? (
                    <Button variant="outline" disabled className="w-full">
                      Starts{" "}
                      {new Date(
                        new Date(exam.date).getTime() - 2 * 60 * 60 * 1000
                      ).toLocaleString()}
                    </Button>
                  ) : (
                    <Link
                      href={`/dashboard_student/exams/rules/${exam.id}`}
                      className="w-full"
                    >
                      <Button variant="default" className="w-full">
                        {inProgress ? "Continue Exam" : "Start Exam"}
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">No exams found</p>
            <p className="text-muted-foreground text-sm">
              {activeFilter === "all"
                ? "You don't have any exams yet."
                : `No ${activeFilter.replace("-", " ")} exams found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
