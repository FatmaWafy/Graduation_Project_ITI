"use client"

import { useEffect, useState } from "react"
import { BookOpen, Clock, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type Course, getCourses } from "@/lib/api"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground">View and manage your enrolled courses</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="h-full w-full object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.department}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{course.instructor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{course.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{course.credits} Credits</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                {course.progress < 30
                  ? "Just getting started"
                  : course.progress < 70
                    ? "Making good progress"
                    : "Almost complete"}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

