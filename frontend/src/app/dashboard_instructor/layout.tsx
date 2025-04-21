 

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation"; // استيراد useRouter
// import Cookies from "js-cookie";
// import Link from "next/link";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import { LogOut, Menu, X, ChevronLeft } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { jwtDecode } from "jwt-decode";
// import { getClientSideToken } from "@/lib/cookies";

// export default function InstructorLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter(); // إضافة useRouter للتوجيه
//   const [role, setRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [user, setUser] = useState({
//     name: "Instructor",
//     email: "",
//     avatar: "",
//   });

//   interface InstructorData {
//     username: string;
//     email: string;
//     profile_image?: string;
//   }

//   const [instructorData, setInstructorData] = useState<InstructorData | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch role
//         const storedRole = Cookies.get("role");
//         if (!storedRole) {
//           throw new Error("Role not found");
//         }
//         setRole(storedRole);

//         // Fetch instructor data
//         const token = getClientSideToken();
//         if (!token) {
//           throw new Error("Token not found");
//         }

//         const decoded: any = jwtDecode(token);
//         const userId = decoded.user_id;

//         console.log("User ID from token in Dashboard:", userId);

//         const res = await fetch(
//           `http://127.0.0.1:8000/users/instructors/${userId}/`,
//           {
//             headers: {
//               "Authorization": `Bearer ${token}`, // إضافة رأس التوثيق
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.error || "Failed to fetch instructor data");
//         }

//         const data: InstructorData = await res.json();
//         setInstructorData(data);
//         console.log("Instructor data fetched:", data);

//         // Update user state with fetched data
//         setUser({
//           name: data.username || "Instructor",
//           email: data.email || "",
//           avatar: data.profile_image || "",
//         });
//       } catch (error: any) {
//         console.error("Error fetching data:", error.message);
//         setInstructorData(null);
//         router.push("/signin"); // توجيه المستخدم إلى صفحة تسجيل الدخول إذا فشل جلب البيانات
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]); // إضافة router كـ dependency

//   const handleLogout = () => {
//     Cookies.remove("role");
//     Cookies.remove("token");
//     Cookies.remove("user");
//     window.location.href = "/";
//   };

//   if (loading) {
//     return (
//       <div className='flex justify-center items-center h-64'>
//         <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
//       </div>
//     );
//   }

//   if (role !== "instructor") {
//     return <p className='text-red-500 text-center mt-10'>Access Denied</p>;
//   }

//   return (
//     <div className='flex min-h-screen'>
//       {/* Sidebar */}
//       <aside
//         className={`${
//           sidebarOpen ? "w-64" : "w-16"
//         } fixed top-0 left-0 h-screen border-r p-4 flex flex-col z-50 transition-all duration-300 bg-white text-black`}
//       >
//         <div className='flex justify-between items-center mb-6 border-b'>
//           {sidebarOpen && (
//             <h2 className='text-xl font-bold text-center w-full pb-3'>
//               Instructor Portal
//             </h2>
//           )}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className='text-[#007acc] focus:outline-none flex items-center mb-2'
//           >
//             <ChevronLeft
//               className={`h-6 w-6 transition-transform ${
//                 sidebarOpen ? "" : "rotate-180"
//               }`}
//             />
//           </button>
//         </div>

//         <nav className='flex flex-col gap-2 flex-1'>
//           {[
//             { href: "/dashboard_instructor", label: "Dashboard" },
//             { href: "/dashboard_instructor/create-exam", label: "Create Exam" },
//             { href: "/dashboard_instructor/set-exam", label: "Set Exam" },
//             { href: "/dashboard_instructor/exam_logs", label: "Exam Logs" },
//             { href: "/dashboard_instructor/uploadLabs", label: "Upload Labs" },
//             { href: "/dashboard_instructor/add-note", label: "Send Note" },
//             { href: "/dashboard_instructor/grades", label: "Grades" },
//             {
//               href: "/dashboard_instructor/students",
//               label: "Student Management",
//             },
//             {
//               href: "/dashboard_instructor/Scrapping",
//               label: "Student Progress",
//             },
//             { href: "/dashboard_instructor/profile", label: "Profile" },
//           ].map((item, idx) => (
//             <Link href={item.href} key={idx}>
//               <p className='bg-[#007acc] hover:bg-[#007abc] text-white rounded-md text-center flex items-center gap-3 px-3 py-2 text-sm transition-colors'>
//                 {sidebarOpen ? item.label : item.label[0]}
//               </p>
//             </Link>
//           ))}
//         </nav>

