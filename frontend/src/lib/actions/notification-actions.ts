"use server"
import Cookies from "js-cookie"
import { revalidatePath } from "next/cache"

interface BaseNotificationParams {
  instructor_id: number
  message: string
}

interface StudentNotificationParams extends BaseNotificationParams {
  student_id: number
}

interface TrackNotificationParams extends BaseNotificationParams {
  track_id: number
}

type SendNotificationParams = StudentNotificationParams | TrackNotificationParams

interface NotificationResponse {
  message: string
  status: number
}

interface Notification {
  message: string
  created_at: string
  instructor: number
  is_track_notification?: boolean
}



 
export async function sendNotification(params: SendNotificationParams): Promise<NotificationResponse> {
  try {
    const response = await fetch("http://127.0.0.1:8000/notifications/send-note/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to send notification: ${response.status} ${response.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ""
        }`
      );
    }

    // التحقق من حالة الاستجابة فقط
    const data = await response.json();

    // طباعة الاستجابة في الـ console
    console.log("Notification sent:", data);

    // إذا كانت الحالة 200، نعرض رسالة النجاح
    if (response.status === 200) {
      alert("Notification sent successfully!");
    }

    // إعادة التحقق من الصفحة (إذا كان لديك حاجة لذلك)
    revalidatePath("/dashboard_student/notifications");

    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
}


 
export async function getStudentNotifications(): Promise<Notification[]> {
  try {
    const response = await fetch("http://127.0.0.1:8000/notifications/notes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache to ensure we get fresh data
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}

// In a real application, you would implement this endpoint on your backend
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    // This is a mock implementation since your backend might not support this yet
    // You would typically make a POST request to your backend
    console.log(`Marking notification ${notificationId} as read`)

    // Revalidate the notifications page
    revalidatePath("/dashboard_student/notifications")
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    // This is a mock implementation since your backend might not support this yet
    // You would typically make a POST request to your backend
    console.log("Marking all notifications as read")

    // Revalidate the notifications page
    revalidatePath("/dashboard_student/notifications")
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

