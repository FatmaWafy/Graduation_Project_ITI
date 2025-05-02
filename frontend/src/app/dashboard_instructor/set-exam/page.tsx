// "use client";

"use client";

import { useState, useEffect, useMemo, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Clock, BookOpen, FileText, Download } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// import { sendNotification } from "../../../lib/actions/notification-actions"; // Adjust the path as needed
const origin = process.env.NEXT_PUBLIC_API_URL;

export async function sendNotification(params: any): Promise<any> {
  try {
    console.log(origin)
    const response = await fetch(`${origin}/notifications/send-note/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to send notification: ${response.status} ${response.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ""
        }`
      );
    }

    // التحقق من حالة الاستجابة فقط
    const data = await response.json();

    // طباعة الاستجابة في الـ console
    console.log("Notification sent:", data);

    // إذا كانت الحالة 200، نعرض رسالة النجاح
    if (response.status === 200) {
      alert("Notification sent successfully!");
    }

    // إعادة التحقق من الصفحة (إذا كان لديك حاجة لذلك)
    // revalidatePath("/dashboard_student/notifications");

    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}
export async function getUserIdFromToken(): Promise<number | null> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  console.log("Token from cookie:", token);

  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_id || decoded.id;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}
interface Track {
  id: number;
  name: string;
}

interface User {
  username: string;
  email: string;
  role: string;
}

interface Student {
  id: number;
  user: User;
  track: {
    id: number;
    name: string;
  } | null;
  branch: {
    id: number;
    name: string;
  } | null;
}

interface InstructorData {
  id: number;
  username: string;
  email: string;
  role: string;
  profile_image: string;
  phone_number: string;
  address: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    profile_image: string;
    phone_number: string;
    address: string;
  };
  experience_years: number | null;
}

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

interface CodingQuestion {
  id: number;
  question: string;
  template_code: string;
}

interface Exam {
  id: number;
  title: string;
  duration: number;
  MCQQuestions: MCQQuestion[];
  CodingQuestions: CodingQuestion[];
  created_at: string;
  preparationProgress?: number;
}

interface TemporaryExamData {
  exam: number;
  track?: number;
  branch?: number;
  students: number[];
  start_datetime: string;
  end_datetime: string;
  duration?: number;
}

interface Branch {
  id: number;
  name: string;
}

