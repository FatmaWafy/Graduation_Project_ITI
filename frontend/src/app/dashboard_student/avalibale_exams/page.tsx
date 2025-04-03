"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link"; // استيراد Link من Next.js

export default function StudentDashboardPage() {
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      const token = Cookies.get("token");
      try {
        const response = await fetch("http://127.0.0.1:8000/exam/exams/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Exams data:", data);

        if (Array.isArray(data)) {
          setExams(data);
        } else {
          console.error("Exams data is not in the expected format", data);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
        📝 Your Exams
      </h2>
      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="flex justify-between items-center p-4 border rounded-lg shadow-md bg-gray-50"
          >
            <div>
              <h3 className="text-xl font-semibold">{exam.title}</h3>
              <p className="text-sm text-gray-600">
                Duration: {exam.duration} minutes
              </p>
            </div>

            <Link href={`/dashboard_student/exam/${exam.id}`}>
              <button className="btn btn-primary">Start Now</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
