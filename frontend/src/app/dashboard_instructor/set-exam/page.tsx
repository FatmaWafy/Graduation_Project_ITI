"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Clock, BookOpen, FileText } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
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
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";


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
  track: number | null;
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
  students: number[];
  start_datetime: string;
  end_datetime: string;
  duration?: number;
}

export default function SetExamPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [examSearch, setExamSearch] = useState("");
  const [showAllExams, setShowAllExams] = useState(false);

  const [formData, setFormData] = useState<TemporaryExamData>({
    exam: 0,
    track: undefined,
    students: [],
    start_datetime: "",
    end_datetime: "",
  });
  const [loading, setLoading] = useState({
    exams: true,
    tracks: true,
    students: true,
    submitting: false,
  });

  // Get current datetime in correct format for input
  const getCurrentDatetimeLocal = () => {
    const now = new Date();
    // Adjust for timezone offset to get local time
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - timezoneOffset).toISOString();
    return localISOTime.slice(0, 16); // Remove seconds and milliseconds
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
      const response = await fetch(api.exams, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // Add preparation progress (random for demo, replace with actual data if available)
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

  const fetchTracks = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(api.get_tracks, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTracks(data);
    } catch (error) {
      toast.error("Failed to fetch tracks");
    } finally {
      setLoading((prev) => ({ ...prev, tracks: false }));
    }
  };

  const fetchStudents = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(api.students, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    fetchTracks();
    fetchStudents();
  }, []);

  // Filter students based on email and track
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
    if (formData.track) {
      result = result.filter((student) => student.track === formData.track);
    }

    setFilteredStudents(result);
  }, [emailFilter, formData.track, allStudents]);

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
        [name]: name === "track" ? parseInt(value) || undefined : value,
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

    // Check if selected datetime is in the past
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
      const response = await fetch(api.temp_exams, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          track: formData.track || undefined,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create temporary exam"
        );
      }

      toast.success("Exam scheduled successfully!");
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

  if (loading.exams || loading.tracks || loading.students) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#007acc]"></div>
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
                    selectedExam?.id === exam.id ? "ring-2 ring-green-500" : ""
                  }`}
                  onClick={() => handleExamSelect(exam)}
                >
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
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
                      className="w-full"
                    >
                      {selectedExam?.id === exam.id
                        ? "Selected"
                        : "Select Exam"}
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
                className="text-[#007acc]"
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
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
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
                            ? "bg-gray-200 text-gray-700"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
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
                        {student.track && (
                          <div className="text-xs text-gray-500 mt-1">
                            Track:{" "}
                            {tracks.find((t) => t.id === student.track)?.name ||
                              "Unknown"}
                          </div>
                        )}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading.submitting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300"
            >
              {loading.submitting ? "Scheduling..." : "Schedule Exam"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}