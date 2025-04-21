"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Filter,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useExamCalendar } from "@/hooks/use-exam-calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Helper functions for calendar
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
];

// Sample events - we'll make these optional
const SAMPLE_EVENTS = [
  {
    date: "2025-04-05",
    title: "Algorithm Implementation Due",
    course: "Introduction to Computer Science",
  },
  {
    date: "2025-04-03",
    title: "Integration Problems Due",
    course: "Calculus II",
  },
  {
    date: "2025-04-10",
    title: "Historical Essay Due",
    course: "World History: Modern Era",
  },
  {
    date: "2025-04-15",
    title: "Midterm Exam",
    course: "Introduction to Psychology",
  },
  {
    date: "2025-04-20",
    title: "Group Project Presentation",
    course: "Introduction to Computer Science",
  },
  {
    date: "2025-04-08",
    title: "Lab Report Due",
    course: "Introduction to Psychology",
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { examEvents, isLoading, error, fetchNotificationsForExams } =
    useExamCalendar();
  const [allEvents, setAllEvents] = useState<Array<any>>([]);
  const [showCourseEvents, setShowCourseEvents] = useState(false);
  const { toast } = useToast();

  // Fetch exam events when component mounts
  useEffect(() => {
    fetchNotificationsForExams(true);
  }, []);

  // Combine sample events with exam events based on filter setting
  useEffect(() => {
    if (showCourseEvents) {
      setAllEvents([...SAMPLE_EVENTS, ...examEvents]);
    } else {
      setAllEvents([...examEvents]);
    }
  }, [examEvents, showCourseEvents]);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const refreshCalendar = () => {
    fetchNotificationsForExams(true);
    toast({
      title: "Calendar Refreshed",
      description:
        "Your calendar has been updated with the latest exam information.",
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-border p-1"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      const dayEvents = allEvents.filter((event) => event.date === date);
      const examEventsForDay = dayEvents.filter(
        (event) => "isExam" in event && event.isExam
      );
      const hasExams = examEventsForDay.length > 0;

      // Check if date is in the past
      const currentDateObj = new Date();
      const cellDate = new Date(date);
      const isPastDate =
        cellDate < new Date(currentDateObj.setHours(0, 0, 0, 0));

      // Determine background color based on whether it has exams and if it's in the past
      let bgColorClass = "";
      if (hasExams) {
        bgColorClass = isPastDate ? "bg-green-50" : "bg-red-50";
      }

      days.push(
        <div
          key={day}
          className={`min-h-24 border border-border p-1 ${bgColorClass}`}
        >
          <div className="flex justify-between">
            <span
              className={`text-sm font-medium ${
                hasExams
                  ? isPastDate
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                  : dayEvents.length > 0
                  ? "text-primary"
                  : ""
              }`}
            >
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  hasExams
                    ? isPastDate
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-primary"
                } text-xs text-primary-foreground`}
              >
                {dayEvents.length}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event, index) => (
              <div
                key={index}
                className={`truncate rounded px-1 py-0.5 text-xs ${
                  "isExam" in event && event.isExam
                    ? isPastDate
                      ? "bg-green-100 text-green-800 font-medium"
                      : "bg-red-100 text-red-800 font-medium"
                    : "bg-primary/10"
                }`}
                title={`${event.title} - ${event.course}${
                  event.time ? ` at ${event.time}` : ""
                }`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const todayEvents = allEvents.filter((event) => {
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return event.date === formattedToday;
  });

  const upcomingEvents = allEvents
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const upcomingExams = examEvents
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastExams = examEvents
    .filter((event) => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort in reverse chronological order

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your academic schedule
          </p>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* <div className="flex items-center space-x-2 bg-muted/20 p-3 rounded-lg">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="show-course-events" className="flex-1">
          Show course events
        </Label>
        <Switch id="show-course-events" checked={showCourseEvents} onCheckedChange={setShowCourseEvents} />
      </div> */}

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
                <p className="text-center text-muted-foreground">
                  No events today
                </p>
              ) : (
                <div className="space-y-4">
                  {todayEvents.map((event, index) => (
                    <div key={index} className="space-y-1">
                      <h3 className="font-medium flex items-center gap-2">
                        {event.title}
                        {"isExam" in event && event.isExam && (
                          <Badge variant="destructive" className="text-xs">
                            Exam
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {event.course}
                      </p>
                      {"time" in event && event.time && (
                        <p className="text-xs text-muted-foreground">
                          Time: {event.time}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-red-500" />
                Upcoming Exams
              </CardTitle>
              <CardDescription>Your scheduled exams</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingExams.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No upcoming exams
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingExams.map((event, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start border-b border-red-100 pb-2 last:border-0"
                    >
                      <div>
                        <h3 className="font-medium text-red-800">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {event.course}
                        </p>
                        {event.time && (
                          <p className="text-xs text-red-700">
                            Time: {event.time}
                          </p>
                        )}
                      </div>
                      <div className="text-sm bg-red-100 px-2 py-1 rounded text-red-800">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {pastExams.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-green-500" />
                  Past Exams
                </CardTitle>
                <CardDescription>Your completed exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastExams.map((event, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start border-b border-green-100 pb-2 last:border-0"
                    >
                      <div>
                        <h3 className="font-medium text-green-800">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {event.course}
                        </p>
                        {event.time && (
                          <p className="text-xs text-green-700">
                            Time: {event.time}
                          </p>
                        )}
                      </div>
                      <div className="text-sm bg-green-100 px-2 py-1 rounded text-green-800">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {showCourseEvents && (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your next scheduled events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No upcoming events
                    </p>
                  ) : (
                    upcomingEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex justify-between space-y-1"
                      >
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {event.title}
                            {"isExam" in event && event.isExam && (
                              <Badge variant="destructive" className="text-xs">
                                Exam
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {event.course}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
