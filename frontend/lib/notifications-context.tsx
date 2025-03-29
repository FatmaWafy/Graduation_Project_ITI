"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Notification = {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: "assignment" | "grade" | "announcement" | "system"
}

type NotificationsContextType = {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "New Assignment",
    message: "A new assignment has been posted in Introduction to Computer Science.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    type: "assignment",
  },
  {
    id: "notif-2",
    title: "Grade Posted",
    message: "Your grade for 'Data Structures Assignment' has been posted.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    type: "grade",
  },
  {
    id: "notif-3",
    title: "Course Announcement",
    message: "Important announcement for Calculus II: Class will be held online tomorrow.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: false,
    type: "announcement",
  },
  {
    id: "notif-4",
    title: "Assignment Due Soon",
    message: "Reminder: 'Integration Problems' is due in 2 days.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    type: "assignment",
  },
  {
    id: "notif-5",
    title: "System Maintenance",
    message: "The student portal will be undergoing maintenance this weekend.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    read: true,
    type: "system",
  },
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // In a real app, you would fetch notifications from an API
    setNotifications(sampleNotifications)
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