export default function SetExamPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [instructorTracks, setInstructorTracks] = useState<Track[]>([]);
  const [instructorBranches, setInstructorBranches] = useState<Branch[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [examSearch, setExamSearch] = useState("");
  const [showAllExams, setShowAllExams] = useState(false);
  const [user, setUser] = useState<{ instructor_id?: number } | null>(null);

  const [formData, setFormData] = useState<TemporaryExamData>({
    exam: 0,
    track: undefined,
    branch: undefined,
    students: [],
    start_datetime: "",
    end_datetime: "",
  });
  const [loading, setLoading] = useState({
    exams: true,
    tracks: true,
    branches: true,
    students: true,
    submitting: false,
  });

  // Get current datetime in correct format for input
  const getCurrentDatetimeLocal = () => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - timezoneOffset).toISOString();
    return localISOTime.slice(0, 16);
  };

  // Fetch instructor user data
  const fetchUserData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Token not found");

      const decoded: any = jwtDecode(token);
      const userId = decoded.user_id;

      const response = await fetch(
        `${origin}/users/instructors/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch instructor data");

      const data: InstructorData = await response.json();

      // Set the instructor_id to the top-level id from the response
      setUser({
        instructor_id: data.id,
      });

      console.log("Instructor ID set:", data.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

  // Fetch instructor's tracks and branches
  const fetchInstructorData = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${origin}/users/instructors/instructor_data/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch instructor data");
      }
      const data = await response.json();
      console.log("Instructor Data:", data);
      setInstructorTracks(data?.tracks || []);
      setInstructorBranches(data?.branches || []);
    } catch (error) {
      toast.error("Failed to fetch instructor data");
    } finally {
      setLoading((prev) => ({ ...prev, tracks: false, branches: false }));
    }
  };

  // Filter exams based on search term
  const filteredExams = useMemo(() => {
    return exams.filter((exam) =>
      exam.title.toLowerCase().includes(examSearch.toLowerCase())
    );
  }, [exams, examSearch]);

  // Calculate total questions for an exam
  const getTotalQuestions = (exam: Exam) => {
    return (
      (exam.MCQQuestions?.length || 0) + (exam.CodingQuestions?.length || 0)
    );
  };

  const fetchExams = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${origin}/exam/exams/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const examsWithProgress = data.map((exam: Exam) => ({
        ...exam,
        preparationProgress: Math.floor(Math.random() * 100),
      }));
      setExams(examsWithProgress);
    } catch (error) {
      toast.error("Failed to fetch exams");
    } finally {
      setLoading((prev) => ({ ...prev, exams: false }));
    }
  };

  const fetchStudents = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `${origin}/users/instructors/instructor_students/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setAllStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  };

  useEffect(() => {
    fetchExams();
    fetchInstructorData();
    fetchStudents();
    fetchUserData();
  }, []);

  // Filter students based on email, track, and branch
  useEffect(() => {
    let result = allStudents.filter(
      (student) => student.user.role === "student"
    );

    // Apply email filter
    if (emailFilter) {
      result = result.filter((student) =>
        student.user.email.toLowerCase().includes(emailFilter.toLowerCase())
      );
    }

    // Apply track filter if selected
    // Apply track filter if selected
    if (formData.track) {
      result = result.filter((student) => student.track?.id === formData.track);
    }

    // Apply branch filter if selected
    if (formData.branch) {
      result = result.filter(
        (student) => student.branch?.id === formData.branch
      );
    }

    setFilteredStudents(result);
  }, [emailFilter, formData.track, formData.branch, allStudents]);

  const handleExamSelect = (exam: Exam) => {
    setSelectedExam(exam);
    setFormData({
      ...formData,
      exam: exam.id,
      duration: exam.duration,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start_datetime" && value && formData.duration) {
      // Parse the datetime string directly without timezone conversion
      const [datePart, timePart] = value.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);

      // Create a Date object in local time
      const startDate = new Date(year, month - 1, day, hours, minutes);
      const endDate = new Date(startDate.getTime() + formData.duration * 60000);

      // Format the end datetime in the correct format for the input
      const endDatetime = `${endDate.getFullYear()}-${String(
        endDate.getMonth() + 1
      ).padStart(2, "0")}-${String(endDate.getDate()).padStart(
        2,
        "0"
      )}T${String(endDate.getHours()).padStart(2, "0")}:${String(
        endDate.getMinutes()
      ).padStart(2, "0")}`;

      setFormData({
        ...formData,
        [name]: value,
        end_datetime: endDatetime,
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "track" || name === "branch"
            ? parseInt(value) || undefined
            : value,
      });
    }
  };

  const handleEmailFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(e.target.value);
  };

  const handleExamSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExamSearch(e.target.value);
  };

  const handleStudentSelect = (studentId: number) => {
    setFormData((prev) => ({
      ...prev,
      students: prev.students.includes(studentId)
        ? prev.students.filter((id) => id !== studentId)
        : [...prev.students, studentId],
    }));
  };

  const handleSelectAllFiltered = () => {
    const allFilteredStudentIds = filteredStudents.map((student) => student.id);
    const uniqueIds = Array.from(
      new Set([...formData.students, ...allFilteredStudentIds])
    );

    setFormData((prev) => ({
      ...prev,
      students: uniqueIds,
    }));
  };

  const handleDeselectAll = () => {
    setFormData((prev) => ({
      ...prev,
      students: [],
    }));
  };

  const allFilteredSelected = () => {
    if (filteredStudents.length === 0) return false;
    return filteredStudents.every((student) =>
      formData.students.includes(student.id)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.start_datetime) {
      toast.error("Please select start time");
      return;
    }

    const selectedDateTime = new Date(formData.start_datetime);
    const now = new Date();
    if (selectedDateTime < now) {
      toast.error("Cannot schedule exam in the past");
      return;
    }

    if (formData.students.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setLoading((prev) => ({ ...prev, submitting: true }));

    try {
      const token = Cookies.get("token");

      // Get instructor ID from token
      async function fetchInstructorId(): Promise<number> {
        const userId = await getUserIdFromToken();
        console.log("User ID from token:", userId);

        if (!userId) throw new Error("User ID not found in token.");

        const res = await fetch(
          `${origin}/users/instructors/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch instructor ID");

        const data = await res.json();
        console.log("Data from instructor API:", data);

        return data.id;
      }

      const instructorId = await fetchInstructorId();

      const submitData = {
        ...formData,
        track: formData.track || undefined,
        branch: formData.branch || undefined,

        instructor_id: user?.instructor_id, // This will be the instructor ID (5), not the user ID (14)
      };

      console.log("Submitting exam data with instructor ID:", submitData);

      const response = await fetch(`${origin}/exam/temp-exams/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create temporary exam"
        );
      }

      toast.success("Exam scheduled successfully!");

      const examName = responseData.name || `Exam ${responseData.exam}`; // If name is not available, fallback to exam ID or track name
      const examStartDate = new Date(
        responseData.start_datetime
      ).toLocaleString(); // Formatting the start date
      const message = `A new exam "${examName}" has been scheduled for you at ${examStartDate}.`;

      // Loop over students to send notification
      for (const studentId of formData.students) {
        try {
          await sendNotification({
            student_id: studentId,
            instructor_id: instructorId,
            message: message,
          });
        } catch (error) {
          console.error(
            `Failed to send notification to student ${studentId}`,
            error
          );
        }
      }

      router.push("/dashboard_instructor");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to schedule exam");
      } else {
        toast.error("Failed to schedule exam");
      }
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleExportPDF = async (
    examId: number,
    examTitle: string,
    e: MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // Prevent the click from bubbling up to the card and selecting the exam
    e.stopPropagation();

    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Token not found");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/exam/export-bubble-sheet/${examId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to export Exam");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const exportExamTitle = examTitle || "exam";
      link.download = `${exportExamTitle}_id(${examId}).pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Exam exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(
        `Error exporting Exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
  if (loading.exams || loading.tracks || loading.branches || loading.students) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const displayedExams = showAllExams
    ? filteredExams
    : filteredExams.slice(0, 6);

  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Set Exam</h1>
          <p className="text-muted-foreground">
            Select and schedule exams for students
          </p>
        </div>

        {/* Exam Selection Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Select Exam</h2>
            <input
              type="text"
              placeholder="Search exams..."
              className="p-2 border rounded w-64"
              value={examSearch}
              onChange={handleExamSearchChange}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedExams.length > 0 ? (
              displayedExams.map((exam) => (
                <Card
                  key={exam.id}
                  className={`overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md ${
                    selectedExam?.id === exam.id ? "ring-2 ring-[#007acc]" : ""
                  }`}
                  onClick={() => handleExamSelect(exam)}
                >
                  <CardHeader>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>
                      Created: {new Date(exam.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-grow">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {getTotalQuestions(exam)} questions
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>MCQ Questions</span>
                        <span>{exam.MCQQuestions?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Coding Questions</span>
                        <span>{exam.CodingQuestions?.length || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={
                        selectedExam?.id === exam.id ? "default" : "secondary"
                      }
                      className="w-full bg-[#007acc] hover:bg-[#007acc]"
                    >
                      {selectedExam?.id === exam.id
                        ? "Selected"
                        : "Select Exam"}
                    </Button>
                    <Button
                      onClick={(e) => handleExportPDF(exam.id, exam.title, e)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Exam (PDF)
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full text-center py-8">
                No exams found matching your search
              </p>
            )}
          </div>

          {filteredExams.length > 6 && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => setShowAllExams(!showAllExams)}
                className="text-primary"
              >
                {showAllExams
                  ? "Show Less"
                  : `Show All (${filteredExams.length})`}
              </Button>
            </div>
          )}
        </div>

        {selectedExam && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Exam Configuration</h2>

            {/* Exam Information */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Exam
                </label>
                <div className="p-3 bg-gray-50 rounded border">
                  <p className="font-medium">{selectedExam.title}</p>
                  <p className="text-sm text-gray-600">
                    {selectedExam.duration} minutes •{" "}
                    {getTotalQuestions(selectedExam)} questions
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Track (Optional)
                </label>
                <select
                  name="track"
                  className="w-full p-2 border rounded"
                  onChange={handleInputChange}
                  value={formData.track ?? ""}
                >
                  <option value="">All Tracks</option>
                  {instructorTracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch (Optional)
                </label>
                <select
                  name="branch"
                  className="w-full p-2 border rounded"
                  onChange={handleInputChange}
                  value={formData.branch ?? ""}
                >
                  <option value="">All Branches</option>
                  {instructorBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start_datetime"
                    className="w-full p-2 border rounded"
                    onChange={handleInputChange}
                    value={formData.start_datetime}
                    min={getCurrentDatetimeLocal()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time (Auto-calculated)
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded bg-gray-100"
                    value={formData.end_datetime}
                    readOnly
                  />
                </div>
              </div>
              {formData.end_datetime && (
                <div className="mt-2 text-sm text-gray-600">
                  Exam will automatically end after {selectedExam.duration}{" "}
                  minutes
                </div>
              )}
            </div>

            {/* Student Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Students
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Filter by email"
                    className="p-2 border rounded text-sm"
                    value={emailFilter}
                    onChange={handleEmailFilterChange}
                  />
                  {filteredStudents.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={handleSelectAllFiltered}
                        className={`px-3 py-2 text-sm rounded ${
                          allFilteredSelected()
                            ? "bg-gray-200 text-white"
                            : "bg-[#007acc] text-white hover:bg-[#007abc]"
                        }`}
                        disabled={allFilteredSelected()}
                      >
                        {allFilteredSelected() ? "All Selected" : "Select All"}
                      </button>

                      <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto border rounded">
                {filteredStudents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No students found matching your criteria
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className={`p-3 border-b flex items-center ${
                        formData.students.includes(student.id)
                          ? "bg-green-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`student-${student.id}`}
                        checked={formData.students.includes(student.id)}
                        onChange={() => handleStudentSelect(student.id)}
                        className="mr-3"
                      />
                      <label
                        htmlFor={`student-${student.id}`}
                        className="flex-1"
                      >
                        <div className="font-medium">
                          {student.user.username}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.user.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Track: {student.track?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Branch: {student.branch?.name || "Unknown"}
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading.submitting}
              className="px-4 py-2 bg-[#007acc] text-white rounded hover:bg-blue-700 disabled:bg-[#007acc]"
            >
              {loading.submitting ? "Scheduling..." : "Schedule Exam"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
