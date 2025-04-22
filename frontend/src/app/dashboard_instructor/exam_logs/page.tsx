// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { FileText } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";

// interface InstructorData {
//   id: number;
//   // Add other properties based on the API response
// }
// interface Exam {
//   temp_exam_id: number;
//   exam_title: string;
// }

// export default function ExamLogsIndexPage() {
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [user, setUser] = useState<{ instructor_id?: number }>({});

//   const getInstructorId = () => {
//     const instructorId = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("instructor_id="))
//       ?.split("=")[1];
//     return instructorId || null;
//   };

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const token = Cookies.get("token");
//         if (!token) throw new Error("Token not found");

//         const decoded: any = jwtDecode(token);
//         const userId = decoded.user_id;

//         // First fetch - get instructor data
//         const instructorResponse = await fetch(
//           `http://127.0.0.1:8000/users/instructors/${userId}/`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!instructorResponse.ok) {
//           throw new Error(
//             `Failed to fetch instructor data: ${instructorResponse.status}`
//           );
//         }

//         const instructorData = await instructorResponse.json();
//         setUser({ instructor_id: instructorData.id });

//         // Second fetch - get exams
//         const examsUrl = `http://127.0.0.1:8000/exam/temp-exams/get_exam_info/?instructor_id=${instructorData.id}`;
//         const examsResponse = await fetch(examsUrl, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!examsResponse.ok) {
//           throw new Error(`Failed to fetch exams: ${examsResponse.status}`);
//         }

//         const responseData = await examsResponse.json();

//         // Handle both array and single object responses
//         const examsData = Array.isArray(responseData)
//           ? responseData
//           : [responseData]; // Wrap single object in array

//         setExams(examsData);
//       } catch (error) {
//         console.error("Fetch error:", error);
//         setError(
//           error instanceof Error ? error.message : "An unknown error occurred"
//         );
//         setExams([]); // Ensure exams is always an array
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExams();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {exams.map((exam) => (
//         <Card
//           key={exam.temp_exam_id}
//           className="hover:shadow-lg transition-shadow duration-300"
//         >
//           <CardHeader className="bg-gray-100 rounded-t-lg">
//             <CardTitle className="text-lg font-semibold text-[#000000]">
//               {exam.exam_title}
//             </CardTitle>
//             <CardDescription className="text-sm text-gray-600">
//               Exam ID: {exam.temp_exam_id}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="flex justify-center py-4">
//             <Link
//               href={`/dashboard_instructor/exam_logs/${exam.temp_exam_id}`}
//               passHref
//             >
//               <Button className="bg-[#007acc] hover:bg-[#007abc] text-white px-6 py-2 rounded-md">
//                 View Logs
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface InstructorData {
  id: number;
}

interface Exam {
  temp_exam_id: number;
  exam_title: string;
}

export default function ExamLogsIndexPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ instructor_id?: number }>({});

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = Cookies.get("token");
        if (!token) throw new Error("Token not found");

        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;

        const instructorResponse = await fetch(
          `http://127.0.0.1:8000/users/instructors/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!instructorResponse.ok) {
          throw new Error(
            `Failed to fetch instructor data: ${instructorResponse.status}`
          );
        }

        const instructorData = await instructorResponse.json();
        setUser({ instructor_id: instructorData.id });

        const examsUrl = `http://127.0.0.1:8000/exam/temp-exams/get_exam_info/?instructor_id=${instructorData.id}`;
        const examsResponse = await fetch(examsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!examsResponse.ok) {
          throw new Error(`Failed to fetch exams: ${examsResponse.status}`);
        }

        const responseData = await examsResponse.json();
        const examsData = Array.isArray(responseData)
          ? responseData
          : [responseData];

        setExams(examsData);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="container mx-auto py-10 px-4  text-white bg-white">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-blue-400">
          <FileText className="h-8 w-8" />
          Exam Cheating Logs
        </h1>
        <p className="text-gray-400 mt-1">
          Select an exam to view its logs
        </p>
      </div>
    </div>
  
    {loading ? (
      <div className="flex flex-col justify-center items-center h-40 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-gray-400">Loading exam logs...</p>
      </div>
    ) : error ? (
      <div className="text-center text-red-400">Error: {error}</div>
    ) : exams.length === 0 ? (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
        <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-200 mb-2">No Exams Found</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-6">
          There are no exams available to view logs for.
        </p>
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card
            key={exam.temp_exam_id}
            className="border border-gray-700 hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="bg-[#111827] pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-white">
                  {exam.exam_title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-400">
                  Exam ID: {exam.temp_exam_id}
                </CardDescription>
              </div>
            </CardHeader>
  
            <CardContent className="py-4 flex justify-end">
              <Link
                href={`/dashboard_instructor/exam_logs/${exam.temp_exam_id}`}
                passHref
              >
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  View Logs <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
  
  );
}
