"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Users, User, MessageSquare, Send, Info, Bell, UserCheck, UsersRound } from "lucide-react"

import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { sendNotification } from "../../lib/actions/notification-actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import Cookies from "js-cookie"
import "react-toastify/dist/ReactToastify.css"
import { jwtDecode } from "jwt-decode"

export async function getUserIdFromToken(): Promise<number | null> {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]
  console.log("Token from cookie:", token)

  if (!token) return null

  try {
    const decoded: any = jwtDecode(token)
    return decoded.user_id || decoded.id
  } catch (e) {
    console.error("Invalid token:", e)
    return null
  }
}

interface Track {
  id: number
  name: string
}
// Define recipient types
type RecipientType = "student" | "track"

const formSchema = z
  .object({
    recipientType: z.enum(["student", "track"], {
      required_error: "Please select a recipient type",
    }),
    student_id: z.string().optional(),
    track_id: z.string().optional(),
    message: z
      .string()
      .min(5, {
        message: "Message must be at least 5 characters",
      })
      .max(500, {
        message: "Message cannot exceed 500 characters",
      }),
  })
  .refine(
    (data) => {
      if (data.recipientType === "student") {
        return !!data.student_id
      } else {
        return !!data.track_id
      }
    },
    {
      message: "Please select a recipient",
      path: ["student_id"],
    },
  )

