"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

interface Exam {
  id: number;
  title: string;
  duration: number;
  MCQQuestions: any[];
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

  const fetchExams = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://127.0.0.1:8000/exam/exams/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExams(data);
    } catch (error) {
      toast.error("Failed to fetch exams");
    } finally {
      setLoading((prev) => ({ ...prev, exams: false }));
    }
  };

  const fetchTracks = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch("http://127.0.0.1:8000/users/get-tracks/", {
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
      const response = await fetch("http://127.0.0.1:8000/users/students/", {
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
    setFormData({
      ...formData,
      [name]: name === "track" ? parseInt(value) || undefined : value,
    });
  };

  const handleEmailFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(e.target.value);
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
    if (!formData.start_datetime || !formData.end_datetime) {
      toast.error("Please select start and end times");
      return;
    }

    if (new Date(formData.start_datetime) >= new Date(formData.end_datetime)) {
      toast.error("End time must be after start time");
      return;
    }

    if (formData.students.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setLoading((prev) => ({ ...prev, submitting: true }));

    try {
      const token = Cookies.get("token");
      const response = await fetch("http://127.0.0.1:8000/exam/temp-exams/", {
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
      toast.error(error.message || "Failed to schedule exam");
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  if (loading.exams || loading.tracks || loading.students) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Set Exam</h1>

      {/* Exam Selection Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Exam</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedExam?.id === exam.id
                  ? "border-[#800000] bg-[#f2d0d0]"
                  : "hover:bg-[#f5e6e6]"
                }`}
              onClick={() => handleExamSelect(exam)}
            >
              <h3 className="font-medium">{exam.title}</h3>
              <p className="text-sm text-gray-600">
                Duration: {exam.duration} minutes
              </p>
              <p className="text-sm text-gray-600">
                Questions: {exam.MCQQuestions?.length || 0}
              </p>
            </div>
          ))}
        </div>
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
              <div className="p-3 bg-gray-50 rounded border border-[#800000]">
                <p className="font-medium">{selectedExam.title}</p>
                <p className="text-sm text-gray-600">
                  {selectedExam.duration} minutes •{" "}
                  {selectedExam.MCQQuestions?.length || 0} questions
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
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="start_datetime"
                className="w-full p-2 border rounded"
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="end_datetime"
                className="w-full p-2 border rounded"
                onChange={handleInputChange}
                required
              />
            </div>
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
                      className={`px-3 py-2 text-sm rounded ${allFilteredSelected()
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
                    className={`p-3 border-b flex items-center ${formData.students.includes(student.id)
                        ? "bg-[#f2d0d0]"
                        : "hover:bg-[#f5e6e6]"
                      }`}
                  >
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={formData.students.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className="mr-3"
                    />
                    <label htmlFor={`student-${student.id}`} className="flex-1">
                      <div className="font-medium">{student.user.username}</div>
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
            className="px-4 py-2 bg-[#800000] text-white rounded hover:bg-[#a52a2a] disabled:bg-green-300"
          >
            {loading.submitting ? "Scheduling..." : "Schedule Exam"}
          </button>
        </form>
      )}
    </div>
  );
}
