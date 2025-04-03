"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use 'useParams' for dynamic params
import Cookies from "js-cookie";

const ExamPage = () => {
  const { id } = useParams(); // Get the dynamic 'id' from the URL
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]); // To store the questions of the exam
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0); // Timer state
  const [selectedAnswers, setSelectedAnswers] = useState<any>({}); // Store selected answers
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null); // For showing submit status

  useEffect(() => {
    if (!id) return; // If 'id' is not available, return early

    const fetchExam = async () => {
      const token = Cookies.get("token");
      try {
        // Fetch exam details
        const response = await fetch(
          `http://127.0.0.1:8000/exam/temp-exams/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setExam(data);

        // Fetch questions related to this exam
        const questionsResponse = await fetch(
          `http://127.0.0.1:8000/exam/mcq-questions/?exam_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);

        // Set initial timer duration based on exam duration
        setRemainingTime(data.duration * 60); // Assuming duration is in minutes
      } catch (error) {
        console.error("Error fetching exam or questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  // Timer logic: counts down every second
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

  // Format the timer as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle answer selection
  const handleOptionChange = (questionId: number, selectedOption: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  // Submit exam answers
  const handleSubmit = async () => {
    const token = Cookies.get("token");
    const answers = {
      mcq_answers: selectedAnswers, // This is the structure you're sending to the backend
    };

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
            exam_instance: id, // Use the 'id' (exam instance ID) here instead of 'examInstanceId'
            mcq_answers: answers,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSubmissionStatus(
          `Exam submitted successfully. Your score: ${result.score}`
        );
      } else {
        const errorText = await response.text(); // Get error response as text
        setSubmissionStatus(`Error: ${errorText}`);
      }
    } catch (error) {
      setSubmissionStatus("Error submitting the exam. Please try again.");
      console.error(error);
    }
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
        {questions.map((question: any) => (
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
                        checked={selectedAnswers[question.id] === optionKey}
                        onChange={() =>
                          handleOptionChange(question.id, optionKey)
                        }
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
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md"
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
    </div>
  );
};

export default ExamPage;
