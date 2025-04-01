"use client"

import { useEffect, useState } from "react"
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
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { type Grade, type PerformanceData, getGrades, getPerformanceData } from "@/src/lib/api"

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesData, performData] = await Promise.all([getGrades(), getPerformanceData()])

        setGrades(gradesData)
        setPerformanceData(performData)
      } catch (error) {
        console.error("Error fetching grades data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Process data for charts
  const courseGrades = grades.reduce(
    (acc, grade) => {
      if (!acc[grade.courseId]) {
        acc[grade.courseId] = {
          courseName: grade.courseName,
          grades: [],
        }
      }
      acc[grade.courseId].grades.push({
        assignment: grade.assignment,
        score: (grade.score / grade.maxScore) * 100,
        date: grade.date,
      })
      return acc
    },
    {} as Record<string, { courseName: string; grades: { assignment: string; score: number; date: string }[] }>,
  )

  const courseAverages = Object.values(courseGrades).map((course) => {
    const avgScore = course.grades.reduce((sum, g) => sum + g.score, 0) / course.grades.length
    return {
      courseName: course.courseName,
      averageScore: avgScore,
    }
  })

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grades</h1>
        <p className="text-muted-foreground">View and analyze your academic performance</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">By Course</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade Overview</CardTitle>
              <CardDescription>Your average grades across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseAverages} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="courseName" angle={-45} textAnchor="end" height={70} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, "Average Score"]} />
                    <Legend />
                    <Bar dataKey="averageScore" name="Average Score (%)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>Your most recent grades across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grades
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{grade.assignment}</p>
                          <p className="text-sm text-muted-foreground">{grade.courseName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {grade.score}/{grade.maxScore}
                          </p>
                          <p className="text-sm text-muted-foreground">{new Date(grade.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Your performance compared to class average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={performanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Your Score" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Class Average" dataKey="average" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4 pt-4">
          {Object.values(courseGrades).map((course) => (
            <Card key={course.courseName}>
              <CardHeader>
                <CardTitle>{course.courseName}</CardTitle>
                <CardDescription>
                  Average: {(course.grades.reduce((sum, g) => sum + g.score, 0) / course.grades.length).toFixed(1)}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={course.grades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="assignment" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                      <Legend />
                      <Line type="monotone" dataKey="score" name="Score (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Your performance across different subjects compared to class average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" name="Your Score" fill="#8884d8" />
                    <Bar dataKey="average" name="Class Average" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

