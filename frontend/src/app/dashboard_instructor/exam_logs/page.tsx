"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExamLogsIndexPage() {
  // حالة لتخزين الامتحانات المسترجعة من الـ API
  const [exams, setExams] = useState<any[]>([])

  // حالة لمعرفة إذا كان هناك خطأ أو تحميل البيانات
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // استخراج الـ Token من الـ Cookies
  const getAuthToken = () => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
    return token || ''
  }


  // استخدام useEffect لجلب البيانات عند تحميل الصفحة
  useEffect(() => {
    const fetchExams = async () => {
      const token = getAuthToken()
      console.log("Token from cookies:", token)


      try {
        const response = await fetch("http://127.0.0.1:8000/exam/exams/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // إضافة الـ Token في الهيدر
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch exams")
        }

        const data = await response.json()
        setExams(data) // تعيين البيانات إلى state
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  if (loading) {
    return <div className="text-center">Loading exams...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Exam Logs
          </h1>
          <p className="text-muted-foreground mt-1">Select an exam to view its logs</p>
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam: any) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gray-100 rounded-t-lg">
              <CardTitle className="text-lg font-semibold text-[#000000]">{exam.title}</CardTitle>
              <CardDescription className="text-sm text-gray-600">Exam ID: {exam.id}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <Link href={`/dashboard_instructor/exam_logs/${exam.id}`} passHref>
                <Button className="bg-[#004E8C] hover:bg-[#0059A8] text-white px-6 py-2 rounded-md">
                  View Logs
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}
