"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  Loader2,
  PenIcon as UserPen,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  BookOpen,
} from "lucide-react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StudentModal } from "../components/student-modal"
import { useStudentById } from "@/app/dashboard_instructor/students/hooks/use-students"

import StudentProgress from "../components/StudentProgress"

export default function StudentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = Number.parseInt(params.id as string)

  const { data: student, isLoading, error } = useStudentById(studentId)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !student) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-2xl font-bold text-destructive">Error Loading Student</h2>
              <p className="mt-2 text-muted-foreground">{error?.message || "Student not found"}</p>
              <Button onClick={() => router.push("/dashboard_instructor/students")} className="mt-6">
                Return to Student List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }


  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800"

    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "graduated":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Use the username from the user object
  const displayName = student.user.username || "Student"
  const status = student.user.status || student.status || "active"

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <CardDescription>Student ID: {student.id}</CardDescription>
              </div>
              <Badge className={getStatusColor(status)}>
                {status?.charAt(0).toUpperCase() + status?.slice(1) || "No status"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <UserPen className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">{student.user.username}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{student.user.email}</p>
                </div>
              </div>
              {student.track_name && (
                <div className="flex items-start">
                  <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Track</p>
                    <p className="text-sm text-muted-foreground">{student.track_name}</p>
                  </div>
                </div>
              )}
              {student.user.phone && (
                <div className="flex items-start">
                  <Phone className="mr-2 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{student.user.phone}</p>
                  </div>
                </div>
              )}
              {student.user.address && (
                <div className="flex items-start">
                  <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{student.user.address}</p>
                  </div>
                </div>
              )}
              {/* {(student.user.enrollment_date || student.enrollment_date) && (
                <div className="flex items-start">
                  <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Enrollment Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(student.user.enrollment_date || student.enrollment_date || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )} */}
              {(student.user.notes || student.notes) && (
                <div className="flex items-start">
                  <FileText className="mr-2 w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">{student.user.notes || student.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>View and manage detailed information about this student</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="courses">
              <TabsList className="mb-4">
                {/* <TabsTrigger value="courses">Courses</TabsTrigger> */}
                <TabsTrigger value="grades">Grades</TabsTrigger>
                {/* <TabsTrigger value="attendance">Attendance</TabsTrigger> */}
                {/* <TabsTrigger value="documents">Documents</TabsTrigger> */}
                <TabsTrigger value="progress">Progress</TabsTrigger> {/* الجديد */}
              </TabsList>
              {/* <TabsContent value="courses" className="space-y-4">
                <p className="text-sm text-muted-foreground">Courses that {displayName} is currently enrolled in.</p>
                <Separator />
                <div className="py-4 text-center text-muted-foreground">
                  No courses found. Enroll this student in courses from the course management page.
                </div>
              </TabsContent> */}
              <TabsContent value="grades" className="space-y-4">
                <p className="text-sm text-muted-foreground">Grade history for {displayName}.</p>
                <Separator />
                <div className="py-4 text-center text-muted-foreground">
                  No grades found. Grades will appear here once they are recorded.
                </div>
              </TabsContent>
              {/* <TabsContent value="attendance" className="space-y-4">
                <p className="text-sm text-muted-foreground">Attendance record for {displayName}.</p>
                <Separator />
                <div className="py-4 text-center text-muted-foreground">
                  No attendance records found. Records will appear here once they are recorded.
                </div>
              </TabsContent> */}
              {/* <TabsContent value="documents" className="space-y-4">
                <p className="text-sm text-muted-foreground">Documents and files related to {displayName}.</p>
                <Separator />
                <div className="py-4 text-center text-muted-foreground">
                  No documents found. Upload documents from the document management page.
                </div>
              </TabsContent> */}
              <TabsContent value="progress" className="space-y-4">
                <p className="text-sm text-muted-foreground">Coding platform activity for {displayName}.</p>
                <Separator />
                <div className="py-4">
                  <StudentProgress studentId={studentId} />
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>

      <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} student={student} isEditMode={!!student} />

    </div>
  )
}

