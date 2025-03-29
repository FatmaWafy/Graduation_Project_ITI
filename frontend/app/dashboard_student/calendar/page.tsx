"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Helper functions for calendar
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Sample events
const EVENTS = [
  { date: "2025-04-05", title: "Algorithm Implementation Due", course: "Introduction to Computer Science" },
  { date: "2025-04-03", title: "Integration Problems Due", course: "Calculus II" },
  { date: "2025-04-10", title: "Historical Essay Due", course: "World History: Modern Era" },
  { date: "2025-04-15", title: "Midterm Exam", course: "Introduction to Psychology" },
  { date: "2025-04-20", title: "Group Project Presentation", course: "Introduction to Computer Science" },
  { date: "2025-04-08", title: "Lab Report Due", course: "Introduction to Psychology" },
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border p-1"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const dayEvents = EVENTS.filter((event) => event.date === date)

      days.push(
        <div key={day} className="min-h-24 border border-border p-1">
          <div className="flex justify-between">
            <span className={`text-sm font-medium ${dayEvents.length > 0 ? "text-primary" : ""}`}>{day}</span>
            {dayEvents.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className="truncate rounded bg-primary/10 px-1 py-0.5 text-xs"
                title={`${event.title} - ${event.course}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  const todayEvents = EVENTS.filter((event) => {
    const today = new Date()
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    return event.date === formattedToday
  })

  const upcomingEvents = EVENTS.filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">View and manage your academic schedule</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-0">
              {DAYS.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium">
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Events</CardTitle>
              <CardDescription>Events scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <p className="text-center text-muted-foreground">No events today</p>
              ) : (
                <div className="space-y-4">
                  {todayEvents.map((event, index) => (
                    <div key={index} className="space-y-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.course}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your next scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex justify-between space-y-1">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.course}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

