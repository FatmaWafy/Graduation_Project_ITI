"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import { getClientSideToken } from "@/lib/cookies";
import { api } from "@/lib/api";

interface StudentGrade {
  id: string;
  name: string;
  examTitle: string;
  examDate: string;
  score: number;
  totalPoints: number;
  track?: string;
  examInstanceId: string;
}

interface ApiResponse {
  exam_instance_id: number;
  exam_title: string;
  start_datetime: string;
  total_points: number;
  students_scores: {
    total_points: number;
    student: string;
    track?: string;
    score: number;
    mcq_answers: Record<string, any>;
    coding_answers: Record<string, any>;
  }[];
}

export default function GradesPage() {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [trackFilter, setTrackFilter] = useState("");
  const [tracks, setTracks] = useState<string[]>([]);
  const [exams, setExams] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getClientSideToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          api.get_all_student_scores,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          router.push("/");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse[] = await response.json();
        const transformedData: StudentGrade[] = [];
        const uniqueTracks = new Set<string>();
        const uniqueExams = new Set<string>();

        data.forEach((examInstance) => {
          examInstance.students_scores.forEach((studentScore) => {
            transformedData.push({
              id: `${examInstance.exam_instance_id}-${studentScore.student}`,
              name: studentScore.student,
              examTitle: examInstance.exam_title,
              examDate: examInstance.start_datetime,
              score: studentScore.score,
              totalPoints: studentScore.total_points,
              track: studentScore.track,
              examInstanceId: examInstance.exam_instance_id.toString(),
            });

            if (studentScore.track) {
              uniqueTracks.add(studentScore.track);
            }
            uniqueExams.add(examInstance.exam_title);
          });
        });

        setGrades(transformedData);
        setFilteredGrades(transformedData);
        setTracks(Array.from(uniqueTracks));
        setExams(Array.from(uniqueExams));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student grades:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load student grades"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const applyFilters = () => {
      let result = grades;

      if (nameFilter) {
        result = result.filter((grade) =>
          grade.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (examFilter) {
        result = result.filter((grade) =>
          grade.examTitle.toLowerCase().includes(examFilter.toLowerCase())
        );
      }

      if (dateFilter) {
        result = result.filter((grade) => grade.examDate.includes(dateFilter));
      }

      if (trackFilter && trackFilter !== "all") {
        result = result.filter((grade) => grade.track === trackFilter);
      }

      setFilteredGrades(result);
    };

    applyFilters();
  }, [nameFilter, examFilter, dateFilter, trackFilter, grades]);

  const resetFilters = () => {
    setNameFilter("");
    setExamFilter("");
    setDateFilter("");
    setTrackFilter("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading student grades...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="name-filter" className="text-sm font-medium">
              Student Name
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name-filter"
                placeholder="Search by name..."
                className="pl-8"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="exam-filter" className="text-sm font-medium">
              Exam Title
            </label>
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Exams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {exams.map((exam) => (
                  <SelectItem key={exam} value={exam}>
                    {exam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="date-filter" className="text-sm font-medium">
              Exam Date
            </label>
            <Input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="track-filter" className="text-sm font-medium">
              Track
            </label>
            <Select value={trackFilter} onValueChange={setTrackFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Tracks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                {tracks.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            Student Grades
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredGrades.length} results)
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Exam Title</TableHead>
                <TableHead>Exam Date</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.name}</TableCell>
                    <TableCell>{grade.examTitle}</TableCell>
                    <TableCell>
                      {new Date(grade.examDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{grade.track || "-"}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard_instructor/student-answers/${
                          grade.examInstanceId
                        }?student=${encodeURIComponent(grade.name)}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {grade.score}/{grade.totalPoints}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No results found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
