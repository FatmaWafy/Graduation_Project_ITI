"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AlarmClock } from "lucide-react";
import StudentMonitor from "../../../../components/monitoring/student-monitor"; // استيراد الكومبوننت الجديد

const ExamPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const optionMap: { [key: string]: string } = {
    option_a: "A",
    option_b: "B",
    option_c: "C",
    option_d: "D",
  };

  useEffect(() => {
    if (!id) return;

    const fetchExamData = async () => {
      const token = Cookies.get("token");

      try {
        setLoading(true);

        const tempExamRes = await fetch(`http://127.0.0.1:8000/exam/temp-exams/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!tempExamRes.ok) throw new Error("Failed to fetch temp exam");
        const tempExamData = await tempExamRes.json();

        const originalExamId = tempExamData.exam;

        const examRes = await fetch(`http://127.0.0.1:8000/exam/exams/${originalExamId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!examRes.ok) throw new Error("Failed to fetch original exam");
        const examData = await examRes.json();

        setExam(examData);
        setRemainingTime(examData.duration * 60 || 0);

        const questionsRes = await fetch(
          `http://127.0.0.1:8000/exam/exam/temp-exams/${id}/questions/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!questionsRes.ok) throw new Error("Failed to fetch questions");
        const questionsData = await questionsRes.json();

        setQuestions(Array.isArray(questionsData) ? questionsData : []);

        const stored = localStorage.getItem(`submitted_exam_${id}`);
        setIsSubmitted(stored === "true");
      } catch (error) {
        console.error("Error fetching exam or questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [id]);

  useEffect(() => {
    if (remainingTime <= 0) {
      setIsSubmitted(true);
    }

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleOptionChange = (questionId: number, selectedOption: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionMap[selectedOption],
    }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("token");

    if (isSubmitted) {
      alert("You have already submitted this exam.");
      return;
    }

    if (remainingTime === 0) {
      alert("Time is over. You cannot submit.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/exam/exams/submit-exam-answer/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            exam_instance: id,
            mcq_answers: selectedAnswers,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSubmissionStatus(`Exam submitted successfully. Your score: ${result.score}`);
        setShowResultModal(true);
        setIsSubmitted(true);
        localStorage.setItem(`submitted_exam_${id}`, "true");
      } else {
        const errorText = await response.text();
        setSubmissionStatus(`Error: ${errorText}`);
      }
    } catch (error) {
      setSubmissionStatus("Error submitting the exam. Please try again.");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setShowResultModal(false);
    router.push("/dashboard_student/exams");
  };

  if (loading) return <div>Loading...</div>;
  if (!exam) return <div>Exam not found</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-2xl shadow-xl max-w-4xl">
      <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 drop-shadow-lg">
        {exam.title}
      </h1>

      <p className="text-xl text-center mb-2 text-gray-700 font-semibold">
        Duration: {exam.duration} minutes
      </p>

      <div className="flex justify-center items-center gap-2 text-lg text-red-600 font-bold mb-6">
        <AlarmClock className="w-6 h-6" />
        Time Remaining: {formatTime(remainingTime)}
      </div>

      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <div
              key={question.id}
              className="bg-gray-50 p-5 rounded-xl shadow-lg border border-gray-200"
            >
              <p className="text-xl font-semibold mb-3 text-blue-800">{question.question_text}</p>
              <div className="space-y-2">
                {["option_a", "option_b", "option_c", "option_d"].map((key, index) => (
                  <label key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={key}
                      checked={selectedAnswers[question.id] === optionMap[key]}
                      onChange={() => handleOptionChange(question.id, key)}
                      className="accent-blue-500"
                      disabled={isSubmitted}
                    />
                    <span className="text-gray-800">{question[key]}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No questions available</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitted || remainingTime === 0}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitted ? "Already Submitted" : "Submit Exam"}
        </button>
      </div>

      {submissionStatus && (
        <div className="mt-6 text-center text-green-600 font-bold text-lg">
          {submissionStatus}
        </div>
      )}

      {showResultModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Exam Result</h2>
            <p className="text-lg text-center mb-6">{submissionStatus}</p>
            <div className="flex justify-center">
              <button
                onClick={handleModalClose}
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    <StudentMonitor examId={id} /> {/* Pass the dynamic exam ID */}

    </div>
  );
};

export default ExamPage;
