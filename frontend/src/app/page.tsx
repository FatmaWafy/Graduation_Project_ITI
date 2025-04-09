"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";  // استيراد useRouter من Next.js

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // توجيه المستخدم مباشرة إلى صفحة Sign In
    router.push('/signin');  // هنا تشير إلى المسار الذي توجد فيه صفحة تسجيل الدخول
  }, [router]);
}
// export default function Home() {
//   const [tasks, setTasks] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState("");
//   const [error, setError] = useState(null);

  // const [predefinedNotifications, setPredefinedNotifications] = useState([]);

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/notifications/predefined/")
  //     .then((res) => res.json())
  //     .then((data) => setPredefinedNotifications(data))
  //     .catch((err) =>
  //       console.error("Error fetching predefined notifications:", err)
  //     );
  // }, []);

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/api/tasks/")
  //     .then((res) => res.json())
  //     .then((data) => setTasks(data))
  //     .catch((err) => setError("Failed to fetch tasks"));
  // }, []);

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/notifications/students/")
  //     .then((res) => res.json())
  //     .then((data) => setStudents(data))
  //     .catch((err) => console.error("Error fetching students:", err));
  // }, []);

//   const fetchNotifications = async () => {
//     try {
//       const res = await fetch(
//         "http://127.0.0.1:8000/notifications/notes/"
//       );
//       const data = await res.json();
//       setNotifications(data);
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//     }
//   };

//   const addStudent = async () => {
//     if (!name || !email) return setError("Please enter name and email");

//     const res = await fetch("http://127.0.0.1:8000/notifications/students/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email }),
//     });

//     if (res.ok) {
//       const newStudent = await res.json();
//       setStudents([...students, newStudent]);
//       setName("");
//       setEmail("");
//       setError(null);
//     }
//   };

//   const sendNotes = async () => {
//     if (!message || !selectedStudent)
//       return setError("Please select a student and enter a message");

//     const res = await fetch(
//       "http://127.0.0.1:8000/notifications/notes/",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ student: selectedStudent, message }),
//       }
//     );

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
//         <h2 className='text-lg font-semibold'>قائمة المهام</h2>
//         {tasks.length ? (
//           <ul className='mt-2 space-y-2'>
//             {tasks.map((task) => (
//               <li key={task.id} className='border p-2 rounded'>
//                 {task.title} - {task.completed ? "✅ مكتمل" : "❌ غير مكتمل"}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className='text-gray-500'>⏳ جاري تحميل البيانات...</p>
//         )}
//       </div>

//       <div className='bg-gray-100 p-4 rounded-lg'>
//         <h2 className='text-lg font-semibold'>إضافة طالب جديد</h2>
//         <input
//           type='text'
//           placeholder='الاسم'
//           className='border p-2 w-full my-2 rounded'
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type='email'
//           placeholder='الإيميل'
//           className='border p-2 w-full my-2 rounded'
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <button
//           onClick={addStudent}
//           className='bg-blue-500 text-white px-4 py-2 rounded w-full'
//         >
//           إضافة الطالب
//         </button>
//       </div>

//       {/* <div className='bg-gray-100 p-4 rounded-lg'>
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
//       </div> */}

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
