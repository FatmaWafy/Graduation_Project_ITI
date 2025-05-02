"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  BookOpen,
  GraduationCap,
  Github,
  Code,
  School,
} from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StudentModal } from "../components/student-modal";
import { useStudentById } from "../hooks/use-students";
import StudentProgress from "../components/StudentProgress";
import { getClientSideToken } from "@/lib/cookies";
const origin = process.env.NEXT_PUBLIC_API_URL;

interface Track {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = Number.parseInt(params.id as string);
  const { data: student, isLoading, error } = useStudentById(studentId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const token = getClientSideToken();
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(`${origin}/users/branches/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
      }
    }
    fetchBranches();
  }, []);

  // Fetch tracks from API
  useEffect(() => {
    async function fetchTracks() {
      try {
        const token = getClientSideToken();
        const response = await fetch(
          `${origin}/users/get-tracks/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tracks");
        }
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    }
    fetchTracks();
  }, []);

 

  // Console log to debug student data
  console.log("Student data in details:", student);

  if (isLoading) {
    return (
      <div className='flex h-[70vh] items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-12 w-12 animate-spin text-[#007acc]' />
          <p className='text-muted-foreground'>
            Loading student information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className='container mx-auto py-6'>
        <Button
          variant='outline'
          onClick={() => router.back()}
          className='mb-6'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Students
        </Button>
        <Card className='border-destructive/50 bg-destructive/10'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <h2 className='text-2xl font-bold text-destructive'>
                Error Loading Student
              </h2>
              <p className='mt-2 text-muted-foreground'>
                {error?.message || "Student not found"}
              </p>
              <Button
                onClick={() => router.push("/dashboard_instructor/students")}
                className='mt-6 bg-[#007acc] hover:bg-[#0062a3]'
              >
                Return to Student List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "graduated":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Use the username from the user object
  const displayName = student.user.username || "Student";
  const status = student.user.status || student.status || "active";
  const trackName =
    tracks.find((t) => t.id === student.track)?.name || "Not assigned";
    
  const branchName =
    branches.find((b) => b.id === student.branch)?.name || "Not assigned";
    console.log("Student branch ID:", student.branch); // Debug

  return (
    <div className='container mx-auto py-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <Button
          variant='outline'
          onClick={() => router.back()}
          className='border-[#e6f4ff] hover:bg-[#f0f9ff] hover:text-[#007acc]'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Students
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <Card className='md:col-span-1 border-[#e6f4ff] bg-white shadow-sm'>
          <CardHeader className='pb-2'>
            <div className='flex flex-col items-center text-center'>
              <Avatar className='h-24 w-24 border-4 border-[#f0f9ff]'>
                <AvatarImage
                  src={student.user.profile_image || ""}
                  alt={displayName}
                />
                <AvatarFallback className='bg-[#f0f9ff] text-[#007acc] text-2xl'>
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='mt-4'>
                <CardTitle className='text-2xl text-[#007acc]'>
                  {displayName}
                </CardTitle>
                <CardDescription className='mt-1'>
                  Student ID: {student.id}
                </CardDescription>
                <Badge className={`mt-2 ${getStatusColor(status)}`}>
                  {status?.charAt(0).toUpperCase() + status?.slice(1) ||
                    "No status"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Separator className='my-4' />
            <div className='space-y-4'>
              <div className='flex items-start'>
                <User className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>Username</p>
                  <p className='text-sm text-muted-foreground'>
                    {student.user.username || "Not provided"}
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <Mail className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>Email</p>
                  <p className='text-sm text-muted-foreground'>
                    {student.user.email || "Not provided"}
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <BookOpen className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>Track</p>
                  <p className='text-sm text-muted-foreground'>{trackName}</p>
                </div>
              </div>
              <div className='flex items-start'>
                <BookOpen className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>Branch</p>
                  <p className='text-sm text-muted-foreground'>{branchName}</p>
                </div>
              </div>
              <div className='flex items-start'>
                <School className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>University</p>
                  <p className='text-sm text-muted-foreground'>
                    {student.university || "Not provided"}
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <GraduationCap className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>Graduation Year</p>
                  <p className='text-sm text-muted-foreground'>
                    {student.graduation_year || "Not provided"}
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <Phone className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>Phone</p>
                  <p className='text-sm text-muted-foreground'>
                    {student.user.phone || "Not provided"}
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <MapPin className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>Address</p>
                  <p className='text-sm text-muted-foreground'>
                    {student.user.address || "Not provided"}
                  </p>
                </div>
              </div>
              <div className='flex items-start'>
                <Github className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>GitHub</p>
                  {student.github_profile ? (
                    <a
                      href={student.github_profile}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-[#007acc] hover:underline'
                    >
                      {student.github_profile.replace(
                        "https://github.com/",
                        ""
                      )}
                    </a>
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Not provided
                    </p>
                  )}
                </div>
              </div>
              <div className='flex items-start'>
                <Code className='mr-3 h-5 w-5 text-[#007acc]' />
                <div>
                  <p className='font-medium'>LeetCode</p>
                  {student.leetcode_profile ? (
                    <a
                      href={`https://leetcode.com/${student.leetcode_profile}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-[#007acc] hover:underline'
                    >
                      {student.leetcode_profile}
                    </a>
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      Not provided
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2 border-[#e6f4ff] bg-white shadow-sm'>
          <CardHeader>
            <CardTitle className='text-xl text-[#007acc]'>
              Student Information
            </CardTitle>
            <CardDescription>
              View detailed information and progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='progress'>
              <TabsList className='mb-4 bg-[#f0f9ff]'>
                <TabsTrigger
                  value='progress'
                  className='data-[state=active]:bg-white data-[state=active]:text-[#007acc] data-[state=active]:shadow-sm'
                >
                  Progress
                </TabsTrigger>
              </TabsList>
              <TabsContent value='progress' className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Coding platform activity for {displayName}.
                </p>
                <Separator className='bg-[#e6f4ff]' />
                <div className='py-4'>
                  <StudentProgress studentId={studentId} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={student}
        isEditMode={!!student}
      />
    </div>
  );
}
