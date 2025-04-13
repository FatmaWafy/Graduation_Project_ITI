// Types

import { addHours } from "date-fns"
const origin = process.env.NEXT_PUBLIC_API_ORIGIN;

export const api = {
  resetPasswordRequest: `${origin}/users/reset-password/`,
  forgotPassword: `${origin}/users/reset-password-request/`,
  login: `${origin}/users/login/`,
  register: `${origin}/users/register/`,
  mcq_filter: `${origin}/exam/mcq-filter/`,
  coding_filter: `${origin}/exam/coding-filter/`,
  mcq_questions: `${origin}/exam/mcq-questions/`,
  code_questions: `${origin}/exam/code-questions/`,
  test_cases: `${origin}/exam/test-cases/`,
  exams: `${origin}/exam/exams/`,
  get_tracks: `${origin}/users/get-tracks/`,
  register_students_excel: `${origin}/users/register-students-excel/`,
  register_student: `${origin}/users/register-student/`,
  students: `${origin}/users/students/`,
  temp_exams: `${origin}/exam/temp-exams/`,
  submit_answer: `${origin}/exam/exam-answers/submit-answer/`,
  getStudentAnswersUrl: (examInstanceId: number, studentName: string) =>
    `${origin}/exam/student-exam-answers/get_answers/?exam_instance_id=${examInstanceId}&student_name=${encodeURIComponent(studentName)}`,

  get_all_student_scores: `${origin}/exam/student-exam-answers/get_all_student_scores/`,
  getStudentExternalStatsUrl: (studentId: number | string) =>
    `${origin}/users/students/external-stats/by-student-id/${studentId}/`,

  getStudentByIdUrl: (studentId: number | string) =>
    `${origin}/users/students/by-id/${studentId}/`,

  labs: `${origin}/labs/`,
  getLabByIdUrl: (labId: string | number) =>
    `${origin}/labs/${labId}/`,

  getInstructorByIdUrl: (userId: string | number) =>
    `${origin}/users/instructors/${userId}/`,

  downloadLabByIdUrl: (labId: string | number) =>
    `${origin}/labs/${labId}/download/`,

  getProfileImageUrl: (profileImagePath: string) =>
    profileImagePath.startsWith("http")
      ? `${profileImagePath}?t=${new Date().getTime()}`
      : `${origin}${profileImagePath}?t=${new Date().getTime()}`,

  change_password: `${origin}/users/change-password/`,

  updateStudentByIdUrl: (userId: string | number) =>
    `${origin}/users/students/${userId}/update/`,

  uploadProfileImageUrl: (studentId: string | number) =>
    `${origin}/users/upload-profile-image/${studentId}/`,

  getProfileImageUrlpath: (profileImagePath: string) =>
    `${origin}${profileImagePath}`,

  getStudentExternalStatsUrll: (userId: string | number) =>
    `${origin}/users/students/${userId}/external-stats/`,

  get_user_exams_scores: `${origin}/exam/student-exam-answers/get_user_exams_scores/`,
  getStudentByIdUrlW: (userId: string | number) =>
    `${origin}/users/students/${userId}/`,

  logs: `${origin}/exam/exams/logs/`,

  getTempExamUrl: (id: string | number) =>
    `${origin}/exam/temp-exams/${id}/`,

  getTempExamQuestionsUrl: (id: string | number) =>
    `${origin}/exam/exam/temp-exams/${id}/questions/`,

  getExamByIdUrl: (examId: string | number) =>
    `${origin}/exam/exams/${examId}`,

  notes : `${origin}/notifications/notes/`,

  markNotificationAsReadUrl: (id: string | number) =>
    `${origin}/notifications/notes/${id}/`,

  mark_all_read : `${origin}/notifications/mark-all-read/`,

  send_note: `${origin}/notifications/send-note/`,
  token: `${origin}/api/token/`,








};



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

export type Course = {
  id: string
  title: string
  description: string
  progress: number
}
////////////////////////////////////////////////////////////////////////////////////////////
// Add the getCourses function
export async function getCourses(): Promise<Course[]> {
  // Replace with actual API call in a real application
  return Promise.resolve([
    { id: "1", title: "Math 101", description: "Introduction to Mathematics", progress: 60 },
    { id: "2", title: "History 101", description: "World History", progress: 80 },
    { id: "3", title: "English 101", description: "English Literature", progress: 75 },
    { id: "4", title: "Computer Science 101", description: "Introduction to Programming", progress: 85 },
  ])
}
////////////////////////////////////////////////////////////////////////////////////////////
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


export type Exam = {
  CodingQuestions: any
  MCQQuestions: any
  codingCount: any
  mcqCount: any
  id: string;
  title: string;
  courseName: string;
  date: string; // ISO date string
  duration: number; // in minutes
  questionsCount: number;
  preparationProgress: number; // 0-100
  // Add any other exam-specific fields you need
}
export async function getExams(token: string, userId: string): Promise<Exam[]> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/exam/temp-exams-by-student/${userId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const now = new Date();

    return data.temp_exams
      // Remove this filter if you want ALL exams shown regardless of time or status
      // .filter((exam: any) => exam.status !== 'submitted') // Optional: hide submitted
      .map((exam: any) => {
        const start = new Date(exam.start_datetime);
        const end = new Date(exam.end_datetime);
        const isSubmitted = exam.status === "submitted"; // you can customize this condition
        const isOpen = !isSubmitted;
        const newDate = addHours(new Date(exam.start_datetime), 2);
        return {
          id: parseInt(exam.id.toString(), 10),
          title: exam.exam_title,
          courseName: exam.track ? `Track ${exam.track}` : 'General Exam',
          date: exam.start_datetime,
          console: exam.start_datetime,
          duration: calculateDurationInMinutes(exam.start_datetime, exam.end_datetime),
          questionsCount: exam.total_questions,
          preparationProgress: Math.min(Math.max(exam.preparation_progress || 0, 0), 100),
          examId: exam.exam || exam.id,
          startDatetime: exam.start_datetime,
          endDatetime: exam.end_datetime,
          track: exam.track,
          isOpen,
        };
      });
  } catch (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }
}


// Helper function to calculate duration in minutes
function calculateDurationInMinutes(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
}
