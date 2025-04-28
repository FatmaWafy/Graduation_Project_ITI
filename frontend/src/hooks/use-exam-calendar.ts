"use client"

import { useState, useEffect } from "react"
import { extractExamDateFromMessage, formatDateForCalendar } from "../lib/utils/data-parser"
import Cookies from "js-cookie"
import axios from "axios"
const origin = process.env.NEXT_PUBLIC_API_URL;


interface Notification {
  id: string
  message: string
  created_at: string
  instructor: number
  read: boolean
  is_track_notification?: boolean
}

export interface ExamEvent {
  date: string
  title: string
  course: string
  isExam: boolean
  examId?: string
  time?: string
}

export function useExamCalendar() {
  const [examEvents, setExamEvents] = useState<ExamEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)

  const fetchNotificationsForExams = async (forceRefresh = false) => {
    // Don't fetch if we've fetched in the last 10 seconds unless forced
    const now = Date.now()
    if (!forceRefresh && now - lastFetchTime < 10000) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("Token not found in cookies")
      }

      const response = await axios.get(`${origin}/notifications/notes/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && Array.isArray(response.data)) {
        const notifications: Notification[] = response.data.map((notification: any) => ({
          id: `${notification.id}`,
          message: notification.message,
          created_at: notification.created_at,
          instructor: notification.instructor_name,
          read: notification.read,
          is_track_notification: notification.is_track_notification || false,
        }))

        // Extract exam dates from notifications
        const newExamEvents: ExamEvent[] = []

        for (const notification of notifications) {
          // Check if message contains exam-related keywords
          if (notification.message.toLowerCase().includes("exam")) {
            const examInfo = extractExamDateFromMessage(notification.message)

            if (examInfo) {
              const { date, examName } = examInfo
              const formattedDate = formatDateForCalendar(date)
              const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

              // Create an exam event with the extracted exam name
              newExamEvents.push({
                date: formattedDate,
                title: examName,
                course: `Instructor: ${notification.instructor}`,
                isExam: true,
                examId: notification.id,
                time: formattedTime,
              })
            }
          }
        }

        // Also check for hardcoded test data for "Exam 33"
        const testExamDate = new Date("2025-04-20T03:07:00")
        const formattedTestDate = formatDateForCalendar(testExamDate)
        const formattedTestTime = testExamDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        // Add the test exam if it's not already in the events
        const testExamExists = newExamEvents.some(
          (event) => event.title === "Exam 33" && event.date === formattedTestDate,
        )

        if (!testExamExists) {
          newExamEvents.push({
            date: formattedTestDate,
            title: "Exam 33",
            course: "Scheduled Exam",
            isExam: true,
            time: formattedTestTime,
          })
        }

        setExamEvents(newExamEvents)
        setLastFetchTime(now)
      }
    } catch (error) {
      console.error("Failed to fetch notifications for exams:", error)
      setError("Failed to load exam dates. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add an exam event manually
  const addExamEvent = (date: Date, title: string, course: string, examId?: string) => {
    const formattedDate = formatDateForCalendar(date)
    const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Check if this exam already exists
    const examExists = examEvents.some((event) => event.title === title && event.date === formattedDate)

    if (!examExists) {
      setExamEvents((prev) => [
        ...prev,
        {
          date: formattedDate,
          title,
          course,
          isExam: true,
          examId,
          time: formattedTime,
        },
      ])
    }
  }

  // Process notifications directly
  const processNotification = (notification: { message: string; id?: string; instructor?: number }) => {
    if (notification.message.toLowerCase().includes("exam")) {
      const examInfo = extractExamDateFromMessage(notification.message)

      if (examInfo) {
        const { date, examName } = examInfo
        addExamEvent(date, examName, `Instructor: ${notification.instructor || "Unknown"}`, notification.id)
        return true
      }
    }
    return false
  }

  // Remove course events that are not exams
  const removeNonExamEvents = (events: any[]) => {
    return events.filter((event) => "isExam" in event && event.isExam)
  }

  // Add a function to help determine if an exam is in the past
  const isPastExam = (date: string) => {
    const examDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time part for accurate date comparison
    return examDate < today
  }

  // Add the test exam directly
  useEffect(() => {
    // Add the test exam for "Exam 33" at 4/20/2025, 3:07 AM
    const testExamDate = new Date("2025-04-20T03:07:00")
    addExamEvent(testExamDate, "Exam 33", "Scheduled Exam")
  }, [])

  return {
    examEvents,
    isLoading,
    error,
    fetchNotificationsForExams,
    addExamEvent,
    removeNonExamEvents,
    processNotification,
    isPastExam,
  }
}
