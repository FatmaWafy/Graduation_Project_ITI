// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Check, Loader2 } from "lucide-react"

// import { Button } from "../ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
// import { Textarea } from "../ui/textarea"
// import { useToast } from "../ui/use-toast"
// import { sendNotification } from "../../lib/actions/notification-actions"
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
// import { Label } from "../ui/label"

// // Mock data for students - in a real app, this would come from an API
// const STUDENTS = [
//   { id: "1", name: "Alice Johnson" },
//   { id: "2", name: "Bob Smith" },
//   { id: "3", name: "Charlie Brown" },
//   { id: "4", name: "Diana Prince" },
//   { id: "5", name: "Edward Cullen" },
//   { id: "6", name: "Fiona Gallagher" },
// ]

// // Mock data for tracks - in a real app, this would come from an API
// const TRACKS = [
//   { id: "1", name: "Web Development" },
//   { id: "2", name: "Data Science" },
//   { id: "3", name: "Mobile Development" },
//   { id: "4", name: "UI/UX Design" },
// ]

// // Define recipient types
// type RecipientType = "student" | "track"

// const formSchema = z
//   .object({
//     recipientType: z.enum(["student", "track"], {
//       required_error: "Please select a recipient type",
//     }),
//     student_id: z.string().optional(),
//     track_id: z.string().optional(),
//     message: z
//       .string()
//       .min(5, {
//         message: "Message must be at least 5 characters",
//       })
//       .max(500, {
//         message: "Message cannot exceed 500 characters",
//       }),
//   })
//   .refine(
//     (data) => {
//       if (data.recipientType === "student") {
//         return !!data.student_id
//       } else {
//         return !!data.track_id
//       }
//     },
//     {
//       message: "Please select a recipient",
//       path: ["student_id"],
//     },
//   )

// export function SendNotificationForm() {
//   const { toast } = useToast()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [recipientType, setRecipientType] = useState<RecipientType>("student")

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       recipientType: "student",
//       message: "",
//     },
//   })

//   // Watch for changes to recipientType
//   const watchRecipientType = form.watch("recipientType")

//   // Handle recipient type change
//   const handleRecipientTypeChange = (value: RecipientType) => {
//     setRecipientType(value)
//     form.setValue("recipientType", value)

//     // Reset the other field when switching types
//     if (value === "student") {
//       form.setValue("track_id", undefined)
//     } else {
//       form.setValue("student_id", undefined)
//     }
//   }

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true)
//     try {
//       // In a real app, the instructor_id would come from the authenticated user
//       const instructor_id = 6

//       // Prepare the payload based on recipient type
//       const payload = {
//         instructor_id,
//         message: values.message,
//         ...(values.recipientType === "student"
//           ? { student_id: Number.parseInt(values.student_id!) }
//           : { track_id: Number.parseInt(values.track_id!) }),
//       }

//       const result = await sendNotification(payload)

//       toast({
//         title: "Notification sent",
//         description: "Your notification has been sent successfully.",
//       })

//       form.reset({
//         recipientType: values.recipientType,
//         message: "",
//       })
//     } catch (error) {
//       console.error("Failed to send notification:", error)
//       toast({
//         title: "Failed to send notification",
//         description: "There was an error sending your notification. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <FormField
//           control={form.control}
//           name="recipientType"
//           render={({ field }) => (
//             <FormItem className="space-y-3">
//               <FormLabel>Recipient Type</FormLabel>
//               <FormControl>
//                 <RadioGroup
//                   onValueChange={(value: RecipientType) => handleRecipientTypeChange(value)}
//                   defaultValue={field.value}
//                   className="flex flex-col space-y-1 sm:flex-row sm:space-x-6 sm:space-y-0"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="student" id="student" />
//                     <Label htmlFor="student">Specific Student</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="track" id="track" />
//                     <Label htmlFor="track">Entire Track</Label>
//                   </div>
//                 </RadioGroup>
//               </FormControl>
//               <FormDescription>
//                 Choose whether to send to an individual student or all students in a track.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {watchRecipientType === "student" ? (
//           <FormField
//             control={form.control}
//             name="student_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Student</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a student" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {STUDENTS.map((student) => (
//                       <SelectItem key={student.id} value={student.id}>
//                         {student.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>Select the student you want to send a notification to.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         ) : (
//           <FormField
//             control={form.control}
//             name="track_id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Track</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a track" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {TRACKS.map((track) => (
//                       <SelectItem key={track.id} value={track.id}>
//                         {track.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormDescription>Select the track to send a notification to all students.</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}

