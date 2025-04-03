"use client";  // Ensure it's a client component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";  // Use 'useParams' for dynamic params
import Cookies from "js-cookie";

const ExamPage = () => {
  const { id } = useParams();  // Get the dynamic 'id' from the URL
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;  // If 'id' is not available, return early

    const fetchExam = async () => {
      const token = Cookies.get('token');
      try {
        const response = await fetch(`http://127.0.0.1:8000/exam/exams/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setExam(data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!exam) return <div>Exam not found</div>;

  return (
    <div>
      <h1>Exam: {exam.title}</h1>
      <p>Duration: {exam.duration} minutes</p>
      {/* Display other exam details */}
    </div>
  );
};

export default ExamPage;