export function SendNotificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recipientType, setRecipientType] = useState<RecipientType>("student")
  const [students, setStudents] = useState<any[]>([]) // Ensure it is an array
  const [tracks, setTracks] = useState<any[]>([]) // Ensure it is an array
  const [selectedStudent, setSelectedStudent] = useState(null) // لحفظ الطالب المحدد

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientType: "student",
      message: "",
    },
  })

  // Watch for changes to recipientType
  const watchRecipientType = form.watch("recipientType")

  // Fetch students and tracks from the API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = Cookies.get("token") // قراءة التوكن من الكوكيز

        if (!token) {
          console.error("No token found")
          return
        }

        const response = await fetch("http://127.0.0.1:8000/users/students", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // إضافة التوكن في الهيدر هنا
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch students")
        }

        const data = await response.json()
        console.log("Students data:", data)
        setStudents(data || []) // تعيين البيانات للمصفوفة students
      } catch (error) {
        console.error("Failed to fetch students:", error)
      }
    }

    const fetchInstructorTracks = async () => {
      try {
        // 1️⃣ Get userId from token
        const userId = await getUserIdFromToken()
        console.log("User ID from token:", userId)
        if (!userId) throw new Error("User ID not found in token.")
    
        // 2️⃣ Get instructorId using userId
        const res = await fetch(`http://127.0.0.1:8000/users/instructors/${userId}`)
        const instructorData = await res.json()
        const instructorId = instructorData.id
        console.log("Instructor ID:", instructorId)
    
        // 3️⃣ Fetch tracks for this instructor
        const trackRes = await fetch(`http://127.0.0.1:8000/users/instructor/${instructorId}/tracks/`)
        const trackData = await trackRes.json()
        console.log("Tracks for instructor:", trackData)
    
        // 4️⃣ Set tracks
        setTracks(trackData)
      } catch (error) {
        console.error("Failed to fetch instructor tracks:", error)
      }
    }
    

    fetchStudents()
    fetchInstructorTracks()
  }, [])

  const handleRecipientTypeChange = (value: RecipientType) => {
    setRecipientType(value)
    form.setValue("recipientType", value)

    if (value === "student") {
      form.setValue("track_id", undefined)
    } else {
      form.setValue("student_id", undefined)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    async function fetchInstructorId(): Promise<number> {
      const userId = await getUserIdFromToken() // ✅ لازم await
      console.log("User ID from token:", userId)
      if (!userId) throw new Error("User ID not found in token.")
      const res = await fetch(`http://127.0.0.1:8000/users/instructors/${userId}`)
      const data = await res.json()
      console.log("Data from student API:", data)
      return data.id
    }

    try {
      const instructor_id = await fetchInstructorId() // استخدم القيمة الثابتة مباشرة هنا.
      console.log("Instructor ID:", instructor_id)

      const payload = {
        instructor_id,
        message: values.message,
        ...(values.recipientType === "student"
          ? { student_id: Number.parseInt(values.student_id!) }
          : { track_id: Number.parseInt(values.track_id!) }),
      }
      console.log("Payload:", payload)

      const result = await sendNotification(payload)
      console.log("Response from notification API:", result)

      // هنا تتحقق من نجاح الإرسال بناءً على الرسالة في الاستجابة
      if (
        result.message &&
        (result.message.includes("Notes sent to all students") || result.message.includes("Note sent successfully")) // تحقق من نجاح الإرسال بناءً على الرسالة
      ) {
        alert("Notification sent successfully!")
      } else {
        throw new Error("Failed to send notification.")
      }

      form.reset({
        recipientType: values.recipientType,
        message: "",
      })
    } catch (error) {
      console.error("Failed to send notification:", error)
      alert("There was an error sending your notification. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="h-5 w-5 text-[#007acc]" />
          <h3 className="text-lg font-medium text-gray-700">Notification Details</h3>
        </div>

        <FormField
          control={form.control}
          name="recipientType"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-[#007acc] text-base font-medium">Recipient Type</FormLabel>
                <div className="flex items-center text-xs text-gray-500">
                  <Info className="h-3 w-3 mr-1" />
                  <span>Who will receive this notification?</span>
                </div>
              </div>

              <FormControl>
                <RadioGroup
                  onValueChange={(value: RecipientType) => handleRecipientTypeChange(value)}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div
                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      watchRecipientType === "student"
                        ? "border-[#007acc] bg-[#f0f7ff]"
                        : "border-gray-200 bg-white hover:border-[#c7e5ff]"
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      <RadioGroupItem value="student" id="student" className="sr-only" />
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          watchRecipientType === "student" ? "border-[#007acc] bg-[#007acc]" : "border-gray-300"
                        }`}
                      >
                        {watchRecipientType === "student" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <Label htmlFor="student" className="flex flex-col items-center p-6 cursor-pointer">
                      <UserCheck
                        className={`h-10 w-10 mb-3 ${
                          watchRecipientType === "student" ? "text-[#007acc]" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          watchRecipientType === "student" ? "text-[#007acc]" : "text-gray-700"
                        }`}
                      >
                        Individual Student
                      </span>
                      <span className="text-xs text-gray-500 mt-1 text-center">Send to a specific student</span>
                    </Label>
                  </div>

                  <div
                    className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      watchRecipientType === "track"
                        ? "border-[#007acc] bg-[#f0f7ff]"
                        : "border-gray-200 bg-white hover:border-[#c7e5ff]"
                    }`}
                  >
                    <div className="absolute top-2 right-2">
                      <RadioGroupItem value="track" id="track" className="sr-only" />
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          watchRecipientType === "track" ? "border-[#007acc] bg-[#007acc]" : "border-gray-300"
                        }`}
                      >
                        {watchRecipientType === "track" && <div className="h-2 w-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                    <Label htmlFor="track" className="flex flex-col items-center p-6 cursor-pointer">
                      <UsersRound
                        className={`h-10 w-10 mb-3 ${
                          watchRecipientType === "track" ? "text-[#007acc]" : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${watchRecipientType === "track" ? "text-[#007acc]" : "text-gray-700"}`}
                      >
                        Entire Track
                      </span>
                      <span className="text-xs text-gray-500 mt-1 text-center">Send to all students in a track</span>
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="h-px bg-gray-200 my-6"></div>

        {watchRecipientType === "student" ? (
          <FormField
            control={form.control}
            name="student_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#007acc] text-base font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Select Student
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: string) => {
                    console.log("Selected student ID:", value)
                    field.onChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 focus:ring-[#007acc] focus:border-[#007acc] h-12 mt-2">
                      <SelectValue placeholder="Choose a student to notify" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-gray-200">
                    {students.length > 0 ? (
                      students.map((student) => (
                        <SelectItem key={student.id} value={String(student.id)}>
                          {student.user.username}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-students" disabled>
                        No students available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 text-sm mt-2">
                  The notification will be sent only to this student.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="track_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#007acc] text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Select Track
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: string) => {
                    console.log("Selected Track ID:", value)
                    field.onChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 focus:ring-[#007acc] focus:border-[#007acc] h-12 mt-2">
                      <SelectValue placeholder="Choose a track" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-gray-200">
                    {tracks.length > 0 ? (
                      tracks.map((track) => (
                        <SelectItem key={track.id} value={String(track.id)}>
                          {track.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-tracks" disabled>
                        No tracks available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription className="text-gray-500 text-sm mt-2">
                  The notification will be sent to all students in this track.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}

        <div className="h-px bg-gray-200 my-6"></div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#007acc] text-base font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message Content
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type your notification message here..."
                  className="min-h-40 resize-none border-gray-300 focus:ring-[#007acc] focus:border-[#007acc] mt-2 text-base"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-gray-500 text-sm mt-2 flex items-start gap-2">
                <Info className="h-4 w-4 text-[#007acc] mt-0.5 flex-shrink-0" />
                <span>
                  Write a clear and concise message. Students will receive this notification in their dashboard and via
                  email.
                </span>
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#007acc] hover:bg-[#0069b4] text-white font-medium h-12 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sending notification...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Send Notification</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
