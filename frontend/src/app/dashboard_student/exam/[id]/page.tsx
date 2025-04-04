"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use 'useParams' for dynamic params
import Cookies from "js-cookie";

const ExamPage = () => {
  const { id } = useParams(); // Get the dynamic 'id' from the URL
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]); // Store exam questions
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0); // Timer state
  const [selectedAnswers, setSelectedAnswers] = useState<any>({}); // Store selected answers
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null); // Show submission status
  const [showResultModal, setShowResultModal] = useState(false); // Modal visibility

  const optionMap: { [key: string]: string } = {
    option_a: "A",
    option_b: "B",
    option_c: "C",
    option_d: "D",
  };

  useEffect(() => {
    if (!id) return; // Return early if 'id' is missing
    console.log("Exam ID:", id); // Debugging line

    const fetchExamData = async () => {
      const token = Cookies.get("token");
    
      try {
        console.log("Fetching exam data...");
        const examResponse = await fetch(`http://127.0.0.1:8000/exam/exams/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!examResponse.ok) throw new Error("Failed to fetch exams");
    
        const examsData = await examResponse.json();
        const examData = examsData.find((exam: any) => exam.id === parseInt(id));
        if (!examData) throw new Error("Exam not found");
    
        setExam(examData);
    
        if (typeof examData.duration === "number" && !isNaN(examData.duration)) {
          setRemainingTime(examData.duration * 60); // Convert to seconds
        } else {
          setRemainingTime(0); // Set to 0 if duration is invalid
        }
    
        console.log("Fetching questions...");
        const questionsResponse = await fetch(
          `http://127.0.0.1:8000/exam/exam/temp-exams/${id}/questions/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        if (!questionsResponse.ok) throw new Error("Failed to fetch questions");
    
        const questionsData = await questionsResponse.json();
        setQuestions(Array.isArray(questionsData) ? questionsData : []);
      } catch (error) {
        console.error("Error fetching exam or questions:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchExamData();
  }, [id]);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  if (loading) return <div>Loading...</div>;

  if (!exam) return <div>Exam not found</div>;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleOptionChange = (questionId: number, selectedOption: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionMap[selectedOption], // حفظ الإجابة كـ A أو B أو C أو D
    }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("token");

    const answers = selectedAnswers; // الإجابات تكون في الشكل الصحيح الآن

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
            mcq_answers: answers,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSubmissionStatus(
          `Exam submitted successfully. Your score: ${result.score}`
        );
        setShowResultModal(true); // Show result modal after successful submission
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
    setShowResultModal(false); // Close the modal when user clicks OK
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
        {exam.title}
      </h1>
      <p className="text-xl text-center mb-6">
        Duration: {exam.duration} minutes
      </p>
      <p className="text-xl text-center mb-6">
        Time Remaining: {formatTime(remainingTime)}
      </p>

      <div className="space-y-6">
        {questions.length > 0 ? (
          questions.map((question: any) => (
            <div
              key={question.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <p className="text-xl font-semibold">{question.question_text}</p>
              <div className="mt-4 space-y-2">
                {["option_a", "option_b", "option_c", "option_d"].map(
                  (optionKey, index) => {
                    const option = question[optionKey];
                    return (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`${question.id}-option-${optionKey}`}
                          name={`question-${question.id}`}
                          value={optionKey}
                          checked={selectedAnswers[question.id] === optionMap[optionKey]} // مقارنة الإجابة المخزنة مع الخيار
                          onChange={() => handleOptionChange(question.id, optionKey)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`${question.id}-option-${optionKey}`}
                          className="text-lg"
                        >
                          {option}
                        </label>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No questions available</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Submit Exam
        </button>
      </div>

      {/* Submission Status */}
      {submissionStatus && (
        <div className="mt-4 text-center text-xl text-green-600">
          {submissionStatus}
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold text-center mb-4">Exam Result</h2>
            <p className="text-lg text-center mb-6">{submissionStatus}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                OK
              </button>
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
