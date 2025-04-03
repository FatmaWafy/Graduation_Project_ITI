// Types
export type Course = {
  id: string
  title: string
  instructor: string
  progress: number
  credits: number
  department: string
  schedule: string
  image: string
}

export type Assignment = {
  id: string
  title: string
  courseId: string
  courseName: string
  dueDate: string
  status: "completed" | "pending" | "overdue"
  description: string
}

export type Grade = {
  id: string
  courseId: string
  courseName: string
  assignment: string
  score: number
  maxScore: number
  date: string
}

export type GradeDistribution = {
  grade: string
  count: number
}

export type PerformanceData = {
  subject: string
  score: number
  average: number
}

// Mock data functions
export async function getCourses(): Promise<Course[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "course-1",
      title: "Introduction to Computer Science",
      instructor: "Dr. Sarah Miller",
      progress: 75,
      credits: 4,
      department: "Computer Science",
      schedule: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "course-2",
      title: "Calculus II",
      instructor: "Prof. James Wilson",
      progress: 60,
      credits: 3,
      department: "Mathematics",
      schedule: "Tue, Thu 1:00 PM - 2:30 PM",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "course-3",
      title: "Introduction to Psychology",
      instructor: "Dr. Emily Chen",
      progress: 90,
      credits: 3,
      department: "Psychology",
      schedule: "Mon, Wed 3:00 PM - 4:30 PM",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "course-4",
      title: "World History: Modern Era",
      instructor: "Prof. Michael Brown",
      progress: 45,
      credits: 3,
      department: "History",
      schedule: "Tue, Thu 9:00 AM - 10:30 AM",
      image: "/placeholder.svg?height=100&width=200",
    },
  ]
}

export async function getAssignments(): Promise<Assignment[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "assignment-1",
      title: "Algorithm Implementation",
      courseId: "course-1",
      courseName: "Introduction to Computer Science",
      dueDate: "2025-04-05",
      status: "pending",
      description: "Implement a sorting algorithm of your choice and analyze its time complexity.",
    },
    {
      id: "assignment-2",
      title: "Integration Problems",
      courseId: "course-2",
      courseName: "Calculus II",
      dueDate: "2025-04-03",
      status: "pending",
      description: "Complete problems 1-10 in Chapter 7 on integration techniques.",
    },
    {
      id: "assignment-3",
      title: "Research Methods Analysis",
      courseId: "course-3",
      courseName: "Introduction to Psychology",
      dueDate: "2025-03-28",
      status: "overdue",
      description: "Analyze the research methods used in the provided psychology study.",
    },
    {
      id: "assignment-4",
      title: "Historical Essay",
      courseId: "course-4",
      courseName: "World History: Modern Era",
      dueDate: "2025-04-10",
      status: "pending",
      description: "Write a 1500-word essay on the impact of the Industrial Revolution.",
    },
    {
      id: "assignment-5",
      title: "Programming Project",
      courseId: "course-1",
      courseName: "Introduction to Computer Science",
      dueDate: "2025-03-25",
      status: "completed",
      description: "Build a simple web application using HTML, CSS, and JavaScript.",
    },
  ]
}

export async function getGrades(): Promise<Grade[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "grade-1",
      courseId: "course-1",
      courseName: "Introduction to Computer Science",
      assignment: "Programming Basics Quiz",
      score: 92,
      maxScore: 100,
      date: "2025-03-10",
    },
    {
      id: "grade-2",
      courseId: "course-1",
      courseName: "Introduction to Computer Science",
      assignment: "Data Structures Assignment",
      score: 85,
      maxScore: 100,
      date: "2025-03-17",
    },
    {
      id: "grade-3",
      courseId: "course-2",
      courseName: "Calculus II",
      assignment: "Derivatives Exam",
      score: 78,
      maxScore: 100,
      date: "2025-03-05",
    },
    {
      id: "grade-4",
      courseId: "course-3",
      courseName: "Introduction to Psychology",
      assignment: "Cognitive Psychology Paper",
      score: 95,
      maxScore: 100,
      date: "2025-03-12",
    },
    {
      id: "grade-5",
      courseId: "course-4",
      courseName: "World History: Modern Era",
      assignment: "Renaissance Quiz",
      score: 88,
      maxScore: 100,
      date: "2025-03-08",
    },
    {
      id: "grade-6",
      courseId: "course-2",
      courseName: "Calculus II",
      assignment: "Integration Homework",
      score: 82,
      maxScore: 100,
      date: "2025-03-20",
    },
  ]
}

export async function getGradeDistribution(): Promise<GradeDistribution[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    { grade: "A", count: 8 },
    { grade: "B", count: 12 },
    { grade: "C", count: 5 },
    { grade: "D", count: 2 },
    { grade: "F", count: 1 },
  ]
}

export async function getPerformanceData(): Promise<PerformanceData[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    { subject: "Computer Science", score: 88, average: 75 },
    { subject: "Mathematics", score: 80, average: 72 },
    { subject: "Psychology", score: 95, average: 78 },
    { subject: "History", score: 88, average: 76 },
    { subject: "English", score: 85, average: 74 },
  ]
}

