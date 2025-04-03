// "use client"
// import { useEffect, useState } from "react";
// export default function Home() {
//   const [students, setStudents] = useState<{ id: number; name: string; email: string }[]>([]);
//   const [notifications, setNotifications] = useState<{ id: number; message: string; student: string }[]>([]);
//   const [message, setMessage] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [predefinedNotifications, setPredefinedNotifications] = useState<{ id: number; message: string }[]>([]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/notifications/predefined/")
//       .then((res) => res.json())
//       .then((data) => setPredefinedNotifications(data))
//       .catch((err) =>
//         console.error("Error fetching predefined notifications:", err)
//       );
//   }, []);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/notifications/students/")
//       .then((res) => res.json())
//       .then((data) => setStudents(data))
//       .catch((err) => console.error("Error fetching students:", err));
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/notifications/notes/");
//       const data = await res.json();
//       setNotifications(data);
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//     }
//   };

//   const sendNotes = async () => {
//     if (!message || !selectedStudent)
//       return setError("Please select a student and enter a message");

//     const res = await fetch("http://127.0.0.1:8000/notifications/notes/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ student: selectedStudent, message }),
//     });

//     if (res.ok) {
//       setMessage("");
//       fetchNotifications(); // Refresh the list
//       setError(null);
//     }
//   };

//   return (
//     <div className='p-8 max-w-2xl mx-auto space-y-6'>
//       {error && <p className='text-red-500 text-center'>{error}</p>}

//       <div className='bg-gray-100 p-4 rounded-lg'>
//         <h2 className='text-lg font-semibold'>إرسال ملاحظة</h2>
//         <select
//           className='border p-2 w-full my-2 rounded'
//           value={selectedStudent}
//           onChange={(e) => setSelectedStudent(e.target.value)}
//         >
//           <option value=''>اختر طالبًا</option>
//           {students.map((student) => (
//             <option key={student.id} value={student.id}>
//               {student.name}
//             </option>
//           ))}
//         </select>
//         <select
//           className='border p-2 w-full my-2 rounded'
//           onChange={(e) => setMessage(e.target.value)}
//         >
//           <option value=''>اختر إشعارًا جاهزًا</option>
//           {predefinedNotifications.map((notif) => (
//             <option key={notif.id} value={notif.message}>
//               {notif.message}
//             </option>
//           ))}
//         </select>
//         <textarea
//           placeholder='الرسالة'
//           className='border p-2 w-full my-2 rounded'
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button
//           onClick={sendNotes}
//           className='bg-green-500 text-white px-4 py-2 rounded w-full'
//         >
//           إرسال الإشعار
//         </button>
//       </div>

//       <div className='bg-gray-100 p-4 rounded-lg'>
//         <h2 className='text-lg font-semibold'>قائمة الطلاب</h2>
//         {students.length ? (
//           students.map((student) => (
//             <div key={student.id} className='border-b py-2'>
//               <p className='font-semibold'>{student.name}</p>
//               <p className='text-gray-600'>{student.email}</p>
//             </div>
//           ))
//         ) : (
//           <p className='text-gray-500'>لا يوجد طلاب بعد.</p>
//         )}
//       </div>

//       <div className='bg-gray-100 p-4 rounded-lg'>
//         <h2 className='text-lg font-semibold'>الإشعارات</h2>
//         <button
//           onClick={fetchNotifications}
//           className='bg-yellow-500 text-white px-4 py-2 rounded w-full mb-2'
//         >
//           تحديث الإشعارات
//         </button>
//         {notifications.length ? (
//           notifications.map((notif) => (
//             <p key={notif.id} className='border-b py-2'>
//               {notif.message} (طالب: {notif.student})
//             </p>
//           ))
//         ) : (
//           <p className='text-gray-500'>لا يوجد إشعارات.</p>
//         )}
//       </div>
//     </div>
//   );
// }


import type { Metadata } from "next"
import { SendNotificationForm } from "../../../components/dashboard_instructor/SendNotificationForm"
import "react-toastify/dist/ReactToastify.css"

export const metadata: Metadata = {
  title: "Send Notifications",
  description: "Send notifications to students",
}

export default function SendNotificationPage() {
  return (
    <div className="container py-10">

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Send Notification</h1>
        <p className="mb-8 text-muted-foreground">
          Use this form to send a notification to a specific student or an entire track.
        </p>
        <SendNotificationForm />
      </div>
    </div>
  )
}