//         <FormField
//           control={form.control}
//           name="message"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Message</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="Enter your notification message here..."
//                   className="min-h-32 resize-none"
//                   {...field}
//                 />
//               </FormControl>
//               <FormDescription>
//                 Write a clear and concise message for the {watchRecipientType === "student" ? "student" : "track"}.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit" className="w-full" disabled={isSubmitting}>
//           {isSubmitting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Sending...
//             </>
//           ) : (
//             <>
//               <Check className="mr-2 h-4 w-4" />
//               Send Notification
//             </>
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }

"use client";

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, Loader2 } from "lucide-react"

import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { useToast } from "../ui/use-toast"
import { sendNotification } from "../../lib/actions/notification-actions"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import Cookies from 'js-cookie';
import "react-toastify/dist/ReactToastify.css";



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
  const [selectedStudent, setSelectedStudent] = useState(null);  // لحفظ الطالب المحدد


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
        const token = Cookies.get('token'); // قراءة التوكن من الكوكيز

        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/users/students", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,  // إضافة التوكن في الهيدر هنا
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        console.log("Students data:", data);
        setStudents(data || []);  // تعيين البيانات للمصفوفة students
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    const fetchTracks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/users/get-tracks/")
        const data = await response.json()
        console.log("tracks data:", data);
        setTracks(data.tracks || [])
      } catch (error) {
        console.error("Failed to fetch tracks:", error)
      }
    }

    fetchStudents()
    fetchTracks()
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
    setIsSubmitting(true);
    try {
      const instructor_id = 6;

      const payload = {
        instructor_id,
        message: values.message,
        ...(values.recipientType === "student"
          ? { student_id: Number.parseInt(values.student_id!) }
          : { track_id: Number.parseInt(values.track_id!) }),
      };

      const result = await sendNotification(payload);
      console.log("Response from notification API:", result);

      if (result.message === "Note sent successfully!") {
        alert("Notification sent successfully!");
      } else {
        throw new Error("Failed to send notification.");
      }

      form.reset({
        recipientType: values.recipientType,
        message: "",
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
      alert("There was an error sending your notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <>
          {/* <ToastContainer /> */}

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recipientType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Recipient Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value: RecipientType) => handleRecipientTypeChange(value)}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 sm:flex-row sm:space-x-6 sm:space-y-0"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Specific Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="track" id="track" />
                    <Label htmlFor="track">Entire Track</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Choose whether to send to an individual student or all students in a track.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchRecipientType === "student" ? (
          <FormField
            control={form.control}
            name="student_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student</FormLabel>
                <Select value={field.value} onValueChange={(value: string) => {
                  console.log("Selected student ID:", value);
                  field.onChange(value);
                }}>                <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <SelectItem key={student.id} value={String(student.id)}>
                          {student.user.username}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No students available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Select the student you want to send a notification to.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="track_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tracks.length > 0 ? (
                      tracks.map((track, index) => (
                        <SelectItem key={index} value={track}>
                          {track}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled>No tracks available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Select the track to send a notification to all students.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your notification message here..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Write a clear and concise message for the {watchRecipientType === "student" ? "student" : "track"}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Send Notification
            </>
          )}
        </Button>
      </form>
    </Form>
</>
  )
}
