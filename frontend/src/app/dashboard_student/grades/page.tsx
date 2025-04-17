"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { getClientSideToken } from "@/lib/cookies";
interface ExamScore {
  exam_instance_id: number;
  exam_title: string;
  score: number;
  total_points: number;
}

export default function GradesPage() {
  const [examScores, setExamScores] = useState<ExamScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchExamScores = async () => {
      try {
        const token = getClientSideToken();
        if (!token) throw new Error("Token not found");

        const res = await fetch(
          "http://127.0.0.1:8000/exam/student-exam-answers/get_user_exams_scores/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch exam scores");
        const data = await res.json();
        setExamScores(data);
      } catch (error) {
        console.error("Error fetching exam scores:", error);
        setExamScores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExamScores();
  }, []);

  // Filter exams based on search query
  const filteredExams = examScores.filter((exam) =>
    exam.exam_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate average grade
  const averageGrade = examScores.length
    ? examScores.reduce(
        (sum, exam) => sum + (exam.score / exam.total_points) * 100,
        0
      ) / examScores.length
    : 0;

  // Function to get grade letter based on percentage
  const getGradeLetter = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Process data for charts
  const examChartData = examScores.map((exam) => ({
    name: exam.exam_title,
    percentage: (exam.score / exam.total_points) * 100,
  }));

  // Group exams by grade
  const gradeDistribution = examScores.reduce((acc, exam) => {
    const percentage = (exam.score / exam.total_points) * 100;
    const grade = getGradeLetter(exam.score, exam.total_points);

    if (!acc[grade]) {
      acc[grade] = { grade, count: 0 };
    }

    acc[grade].count += 1;
    return acc;
  }, {} as Record<string, { grade: string; count: number }>);

  const gradeDistributionData = Object.values(gradeDistribution).sort(
    (a, b) => {
      const gradeOrder = { A: 0, B: 1, C: 2, D: 3, F: 4 };
      return (
        gradeOrder[a.grade as keyof typeof gradeOrder] -
        gradeOrder[b.grade as keyof typeof gradeOrder]
      );
    }
  );

  // Create performance trend data
  const performanceTrendData = [...examScores]
    .sort((a, b) => a.exam_instance_id - b.exam_instance_id)
    .map((exam) => ({
      name: exam.exam_title,
      score: (exam.score / exam.total_points) * 100,
    }));

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
        <p className="text-muted-foreground">View and track your exam scores</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Exam List</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Exam Scores</CardTitle>
                  <CardDescription>
                    Your performance on all exams
                  </CardDescription>
                </div>
                <div className="mt-4 sm:mt-0">
                  <p className="text-sm font-medium">Average Grade</p>
                  <p className="text-2xl font-bold">
                    {averageGrade.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Filter by exam title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {filteredExams.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground">
                  {examScores.length === 0
                    ? "No exam scores found."
                    : "No exams match your search."}
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredExams.map((exam) => {
                    const percentage = (exam.score / exam.total_points) * 100;
                    const gradeLetter = getGradeLetter(
                      exam.score,
                      exam.total_points
                    );

                    return (
                      <div
                        key={exam.exam_instance_id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4"
                      >
                        <div className="mb-2 sm:mb-0">
                          <p className="font-medium">{exam.exam_title}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {exam.exam_instance_id}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4 text-right">
                            <p className="font-medium">
                              {exam.score}/{exam.total_points}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {percentage.toFixed(1)}%
                            </p>
                          </div>
                          <div
                            className={`
                            h-10 w-10 rounded-full flex items-center justify-center font-bold
                            ${
                              gradeLetter === "A"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                            ${
                              gradeLetter === "B"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                            }
                            ${
                              gradeLetter === "C"
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                            }
                            ${
                              gradeLetter === "D"
                                ? "bg-orange-100 text-orange-800"
                                : ""
                            }
                            ${
                              gradeLetter === "F"
                                ? "bg-red-100 text-red-800"
                                : ""
                            }
                          `}
                          >
                            {gradeLetter}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Number of exams by grade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={gradeDistributionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} exams`, "Count"]}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Exams" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Score Summary</CardTitle>
                <CardDescription>
                  Your performance across all exams
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={examChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value) => [`${value.toFixed(1)}%`, "Score"]}
                      />
                      <Legend />
                      <Bar
                        dataKey="percentage"
                        name="Score (%)"
                        fill="#82ca9d"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>
                Your scores over time across all exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value.toFixed(1)}%`, "Score"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Score (%)"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}