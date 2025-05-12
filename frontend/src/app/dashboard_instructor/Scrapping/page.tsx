"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Github,
  Code,
  ExternalLink,
  RefreshCw,
  Filter,
  Calendar,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  format,
  subDays,
  isWithinInterval,
  parseISO,
  differenceInDays,
} from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudents } from "../students/hooks/use-students";
import { getClientSideToken } from "@/lib/cookies";
import type { Student } from "../students/types";
const origin = process.env.NEXT_PUBLIC_API_URL;

interface LeetCodeSubmission {
  title: string;
  status: number;
  timestamp: string;
}

interface ExternalStats {
  github_repos: number | null;
  leetcode_solved: number | null;
  leetcode_recent_submissions?: LeetCodeSubmission[];
}

type TimeFilter =
  | "all"
  | "yesterday"
  | "last3days"
  | "inactive3days"
  | "inactiveYesterday"; // Add new filter

export default function ScrappingPage() {
  const router = useRouter();
  const { students, isLoading, error } = useStudents();
  const [studentStats, setStudentStats] = useState<
    Record<number, ExternalStats>
  >({});
  const [loadingStats, setLoadingStats] = useState<Record<number, boolean>>({});
  const [refreshing, setRefreshing] = useState<Record<number, boolean>>({});
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch external stats for all students
  useEffect(() => {
    if (!students || students.length === 0) return;

    const fetchStats = async () => {
      const token = getClientSideToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      // Initialize loading states
      const initialLoadingState: Record<number, boolean> = {};
      students.forEach((student) => {
        initialLoadingState[student.id] = true;
      });
      setLoadingStats(initialLoadingState);

      // Fetch stats for each student
      const statsPromises = students.map(async (student) => {
        try {
          const response = await fetch(
            `${origin}/users/students/external-stats/by-student-id/${student.id}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch stats for student ${student.id}`);
          }

          const data = await response.json();
          return { studentId: student.id, stats: data };
        } catch (error) {
          console.error(
            `Error fetching stats for student ${student.id}:`,
            error
          );
          return {
            studentId: student.id,
            stats: {
              github_repos: null,
              leetcode_solved: null,
              leetcode_recent_submissions: [],
            },
          };
        } finally {
          setLoadingStats((prev) => ({ ...prev, [student.id]: false }));
        }
      });

      const results = await Promise.all(statsPromises);

      // Convert array of results to record object
      const statsRecord: Record<number, ExternalStats> = {};
      results.forEach((result) => {
        statsRecord[result.studentId] = result.stats;
      });

      setStudentStats(statsRecord);
    };

    fetchStats();
  }, [students]);

  // Filter students based on time filter
  useEffect(() => {
    if (!students || students.length === 0) {
      // console.log("No students available")
      return setFilteredStudents([]);
    }

    // console.log(
    //   "Students:",
    //   students.map((s) => ({ id: s.id, username: s.user.username })),
    // )
    // console.log("StudentStats:", studentStats)

    if (timeFilter === "all") {
      setFilteredStudents(students);
      return;
    }

    const today = new Date();
    const yesterday = subDays(today, 1);
    const threeDaysAgo = subDays(today, 4); // تعديل من 3 إلى 4 لتغطية 14 أبريل

    yesterday.setHours(0, 0, 0, 0);
    threeDaysAgo.setHours(0, 0, 0, 0);

    // console.log("Today:", today.toString());
    // console.log("ThreeDaysAgo:", threeDaysAgo.toString());

    const filtered = students.filter((student) => {
      const stats = studentStats[student.id];
      if (
        !stats ||
        !stats.leetcode_recent_submissions ||
        stats.leetcode_recent_submissions.length === 0
      ) {
        // console.log(`Student ${student.id} has no submissions`);
        return (
          timeFilter === "inactive3days" || timeFilter === "inactiveYesterday"
        );
      }

      const mostRecentSubmission = stats.leetcode_recent_submissions[0];
      const submissionDate = parseISO(mostRecentSubmission.timestamp);

      // console.log(
      //   `Student ${student.id} submissionDate:`,
      //   submissionDate.toString()
      // );

      if (timeFilter === "inactive3days") {
        return differenceInDays(today, submissionDate) > 3;
      } else if (timeFilter === "yesterday") {
        const submissionDay = new Date(submissionDate);
        submissionDay.setHours(0, 0, 0, 0);
        const yesterdayDay = new Date(yesterday);
        yesterdayDay.setHours(0, 0, 0, 0);
        return submissionDay.getTime() === yesterdayDay.getTime();
      } else if (timeFilter === "last3days") {
        const isActive = isWithinInterval(submissionDate, {
          start: threeDaysAgo,
          end: today,
        });
        // console.log(`Student ${student.id} isActive in last3days:`, isActive, {
        //   submissionDate: submissionDate.toString(),
        //   start: threeDaysAgo.toString(),
        //   end: today.toString(),
        // });
        return isActive;
      } else if (timeFilter === "inactiveYesterday") {
        const submissionDay = new Date(submissionDate);
        submissionDay.setHours(0, 0, 0, 0);
        const yesterdayDay = new Date(yesterday);
        yesterdayDay.setHours(0, 0, 0, 0);
        return submissionDay.getTime() !== yesterdayDay.getTime();
      }

      return false;
    });

    // console.log(
    //   "Filtered Students:",
    //   filtered.map((s) => ({ id: s.id, username: s.user.username }))
    // );
    setFilteredStudents(filtered);
  }, [students, studentStats, timeFilter]);

  const handleRefreshStats = async (studentId: number) => {
    setRefreshing((prev) => ({ ...prev, [studentId]: true }));

    try {
      const token = getClientSideToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `${origin}/users/students/external-stats/by-student-id/${studentId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to refresh stats for student ${studentId}`);
      }

      const data = await response.json();
      setStudentStats((prev) => ({ ...prev, [studentId]: data }));
    } catch (error) {
      console.error(`Error refreshing stats for student ${studentId}:`, error);
    } finally {
      setRefreshing((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const handleViewDetails = (studentId: number) => {
    router.push(`/dashboard_instructor/students/${studentId}`);
  };

  const exportToCSV = () => {
    setExportLoading(true);

    try {
      const studentsToExport =
        timeFilter === "all" ? students : filteredStudents;
      let csvContent =
        "ID,Username,Email,GitHub Repos,LeetCode Solved,Last Active Date,GitHub Profile,LeetCode Profile\n";

      studentsToExport.forEach((student) => {
        const stats = studentStats[student.id];
        let lastActiveDate = "Never";
        if (
          stats?.leetcode_recent_submissions &&
          stats.leetcode_recent_submissions.length > 0
        ) {
          lastActiveDate = format(
            parseISO(stats.leetcode_recent_submissions[0].timestamp),
            "yyyy-MM-dd"
          );
        }

        const githubProfile = student.github_profile || "Not provided";
        const leetcodeProfile = student.leetcode_profile || "Not provided";

        const row = [
          student.id,
          student.user.username || "Unknown",
          student.user.email || "No email",
          stats?.github_repos || 0,
          stats?.leetcode_solved || 0,
          lastActiveDate,
          githubProfile,
          leetcodeProfile,
        ]
          .map((value) => `"${value}"`)
          .join(",");

        csvContent += row + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `students_${timeFilter}_${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    } finally {
      setExportLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#007acc]" />
          <p className="text-muted-foreground">
            Loading students information...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold text-destructive">
                Error Loading Students
              </h2>
              <p className="mt-2 text-muted-foreground">{error.message}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-6 bg-[#007acc] hover:bg-[#0062a3]"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#007acc]">
            Web Scraping Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor students' GitHub repositories and LeetCode progress
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#007acc]" />
            <span className="text-sm font-medium">Activity Filter:</span>
          </div>
          <Select
            value={timeFilter}
            onValueChange={(value) => setTimeFilter(value as TimeFilter)}
          >
            <SelectTrigger className="w-[180px] border-[#e6f4ff]">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="yesterday">Active Yesterday</SelectItem>
              <SelectItem value="last3days">Active Last 3 Days</SelectItem>
              <SelectItem value="inactive3days">
                Inactive &gt; 3 Days
              </SelectItem>
              <SelectItem value="inactiveYesterday">
                Inactive Yesterday
              </SelectItem>{" "}
              {/* New filter */}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={exportLoading}
            className="border-[#e6f4ff] hover:bg-[#f0f9ff]"
          >
            {exportLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export to CSV
          </Button>
        </div>
      </div>

      {timeFilter !== "all" && filteredStudents.length === 0 ? (
        <Card className="border-[#e6f4ff] bg-white">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="h-12 w-12 text-[#007acc] opacity-40 mb-4" />
            <h3 className="text-xl font-medium text-[#007acc]">
              No Students Found
            </h3>
            <p className="text-muted-foreground mt-2 text-center">
              {timeFilter === "yesterday"
                ? "No students solved LeetCode problems yesterday."
                : timeFilter === "last3days"
                ? "No students solved LeetCode problems in the last 3 days."
                : timeFilter === "inactive3days"
                ? "No students have been inactive for more than 3 days."
                : "No students were inactive yesterday."}{" "}
              {/* Updated message */}
            </p>
            <Button
              variant="outline"
              onClick={() => setTimeFilter("all")}
              className="mt-4 border-[#e6f4ff]"
            >
              Show All Students
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(timeFilter === "all" ? students : filteredStudents).map(
            (student) => (
              <StudentCard
                key={student.id}
                student={student}
                stats={studentStats[student.id]}
                isLoading={loadingStats[student.id]}
                isRefreshing={refreshing[student.id]}
                onRefresh={() => handleRefreshStats(student.id)}
                onViewDetails={() => handleViewDetails(student.id)}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

interface StudentCardProps {
  student: Student;
  stats?: ExternalStats;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onViewDetails: () => void;
}

function StudentCard({
  student,
  stats,
  isLoading,
  isRefreshing,
  onRefresh,
  onViewDetails,
}: StudentCardProps) {
  const username = student.user.username || "Student";
  const today = new Date();

  const getLastActiveDate = () => {
    if (
      !stats?.leetcode_recent_submissions ||
      stats.leetcode_recent_submissions.length === 0
    ) {
      return { date: null, isInactive: true };
    }

    const mostRecent = stats.leetcode_recent_submissions[0];
    const submissionDate = parseISO(mostRecent.timestamp);
    const isInactive = differenceInDays(today, submissionDate) > 3;

    return { date: format(submissionDate, "MMM d, yyyy"), isInactive };
  };

  const { date: lastActiveDate, isInactive } = getLastActiveDate();

  return (
    <Card className="overflow-hidden border-[#e6f4ff] transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-[#f0f9ff] to-white">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
              <AvatarImage
                src={
                  student.user.profile_image
                    ? `${origin}${student.user.profile_image}`
                    : ""
                }
                alt={username}
                onError={(e) => {
                  // When image fails to load, ensure fallback is shown
                  e.currentTarget.style.display = "none";
                  // console.log(
                  //   "Image failed to load:",
                  //   student.user.profile_image
                  // );
                }}
              />
              <AvatarFallback className="bg-[#f0f9ff] text-[#007acc] text-2xl">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mt-3">
              <CardTitle className="text-xl text-[#007acc]">
                {username}
              </CardTitle>
              {isInactive && <AlertTriangle className="h-5 w-5 text-red-500" />}
            </div>
            <CardDescription className="text-center">
              ID: {student.id}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-[#007acc] hover:text-[#0062a3] hover:bg-[#f0f9ff]"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-[#007acc]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-[#2ea043]" />
                <span className="font-medium">GitHub Repos</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-[#f0fff4] text-[#2ea043] font-medium"
                >
                  {stats?.github_repos !== null ? stats?.github_repos : "N/A"}
                </Badge>
                {student.github_profile && (
                  <a
                    href={student.github_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#007acc] hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[#ff9a00]" />
                <span className="font-medium">LeetCode Solved</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-[#fff8f0] text-[#ff9a00] font-medium"
                >
                  {stats?.leetcode_solved !== null
                    ? stats?.leetcode_solved
                    : "N/A"}
                </Badge>
                {student.leetcode_profile && (
                  <a
                    href={`https://leetcode.com/${student.leetcode_profile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#007acc] hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#007acc]" />
                <span className="font-medium">Last Active</span>
              </div>
              <Badge
                variant="outline"
                className={
                  isInactive
                    ? "bg-red-50 text-red-500"
                    : "bg-[#f0f9ff] text-[#007acc]"
                }
              >
                {lastActiveDate || "Never"}
              </Badge>
            </div>

            {stats?.leetcode_recent_submissions &&
              stats.leetcode_recent_submissions.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Recent Submission
                  </div>
                  <div className="bg-[#f8fafc] p-2 rounded-md border border-[#e6f4ff]">
                    <div className="font-medium text-sm truncate">
                      {stats.leetcode_recent_submissions[0].title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(
                        parseISO(
                          stats.leetcode_recent_submissions[0].timestamp
                        ),
                        "MMM d, yyyy h:mm a"
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-[#f8fafc] border-t border-[#e6f4ff] pt-4">
        <Button
          onClick={onViewDetails}
          className="w-full bg-[#007acc] hover:bg-[#0062a3]"
        >
          View Full Details
        </Button>
      </CardFooter>
    </Card>
  );
}
