"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CheckCircle,
  Github,
  GraduationCap,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Code } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getClientSideToken } from "@/lib/cookies";
import { jwtDecode } from "jwt-decode";
const origin = process.env.NEXT_PUBLIC_API_URL;

import {
  type Assignment,
  type Course,
  type Exam,
  getAssignments,
  getCourses,
  getGradeDistribution,
  getExams,
} from "@/lib/api";

interface ExamScore {
  exam_instance_id: number;
  exam_title: string;
  score: number;
  total_points: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<Exam[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<
    { grade: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [externalStats, setExternalStats] = useState<{
    github_repos: number | null;
    leetcode_solved: number | null;
  } | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [examScores, setExamScores] = useState<ExamScore[]>([]);
  const [examScoresError, setExamScoresError] = useState<string | null>(null);

  const fetchExternalStats = async () => {
    try {
      const token = getClientSideToken();
      if (!token) throw new Error("Token not found");

      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      const res = await fetch(
        `${origin}/users/students/${userId}/external-stats/`
      );
      if (!res.ok) throw new Error("Failed to fetch external stats");

      const data = await res.json();
      setExternalStats(data);
    } catch (error) {
      console.error("Error fetching external stats:", error);
      setExternalStats(null);
    }
  };

  const fetchExamScores = async () => {
    try {
      const token = getClientSideToken();
      if (!token) throw new Error("Token not found");

      const res = await fetch(
        `${origin}/exam/student-exam-answers/get_user_exams_scores/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        // Check if it's a 404 (no scores found) or another error
        if (res.status === 404) {
          setExamScores([]);
          setExamScoresError("No exam scores available yet");
          return;
        }
        throw new Error("Failed to fetch exam scores");
      }

      const data = await res.json();

      // If the API returns an empty array or null, handle it gracefully
      if (!data || data.length === 0) {
        setExamScores([]);
        setExamScoresError("No exam scores available yet");
        return;
      }

      setExamScores(data);
      setExamScoresError(null);
    } catch (error) {
      console.error("Error fetching exam scores:", error);
      setExamScores([]);
      setExamScoresError("Failed to load exam scores");
    }
  };

  // Function to fetch upcoming exams
  const fetchUpcomingExams = async () => {
    try {
      const token = getClientSideToken();
      if (!token) throw new Error("Token not found");

      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      if (!userId) throw new Error("User ID not found in token");

      const examsData = await getExams(token, userId);
      if (!examsData) throw new Error("No exams data received");

      // Filter for upcoming exams only
      const upcoming = examsData
        .filter((exam) => isExamUpcoming(exam))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5); // Show only 5 most imminent exams

      setUpcomingExams(upcoming);
    } catch (error) {
      console.error("Error fetching upcoming exams:", error);
      setUpcomingExams([]);
    }
  };

  // Function to check if an exam is upcoming
  const isExamUpcoming = (exam: Exam) => {
    const examDate = new Date(exam.date);
    examDate.setHours(examDate.getHours() - 2); // Adjust for +2 offset
    return Date.now() < examDate.getTime();
  };

  useEffect(() => {
    fetchExternalStats();
    fetchExamScores();
    fetchUpcomingExams();
  }, []);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = getClientSideToken();
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;

        const res = await fetch(`${origin}/users/students/${userId}/`);
        if (!res.ok) throw new Error("Failed to fetch student data");

        const data = await res.json();
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setStudentData(null);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, assignmentsData, gradeDistData] = await Promise.all(
          [getCourses(), getAssignments(), getGradeDistribution()]
        );

        setCourses(coursesData);
        setAssignments(assignmentsData);
        setGradeDistribution(gradeDistData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const completedAssignments = assignments.filter(
    (a) => a.status === "completed"
  );
  const overdueAssignments = assignments.filter((a) => a.status === "overdue");

  // Calculate average grade from exam scores instead of mock grades
  const averageGrade = examScores.length
    ? examScores.reduce(
        (sum, exam) => sum + (exam.score / exam.total_points) * 100,
        0
      ) / examScores.length
    : 0;

  // Get upcoming exams in the next 7 days
  const examsThisWeek = upcomingExams.filter((exam) => {
    const examDate = new Date(exam.date);
    examDate.setHours(examDate.getHours() - 2); // Adjust for +2 offset
    return examDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }).length;

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Welcome back, {studentData?.username || user?.name}
          </h1>
          <p className='text-muted-foreground'>
            Here's an overview of your academic progress
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Upcoming Exams
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{upcomingExams.length}</div>
            <p className='text-xs text-muted-foreground'>
              Due this week: {examsThisWeek}
            </p>
          </CardContent>
        </Card>
        <Card className='bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Average Grade</CardTitle>
            <GraduationCap className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{averageGrade.toFixed(1)}%</div>
            <p className='text-xs text-muted-foreground'>Across all exams</p>
          </CardContent>
        </Card>
        <Card className='bg-card'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Completed Tasks
            </CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {completedAssignments.length}
            </div>
            <p className='text-xs text-muted-foreground'>
              Out of {assignments.length} total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Card className='lg:col-span-4 bg-card'>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>
              Your progress across all enrolled courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={courses}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className='stroke-muted'
                  />
                  <XAxis dataKey='title' className='text-muted-foreground' />
                  <YAxis className='text-muted-foreground' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      color: "var(--card-foreground)",
                    }}
                  />
                  <Bar
                    dataKey='progress'
                    fill='hsl(var(--primary))'
                    name='Progress (%)'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className='lg:col-span-3 bg-card'>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Your coding platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-6 justify-items-center'>
              {/* GitHub */}
              <div className='flex flex-col items-center gap-2'>
                <div className='relative w-24 h-24'>
                  <svg viewBox='0 0 36 36'>
                    <path
                      className='text-muted stroke-current'
                      d='M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831'
                      fill='none'
                      strokeWidth='2'
                    />
                    <path
                      className='text-primary stroke-current'
                      strokeDasharray={`${Math.min(
                        (externalStats?.github_repos || 0) * 10,
                        100
                      )}, 100`}
                      d='M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831'
                      fill='none'
                      strokeWidth='2'
                    />
                    <text
                      x='18'
                      y='20.35'
                      className='text-sm fill-primary'
                      textAnchor='middle'
                    >
                      {externalStats?.github_repos || 0}
                    </text>
                  </svg>
                </div>
                <div className='flex items-center gap-1 text-sm font-medium'>
                  <Github className='h-4 w-4 text-muted-foreground' />
                  GitHub Repos
                </div>
              </div>

              {/* LeetCode */}
              <div className='flex flex-col items-center gap-2'>
                <div className='relative w-24 h-24'>
                  <svg viewBox='0 0 36 36'>
                    <path
                      className='text-muted stroke-current'
                      d='M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831'
                      fill='none'
                      strokeWidth='2'
                    />
                    <path
                      className='text-green-500 stroke-current'
                      strokeDasharray={`${Math.min(
                        (typeof externalStats?.leetcode_solved === "object"
                          ? externalStats?.leetcode_solved?.total_solved || 0
                          : externalStats?.leetcode_solved || 0) / 2,
                        100
                      )}, 100`}
                      d='M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831'
                      fill='none'
                      strokeWidth='2'
                    />
                    <text
                      x='18'
                      y='20.35'
                      className='text-sm fill-green-500'
                      textAnchor='middle'
                    >
                      {typeof externalStats?.leetcode_solved === "object"
                        ? externalStats?.leetcode_solved?.total_solved || 0
                        : externalStats?.leetcode_solved || 0}
                    </text>
                  </svg>
                </div>
                <div className='flex items-center gap-1 text-sm font-medium'>
                  <Code className='h-4 w-4 text-muted-foreground' />
                  LeetCode Solved
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='bg-card'>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>
              Your upcoming exams sorted by date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {upcomingExams.length === 0 ? (
                <p className='text-center text-muted-foreground'>
                  No upcoming exams
                </p>
              ) : (
                upcomingExams.map((exam) => {
                  const examDate = new Date(exam.date);
                  examDate.setHours(examDate.getHours() - 2); // Adjust for +2 offset

                  return (
                    <div key={exam.id} className='flex items-center gap-4'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                        <FileText className='h-5 w-5 text-primary' />
                      </div>
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                          {exam.title || `Exam ${exam.id}`}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {exam.courseName} • {exam.duration} minutes
                        </p>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {examDate.toLocaleString()}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {upcomingExams.length > 0 && (
              <div className='mt-4 flex justify-end'>
                <Link href='/dashboard_student/exams'>
                  <Button variant='outline' size='sm'>
                    View All Exams
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className='bg-card'>
          <CardHeader>
            <CardTitle>Recent Exam Scores</CardTitle>
            <CardDescription>Your most recent exam performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {examScoresError ? (
                <div className='flex flex-col items-center justify-center py-6 text-center'>
                  <AlertCircle className='h-10 w-10 text-muted-foreground mb-2' />
                  <p className='text-muted-foreground'>{examScoresError}</p>
                </div>
              ) : examScores.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-6 text-center'>
                  <GraduationCap className='h-10 w-10 text-muted-foreground mb-2' />
                  <p className='text-muted-foreground'>
                    No exam scores available yet
                  </p>
                </div>
              ) : (
                examScores
                  .sort((a, b) => b.exam_instance_id - a.exam_instance_id)
                  .slice(0, 5)
                  .map((exam) => {
                    const percentage = (exam.score / exam.total_points) * 100;
                    return (
                      <div
                        key={exam.exam_instance_id}
                        className='flex items-center gap-4'
                      >
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                          <GraduationCap className='h-5 w-5 text-primary' />
                        </div>
                        <div className='flex-1 space-y-1'>
                          <p className='text-sm font-medium leading-none'>
                            {exam.exam_title}
                          </p>
                          <div className='w-full bg-gray-200 rounded-full h-1.5'>
                            <div
                              className={`h-1.5 rounded-full ${
                                percentage >= 70
                                  ? "bg-green-500"
                                  : percentage >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className='text-sm font-medium'>
                          {exam.score.toFixed(1)}/{exam.total_points.toFixed(1)}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
