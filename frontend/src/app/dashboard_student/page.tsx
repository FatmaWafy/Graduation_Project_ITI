// "use client"

// import { useEffect, useState } from "react"
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
// import { BookOpen, Calendar, CheckCircle, Clock, GraduationCap } from "lucide-react"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { useAuth } from "@/lib/auth-context"
// import {
//   type Assignment,
//   type Course,
//   type Grade,
//   getAssignments,
//   getCourses,
//   getGradeDistribution,
//   getGrades,
// } from "@/lib/api"
// import { jwtDecode } from "jwt-decode"

// type JwtPayload = {
//   user_id: number
//   exp: number
//   iat: number
// }

// const getUserIdFromToken = () => {
//   if (typeof window !== "undefined") {
//     const token = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("token="))
//       ?.split("=")[1]

//     console.log("🔐 Token from cookie:", token)

//     if (token) {
//       const decoded: JwtPayload = jwtDecode(token)
//       console.log("🧠 Decoded token:", decoded)
//       return decoded.user_id
//     }
//   }

//   return null
// }



// export default function DashboardPage() {
//   const { user } = useAuth()
//   const [courses, setCourses] = useState<Course[]>([])
//   const [assignments, setAssignments] = useState<Assignment[]>([])
//   const [grades, setGrades] = useState<Grade[]>([])
//   const [gradeDistribution, setGradeDistribution] = useState<{ grade: string; count: number }[]>([])
//   const [loading, setLoading] = useState(true)
//   const [studentName, setStudentName] = useState("")


//   useEffect(() => {
//     const fetchStudent = async () => {
//       const id = getUserIdFromToken()
//       if (!id) return
    
//       try {
//         const res = await fetch(`http://127.0.0.1:8000/users/students/${id}`)
//         const data = await res.json()
//         if (res.ok && data.user) {
//           setStudentName(data.user.username)
//         } else {
//           console.error("Student not found", data.detail)
//         }
//       } catch (err) {
//         console.error("Failed to fetch student info:", err)
//       }
//     }
    

//     fetchStudent()
//   }, [])

//   const pendingAssignments = assignments.filter((a) => a.status === "pending")
//   const completedAssignments = assignments.filter((a) => a.status === "completed")
//   const overdueAssignments = assignments.filter((a) => a.status === "overdue")

//   const averageGrade = grades.length
//     ? grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / grades.length
//     : 0

//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

//   if (loading) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-4 md:flex-row">
//         <div className="flex-1">
//         <h1 className="text-3xl font-bold tracking-tight">Welcome back, {studentName}</h1>
//         <p className="text-muted-foreground">Here's an overview of your academic progress</p>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="bg-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{pendingAssignments.length}</div>
//             <p className="text-xs text-muted-foreground">
//               Due this week:{" "}
//               {
//                 pendingAssignments.filter((a) => new Date(a.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
//                   .length
//               }
//             </p>
//           </CardContent>
//         </Card>
//         <Card className="bg-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
//             <GraduationCap className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{averageGrade.toFixed(1)}%</div>
//             <p className="text-xs text-muted-foreground">Across all courses</p>
//           </CardContent>
//         </Card>
//         <Card className="bg-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
//             <CheckCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{completedAssignments.length}</div>
//             <p className="text-xs text-muted-foreground">Out of {assignments.length} total</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//         <Card className="lg:col-span-4 bg-card">
//           <CardHeader>
//             <CardTitle>Course Progress</CardTitle>
//             <CardDescription>Your progress across all enrolled courses</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={courses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//                   <XAxis dataKey="title" className="text-muted-foreground" />
//                   <YAxis className="text-muted-foreground" />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "var(--card)",
//                       borderColor: "var(--border)",
//                       color: "var(--card-foreground)",
//                     }}
//                   />
//                   <Bar dataKey="progress" fill="hsl(var(--primary))" name="Progress (%)" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="lg:col-span-3 bg-card">
//           <CardHeader>
//             <CardTitle>Grade Distribution</CardTitle>
//             <CardDescription>Your grade distribution across all courses</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={gradeDistribution}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="count"
//                     nameKey="grade"
//                   >
//                     {gradeDistribution.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "var(--card)",
//                       borderColor: "var(--border)",
//                       color: "var(--card-foreground)",
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2">
//         <Card className="bg-card">
//           <CardHeader>
//             <CardTitle>Upcoming Assignments</CardTitle>
//             <CardDescription>Your pending assignments sorted by due date</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {pendingAssignments.length === 0 ? (
//                 <p className="text-center text-muted-foreground">No pending assignments</p>
//               ) : (
//                 pendingAssignments
//                   .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
//                   .slice(0, 5)
//                   .map((assignment) => (
//                     <div key={assignment.id} className="flex items-center gap-4">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                         <Calendar className="h-5 w-5 text-primary" />
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         <p className="text-sm font-medium leading-none">{assignment.title}</p>
//                         <p className="text-xs text-muted-foreground">{assignment.courseName}</p>
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         Due: {new Date(assignment.dueDate).toLocaleDateString()}
//                       </div>
//                     </div>
//                   ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-card">
//           <CardHeader>
//             <CardTitle>Recent Grades</CardTitle>
//             <CardDescription>Your most recent grades across all courses</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {grades.length === 0 ? (
//                 <p className="text-center text-muted-foreground">No grades available</p>
//               ) : (
//                 grades
//                   .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//                   .slice(0, 5)
//                   .map((grade) => (
//                     <div key={grade.id} className="flex items-center gap-4">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
//                         <GraduationCap className="h-5 w-5 text-primary" />
//                       </div>
//                       <div className="flex-1 space-y-1">
//                         <p className="text-sm font-medium leading-none">{grade.assignment}</p>
//                         <p className="text-xs text-muted-foreground">{grade.courseName}</p>
//                       </div>
//                       <div className="text-sm font-medium">
//                         {grade.score}/{grade.maxScore}
//                       </div>
//                     </div>
//                   ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



