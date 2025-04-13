"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, GraduationCap, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StudentTable } from "./components/student-table";
import { StudentModal } from "./components/student-modal";
import { useStudents } from "./hooks/use-students";
import type { Student } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StudentsPage() {
  const router = useRouter();
  const { students, isLoading, error } = useStudents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleViewStudent = (studentId: number) => {
    router.push(`/dashboard_instructor/students/${studentId}`);
  };

  // Calculate stats
  const totalStudents = students?.length || 0;
  const activeStudents =
    students?.filter((s) => s.user.status === "active").length || 0;

  return (
    <div className='container mx-auto py-6 space-y-6'>
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-[#007acc]'>
            Student Management
          </h1>
          <p className='text-muted-foreground'>
            Manage student information and academic records
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard_instructor/students/add-student")}
          className='bg-[#007acc] hover:bg-[#0062a3] text-white self-start md:self-auto'
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Add Student
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='bg-gradient-to-br from-[#f0f9ff] to-white border-[#e6f4ff]'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-medium text-[#007acc]'>
              Total Students
            </CardTitle>
            <CardDescription>All registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <span className='text-3xl font-bold'>{totalStudents}</span>
              <Users className='h-8 w-8 text-[#007acc] opacity-80' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gradient-to-br from-[#f0fff4] to-white border-[#e6ffe6]'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg font-medium text-green-600'>
              Active Students
            </CardTitle>
            <CardDescription>Currently active students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between'>
              <span className='text-3xl font-bold'>{activeStudents}</span>
              <GraduationCap className='h-8 w-8 text-green-600 opacity-80' />
            </div>
          </CardContent>
        </Card>
      </div>

      {error ? (
        <Card className='border-destructive/50 bg-destructive/10'>
          <CardContent className='pt-6'>
            <div className='flex flex-col items-center justify-center py-4 text-center'>
              <h2 className='text-xl font-semibold text-destructive'>
                Error Loading Students
              </h2>
              <p className='mt-2 text-muted-foreground'>{error.message}</p>
              <Button onClick={() => window.location.reload()} className='mt-4'>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className='border-[#e6f4ff] shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-xl font-semibold'>
              Student Directory
            </CardTitle>
            <CardDescription>View and manage all students</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentTable
              students={students || []}
              isLoading={isLoading}
              onEdit={handleEditStudent}
              onView={handleViewStudent}
            />
          </CardContent>
        </Card>
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
