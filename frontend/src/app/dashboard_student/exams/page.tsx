"use client";

import { useEffect, useState } from "react";
import { Clock, BookOpen, FileText, Filter } from "lucide-react";
import Link from "next/link";
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
import { Exam, getExams, getExamDetails } from "@/lib/api";
import { jwtDecode } from "jwt-decode";
import { getClientSideToken } from "@/lib/cookies";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ExamFilter = "all" | "upcoming" | "in-progress" | "finished" | "submitted";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [examTitles, setExamTitles] = useState<Record<number, string>>({});
  const [activeFilter, setActiveFilter] = useState<ExamFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Correct time formatting without timezone offset
  const formatExamTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      timeZone: "UTC", // Force UTC to prevent auto timezone conversion
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExamInProgress = (exam: Exam) => {
    const examStartTime = new Date(exam.date).getTime();
    const examEndTime = examStartTime + exam.duration * 60000;
    const now = Date.now();
    return now >= examStartTime && now <= examEndTime;
  };

  const isExamFinished = (exam: Exam) => {
    const examEndTime = new Date(exam.date).getTime() + exam.duration * 60000;
    return Date.now() > examEndTime;
  };

  const isExamUpcoming = (exam: Exam) => {
    const examStartTime = new Date(exam.date).getTime();
    return Date.now() < examStartTime;
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
        setExams(examsData);
        setFilteredExams(examsData);

        // Fetch titles for exams (3 at a time)
        const MAX_CONCURRENT_REQUESTS = 3;
        const titles: Record<number, string> = {};

        for (let i = 0; i < examsData.length; i += MAX_CONCURRENT_REQUESTS) {
          const batch = examsData.slice(i, i + MAX_CONCURRENT_REQUESTS);
          await Promise.all(
            batch.map(async (exam) => {
              try {
                const details = await getExamDetails(token, exam.id);
                titles[exam.id] = details.title;
              } catch (err) {
                console.error(
                  `Failed to fetch title for exam ${exam.id}:`,
                  err
                );
                titles[exam.id] = `Exam ${exam.id}`;
              }
            })
          );
          setExamTitles((prev) => ({ ...prev, ...titles }));
        }

        // Show only 3 most imminent upcoming exams
        const upcomingExams = examsData
          .filter((exam) => isExamUpcoming(exam))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 3);

        upcomingExams.forEach((exam) => {
          toast.info(
            `Upcoming: ${titles[exam.id] || exam.id} starts at ${formatExamTime(
              exam.date
            )}`,
            { autoClose: 8000 }
          );
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load exams");
        console.error("Error fetching exams:", err);
        toast.error("Failed to load exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleStartExamClick = (exam: Exam) => {
    // Always allow opening the exam, regardless of time
    return true;
  };

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
            const mcqCount = Array.isArray(exam.MCQQuestions)
              ? exam.MCQQuestions.length
              : 0;
            const codingCount = Array.isArray(exam.CodingQuestions)
              ? exam.CodingQuestions.length
              : 0;
            const totalQuestions = mcqCount + codingCount;

            return (
              <Card key={exam.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
                <CardHeader>
                  <CardTitle>
                    {examTitles[exam.id] || (
                      <span className="inline-block h-6 w-32 animate-pulse bg-gray-200 rounded"></span>
                    )}
                  </CardTitle>
                  <CardDescription>{exam.courseName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatExamTime(exam.date)} • {exam.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {totalQuestions} questions
                      {totalQuestions > 0 && (
                        <span className="text-muted-foreground text-xs ml-1">
                          ({mcqCount} MCQ, {codingCount} coding)
                        </span>
                      )}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  {submitted ? (
                    <Button variant="secondary" disabled className="w-full">
                      Submitted ✅
                    </Button>
                  ) : (
                    <Link
                      href={`/dashboard_student/exam/${exam.id}`}
                      onClick={(e) => {
                        if (!handleStartExamClick(exam)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full"
                    >
                      <Button variant="default" className="w-full">
                        Start Exam
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No exams found matching your filter.
          </p>
        )}
      </div>
    </div>
  );
}