//         <div className='mt-auto pt-4 border-t border-t'>
//           <div className='flex items-center gap-3'>
//             {/* Always render the Avatar */}
//             {instructorData ? (
//               <Avatar>
//                 <AvatarImage
//                   src={
//                     instructorData.profile_image?.startsWith("http")
//                       ? instructorData.profile_image
//                       : instructorData.profile_image
//                       ? `http://127.0.0.1:8000${instructorData.profile_image}`
//                       : ""
//                   }
//                   alt={instructorData.username}
//                 />
//                 <AvatarFallback>
//                   {instructorData.username.charAt(0)}
//                 </AvatarFallback>
//               </Avatar>
//             ) : (
//               <Avatar>
//                 <AvatarImage src='' alt='Instructor' />
//                 <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
//               </Avatar>
//             )}
//             {/* Render username and email only when sidebar is open */}
//             {sidebarOpen && (
//               <>
//                 {instructorData ? (
//                   <div className='flex flex-1 flex-col overflow-hidden'>
//                     <span className='text-sm font-medium leading-none text-sidebar-foreground'>
//                       {instructorData.username}
//                     </span>
//                     <span className='text-xs text-muted-foreground'>
//                       {instructorData.email}
//                     </span>
//                   </div>
//                 ) : (
//                   <div className='flex-1'>
//                     <p className='text-sm font-medium'>{user.name}</p>
//                     <p className='text-xs text-gray-400'>{user.email}</p>
//                   </div>
//                 )}
//                 {/* Render logout button only when sidebar is open */}
//                 <Button
//                   variant='ghost'
//                   size='icon'
//                   onClick={handleLogout}
//                   className='text-[#007acc] hover:text-[#007abc]'
//                 >
//                   <LogOut className='h-5 w-5' />
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main
//         className={`flex-1 p-6 rounded-xl transition-all duration-300 ${
//           sidebarOpen ? "ml-64" : "ml-16"
//         }`}
//       >
//         {children}
//         <ToastContainer />
//       </main>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LogOut, Menu, X, ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import { getClientSideToken } from "@/lib/cookies";

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // إضافة حالة للخطأ
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({
    name: "Instructor",
    email: "",
    avatar: "",
  });

  interface InstructorData {
    username: string;
    email: string;
    profile_image?: string;
  }

  const [instructorData, setInstructorData] = useState<InstructorData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch role
        const storedRole = Cookies.get("role");
        if (!storedRole) {
          throw new Error("Role not found");
        }
        setRole(storedRole);

        // Fetch instructor data
        const token = getClientSideToken();
        if (!token) {
          throw new Error("Token not found");
        }

        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;

        console.log("User ID from token in Dashboard:", userId);

        const res = await fetch(
          `http://127.0.0.1:8000/users/instructors/${userId}/`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch instructor data");
        }

        const data: InstructorData = await res.json();
        setInstructorData(data);
        console.log("Instructor data fetched:", data);

        // Update user state with fetched data
        setUser({
          name: data.username || "Instructor",
          email: data.email || "",
          avatar: data.profile_image || "",
        });
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
        setError(error.message); // تعيين رسالة الخطأ
        setInstructorData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("role");
    Cookies.remove("token");
    Cookies.remove("user");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <p className='text-red-500 text-lg mb-4'>{error}</p>
          <Button
            onClick={() => router.push("/signin")}
            className='bg-[#007acc] hover:bg-[#007abc] text-white'
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (role !== "instructor") {
    return <p className='text-red-500 text-center mt-10'>Access Denied</p>;
  }

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } fixed top-0 left-0 h-screen border-r p-4 flex flex-col z-50 transition-all duration-300 bg-white text-black`}
      >
        <div className='flex justify-between items-center mb-6 border-b'>
          {sidebarOpen && (
            <h2 className='text-xl font-bold text-center w-full pb-3'>
              Instructor Portal
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='text-[#007acc] focus:outline-none flex items-center mb-2'
          >
            <ChevronLeft
              className={`h-6 w-6 transition-transform ${
                sidebarOpen ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        <nav className='flex flex-col gap-2 flex-1'>
          {[
            { href: "/dashboard_instructor", label: "Dashboard" },
            { href: "/dashboard_instructor/create-exam", label: "Create Exam" },
            { href: "/dashboard_instructor/set-exam", label: "Set Exam" },
            { href: "/dashboard_instructor/exam_logs", label: "Exam Logs" },
            { href: "/dashboard_instructor/uploadLabs", label: "Upload Labs" },
            { href: "/dashboard_instructor/add-note", label: "Send Note" },
            { href: "/dashboard_instructor/grades", label: "Grades" },
            {
              href: "/dashboard_instructor/students",
              label: "Student Management",
            },
            {
              href: "/dashboard_instructor/Scrapping",
              label: "Student Progress",
            },
            { href: "/dashboard_instructor/profile", label: "Profile" },
          ].map((item, idx) => (
            <Link href={item.href} key={idx}>
              <p className='bg-[#007acc] hover:bg-[#007abc] text-white rounded-md text-center flex items-center gap-3 px-3 py-2 text-sm transition-colors'>
                {sidebarOpen ? item.label : item.label[0]}
              </p>
            </Link>
          ))}
        </nav>

        <div className='mt-auto pt-4 border-t border-t'>
          <div className='flex items-center gap-3'>
            {/* Always render the Avatar */}
            {instructorData ? (
              <Avatar>
                <AvatarImage
                  src={
                    instructorData.profile_image?.startsWith("http")
                      ? instructorData.profile_image
                      : instructorData.profile_image
                      ? `http://127.0.0.1:8000${instructorData.profile_image}`
                      : ""
                  }
                  alt={instructorData.username}
                />
                <AvatarFallback>
                  {instructorData.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar>
                <AvatarImage src='' alt='Instructor' />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            {/* Render username and email only when sidebar is open */}
            {sidebarOpen && (
              <>
                {instructorData ? (
                  <div className='flex flex-1 flex-col overflow-hidden'>
                    <span className='text-sm font-medium leading-none text-sidebar-foreground'>
                      {instructorData.username}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {instructorData.email}
                    </span>
                  </div>
                ) : (
                  <div className='flex-1'>
                    <p className='text-sm font-medium'>{user.name}</p>
                    <p className='text-xs text-gray-400'>{user.email}</p>
                  </div>
                )}
                {/* Render logout button only when sidebar is open */}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handleLogout}
                  className='text-[#007acc] hover:text-[#007abc]'
                >
                  <LogOut className='h-5 w-5' />
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 rounded-xl transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
        <ToastContainer />
      </main>
    </div>
  );
}