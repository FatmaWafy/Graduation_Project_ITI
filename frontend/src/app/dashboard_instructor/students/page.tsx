"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"

import { Button } from "@/src/components/ui/button"
import { StudentTable } from "./components/student-table"
import { StudentModal } from "./components/student-modal"
import { useStudents } from "./hooks/use-students"
import type { Student } from "./types"
 
export default function StudentsPage() {
  const router = useRouter()
  const { students, isLoading, error } = useStudents()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const handleAddStudent = () => {
    setSelectedStudent(null)
    setIsModalOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleViewStudent = (studentId: number) => {
    router.push(`/dashboard_instructor/students/${studentId}`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Manage student information, enrollments, and academic records</p>
        </div>
        <Button onClick={handleAddStudent}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/15 p-4 rounded-md text-destructive">Error loading students: {error.message}</div>
      ) : (
        <StudentTable
          students={students || []}
          isLoading={isLoading}
          onEdit={handleEditStudent}
          onView={handleViewStudent}
        />
      )}

      <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} student={selectedStudent} />
    </div>
  )
}