"use client"

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Github,
  GraduationCap,
} from "lucide-react";
import { Code } from "lucide-react";
import CountUp from "react-countup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { getClientSideToken } from "@/lib/cookies";
import { jwtDecode } from "jwt-decode";

import {
  type Assignment,
  type Course,
  type Grade,
  getAssignments,
  getCourses,
  getGradeDistribution,
  getGrades,
} from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<
    { grade: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [externalStats, setExternalStats] = useState<{
    github_repos: number | null;
    leetcode_solved: number | null;
  } | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const fetchExternalStats = async () => {
    try {
      const token = getClientSideToken();
      if (!token) throw new Error("Token not found");

      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      const res = await fetch(
        `http://127.0.0.1:8000/users/students/${userId}/external-stats/`
      );
      if (!res.ok) throw new Error("Failed to fetch external stats");

      const data = await res.json();
      setExternalStats(data);
      console.log("External stats fetched:", data);
    } catch (error) {
      console.error("Error fetching external stats:", error);
      setExternalStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalStats();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [assignmentsData, gradesData, gradeDistData] = await Promise.all([
  //         getAssignments(),
  //         getGrades(),
  //         getGradeDistribution(),
  //       ])

  //       setAssignments(assignmentsData)
  //       setGrades(gradesData)
  //       setGradeDistribution(gradeDistData)
  //     } catch (error) {
  //       console.error("Error fetching dashboard data:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [])
  useEffect(() => {
    console.log("User data from context:", user);

    const fetchStudentData = async () => {
      try {
        const token = getClientSideToken();
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;

        console.log("User ID from token in Dashboard:", userId);

        const res = await fetch(
          `http://127.0.0.1:8000/users/students/${userId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch student data");

        const data = await res.json();
        setStudentData(data);
        console.log("Student data fetched:", data);
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
        const [coursesData, assignmentsData, gradesData, gradeDistData] =
          await Promise.all([
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
  }, []);

  const pendingAssignments = assignments.filter((a) => a.status === "pending");
  const completedAssignments = assignments.filter(
    (a) => a.status === "completed"
  );
  const overdueAssignments = assignments.filter((a) => a.status === "overdue");

  const averageGrade = grades.length
    ? grades.reduce(
        (sum, grade) => sum + (grade.score / grade.maxScore) * 100,
        0
      ) / grades.length
    : 0;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
            Welcome back,{studentData?.username || user?.name}
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
              Pending Assignments
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {pendingAssignments.length}
            </div>
            <p className='text-xs text-muted-foreground'>
              Due this week:{" "}
              {
                pendingAssignments.filter(
                  (a) =>
                    new Date(a.dueDate) <=
                    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                ).length
              }
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
            <p className='text-xs text-muted-foreground'>Across all courses</p>
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
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>Your coding platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-6 justify-items-center'>
              {/* GitHub */}
              <div className='flex flex-col items-center gap-2'>
                <div className='relative w-24 h-24'>
                  <svg className='transform -rotate-90' viewBox='0 0 36 36'>
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
                  <svg className='transform -rotate-90' viewBox='0 0 36 36'>
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
                        (externalStats?.leetcode_solved || 0) / 2,
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
                      {externalStats?.leetcode_solved || 0}
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
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Your pending assignments sorted by due date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {pendingAssignments.length === 0 ? (
                <p className='text-center text-muted-foreground'>
                  No pending assignments
                </p>
              ) : (
                pendingAssignments
                  .sort(
                    (a, b) =>
                      new Date(a.dueDate).getTime() -
                      new Date(b.dueDate).getTime()
                  )
                  .slice(0, 5)
                  .map((assignment) => (
                    <div
                      key={assignment.id}
                      className='flex items-center gap-4'
                    >
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                        <Calendar className='h-5 w-5 text-primary' />
                      </div>
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                          {assignment.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {assignment.courseName}
                        </p>
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className='bg-card'>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>
              Your most recent grades across all courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {grades.length === 0 ? (
                <p className='text-center text-muted-foreground'>
                  No grades available
                </p>
              ) : (
                grades
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((grade) => (
                    <div key={grade.id} className='flex items-center gap-4'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                        <GraduationCap className='h-5 w-5 text-primary' />
                      </div>
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                          {grade.assignment}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {grade.courseName}
                        </p>
                      </div>
                      <div className='text-sm font-medium'>
                        {grade.score}/{grade.maxScore}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'></div>
      </div>
    </div>
  );
}