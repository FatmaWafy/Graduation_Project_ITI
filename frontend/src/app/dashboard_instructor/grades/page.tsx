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

interface Grade {
  student_id: number;
  student_username: string;
  exam_id: number;
  exam_title: string;
  score: number;
  submitted_at: string;
  branch?: string; // Added for branch from API
  track?: string; // Added for track from API
}

interface StudentGrade {
  id: string;
  name: string;
  examTitle: string;
  examDate: string;
  score: number;
  examId: string;
  branch?: string;
  track?: string;
}

export default function GradesPage() {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [trackFilter, setTrackFilter] = useState("");
  const [exams, setExams] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);
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

        // Fetch grades data
        const response = await fetch(
          "http://127.0.0.1:8000/exam/student-exam-answers/get_all_student_scores/",
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

        const data: { grades: Grade[] } = await response.json();
        console.log("Fetched grades data:", data);

        const transformedData: StudentGrade[] = data.grades.map((grade) => ({
          id: `${grade.exam_id}-${grade.student_id}`,
          name: grade.student_username,
          examTitle: grade.exam_title,
          examDate: grade.submitted_at,
          score: grade.score,
          examId: grade.exam_id.toString(),
          branch: grade.branch || undefined,
          track: grade.track || undefined,
        }));

        // Get unique values for filters
        const uniqueExams = Array.from(
          new Set(data.grades.map((grade) => grade.exam_title))
        );
        const uniqueBranches = Array.from(
          new Set(
            data.grades
              .map((grade) => grade.branch)
              .filter((branch): branch is string => !!branch)
          )
        );
        const uniqueTracks = Array.from(
          new Set(
            data.grades
              .map((grade) => grade.track)
              .filter((track): track is string => !!track)
          )
        );

        setGrades(transformedData);
        setFilteredGrades(transformedData);
        setExams(uniqueExams);
        setBranches(uniqueBranches);
        setTracks(uniqueTracks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load data"
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

      if (examFilter && examFilter !== "all") {
        result = result.filter((grade) =>
          grade.examTitle.toLowerCase().includes(examFilter.toLowerCase())
        );
      }

      if (dateFilter) {
        result = result.filter((grade) =>
          grade.examDate.split("T")[0].includes(dateFilter)
        );
      }

      if (branchFilter && branchFilter !== "all") {
        result = result.filter((grade) => grade.branch === branchFilter);
      }

      if (trackFilter && trackFilter !== "all") {
        result = result.filter((grade) => grade.track === trackFilter);
      }

      setFilteredGrades(result);
    };

    applyFilters();
  }, [nameFilter, examFilter, dateFilter, branchFilter, trackFilter, grades]);

  const resetFilters = () => {
    setNameFilter("");
    setExamFilter("");
    setDateFilter("");
    setBranchFilter("");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <label htmlFor="branch-filter" className="text-sm font-medium">
              Branch
            </label>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                <TableHead>Branch</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Actions</TableHead>
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
                    <TableCell>{grade.branch || "-"}</TableCell>
                    <TableCell>{grade.track || "-"}</TableCell>
                    <TableCell className="font-medium">{grade.score}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard_instructor/grades/${
                          grade.examId
                        }?student=${encodeURIComponent(grade.name)}`}
                        className="text-primary hover:underline"
                      >
                        Show Answers
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
