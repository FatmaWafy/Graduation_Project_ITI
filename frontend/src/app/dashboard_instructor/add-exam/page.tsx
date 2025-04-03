"use client";

import { useState, useEffect } from "react";

interface Question {
  id: number;
  type: "mcq" | "code";
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string; // 'A', 'B', 'C', or 'D'
  difficulty: "Easy" | "Medium" | "Hard";
  source?: string;
  points?: number;
  code?: string; // For code questions
}

export default function AddExamPage() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: Date.now(),
      type: "mcq",
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: "A",
      difficulty: "Easy",
      source: "exam_ui",
      points: 1.0,
    },
  ]);

  // Added for fetching and filtering questions
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questionType, setQuestionType] = useState<"mcq" | "code">("mcq");
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState<boolean>(false);
  const [examTitle, setExamTitle] = useState<string>("");
  const [examDuration, setExamDuration] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to get token from cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token" || name === "authToken") {
        return value;
      }
    }
    return null;
  };

  // Fetch questions based on selected type
  useEffect(() => {
    fetchQuestions();
  }, [questionType]);

  // Function to fetch questions from the API based on type
  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getTokenFromCookies();

      if (!token) {
        throw new Error("No authentication token found in cookies");
      }

      // Choose URL based on question type
      const url =
        questionType === "mcq"
          ? "http://127.0.0.1:8000/exam/questions/"
          : "http://127.0.0.1:8000/exam/code-questions/";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAllQuestions(data);
    } catch (err) {
      setError(
        `Failed to fetch questions: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      console.error("Failed to fetch questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter questions based on selected difficulty
  const filteredQuestions =
    selectedDifficulty === "all"
      ? allQuestions
      : allQuestions.filter((q) => q.difficulty === selectedDifficulty);

  // Limit displayed questions unless "Show More" is clicked
  const displayedQuestions = showAllQuestions
    ? filteredQuestions
    : filteredQuestions.slice(0, 4);

  const handleTypeChange = (index: number, type: "mcq" | "code") => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      type,
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_option: "A",
      code: type === "code" ? "" : undefined,
    };
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question_text = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    index: number,
    field: "option_a" | "option_b" | "option_c" | "option_d",
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].correct_option = value;
    setQuestions(updatedQuestions);
  };

  const handleCodeChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].code = value;
    setQuestions(updatedQuestions);
  };

  const handleDifficultyChange = (
    index: number,
    value: "Easy" | "Medium" | "Hard"
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].difficulty = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        type: "mcq",
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: "A",
        difficulty: "Easy",
        source: "exam_ui",
        points: 1.0,
      },
    ]);
  };

  // Function to add a question from the database to the exam
  const addQuestionToExam = (question: Question) => {
    if (!selectedQuestions.some((q) => q.id === question.id)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  // Function to remove a question from selected questions
  const removeSelectedQuestion = (questionId: number) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q.id !== questionId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isSubmitting) return; // Prevent double submission
  
    setIsSubmitting(true); // Lock submission
  
    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("No authentication token found in cookies");
      }
  
      if (!examTitle.trim()) {
        alert("Please enter an exam title");
        return;
      }
  
      // Prepare the exam data
      const examData = {
        title: examTitle,
        duration: examDuration,
        questions: [
          ...selectedQuestions,
          ...questions.filter((q) => q.question_text.trim() !== ""),
        ],
      };
  
      // First submit MCQ questions (if any)
      const mcqQuestions = questions
        .filter((q) => q.type === "mcq" && q.question_text.trim() !== "")
        .map((q) => ({
          question_text: q.question_text[0], // Ensure it's not an array
          option_a: q.option_a[0],           // Ensure it's not an array
          option_b: q.option_b[0],           // Ensure it's not an array
          option_c: q.option_c[0],           // Ensure it's not an array
          option_d: q.option_d[0],           // Ensure it's not an array
          correct_option: q.correct_option[0], // Ensure it's not an array
          difficulty: q.difficulty[0],        // Ensure it's not an array
          source: "exam_ui",
          points: q.points || 1.0,
        }));
  
      const mcqData = { questions: mcqQuestions }; // Wrap the questions in a "questions" key
  
      if (mcqQuestions.length > 0) {
        const mcqResponse = await fetch(
          "http://127.0.0.1:8000/exam/mcq-questions/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(mcqData), // Send as a wrapped object
          }
        );
  
        const mcqErrorData = await mcqResponse.json().catch(() => ({}));
        console.log("MCQ Questions Payload:", mcqData);
        if (!mcqResponse.ok) {
          console.error("MCQ Submission Error:", mcqErrorData);
          throw new Error(mcqErrorData.message || "Failed to submit MCQ questions");
        }
      }
  
      // Then submit the exam
      const examResponse = await fetch("http://127.0.0.1:8000/exam/exams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
      });
  
      if (!examResponse.ok) {
        const errorData = await examResponse.json().catch(() => ({}));
        console.error("Exam Submission Error:", errorData);
        throw new Error(errorData.message || "Failed to submit exam");
      }
  
      alert("Exam submitted successfully!");
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert(
        `Error submitting exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false); // Unlock submission
  
      // Reset the state after successful submission
      setSelectedQuestions([]);
      setQuestions([
        {
          id: Date.now(),
          type: "mcq",
          question_text: "",
          option_a: "",
          option_b: "",
          option_c: "",
          option_d: "",
          correct_option: "A",
          difficulty: "Easy",
          points: 1.0,
        },
      ]);
      setExamTitle("");
      setExamDuration(60);
      setShowCreateQuestion(false);
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">
        📝 Add Exam Questions
      </h2>

      {/* Exam Information Section */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-4">Exam Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Exam Title</label>
            <input
              type="text"
              placeholder="Enter exam title"
              className="input input-bordered w-full"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              placeholder="Enter duration"
              className="input input-bordered w-full"
              value={examDuration}
              onChange={(e) => setExamDuration(Number(e.target.value))}
              min="1"
              required
            />
          </div>
        </div>
      </div>

      {/* Question Bank Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Question Bank</h3>

        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 items-center">
            <div>
              <label className="font-medium mr-2">Filter by Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="select select-bordered"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="font-medium mr-2">Question Type:</label>
              <select
                value={questionType}
                onChange={(e) =>
                  setQuestionType(e.target.value as "mcq" | "code")
                }
                className="select select-bordered"
              >
                <option value="mcq">MCQ</option>
                <option value="code">Code</option>
              </select>
            </div>
          </div>

          <button onClick={fetchQuestions} className="btn btn-outline btn-sm">
            🔄 Refresh Questions
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading questions...</div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th>Question</th>
                  <th>Type</th>
                  <th>Difficulty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No questions found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  displayedQuestions.map((question) => (
                    <tr key={question.id} className="border-t">
                      <td className="max-w-md truncate">
                        {question.question_text}
                      </td>
                      <td>{questionType === "mcq" ? "mcq" : "Code"}</td>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            question.difficulty === "Easy"
                              ? "bg-green-100 text-green-800"
                              : question.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => addQuestionToExam(question)}
                          className="btn btn-primary btn-sm"
                          disabled={selectedQuestions.some(
                            (q) => q.id === question.id
                          )}
                        >
                          Add to Exam
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Show More / Show Less Button */}
            {filteredQuestions.length > 4 && (
              <div className="text-center py-3 border-t">
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="btn btn-sm btn-ghost"
                >
                  {showAllQuestions
                    ? "Show Less"
                    : `Show More (${filteredQuestions.length - 4} more)`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Questions Section */}
      {selectedQuestions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Selected Questions</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            {selectedQuestions.map((question) => (
              <div
                key={question.id}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="font-medium">{question.question_text}</div>
                  <div className="text-sm text-gray-600">
                    Type: {questionType === "mcq" ? "mcq" : "Code"} |
                    Difficulty:{" "}
                    <span
                      className={`${
                        question.difficulty === "Easy"
                          ? "text-green-600"
                          : question.difficulty === "Medium"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeSelectedQuestion(question.id)}
                  className="btn btn-error btn-sm ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle for Custom Question Creation */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowCreateQuestion(!showCreateQuestion)}
          className="btn btn-outline w-full"
        >
          {showCreateQuestion
            ? "Hide Question Creator"
            : "Create Custom Questions"}
        </button>
      </div>

      {/* Create Custom Questions Section - only shown when toggled */}
      {showCreateQuestion && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Create Custom Questions
          </h3>
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="p-4 border rounded-lg shadow-md bg-gray-50 space-y-4"
              >
                <select
                  className="select select-bordered w-full"
                  value={q.type}
                  onChange={(e) =>
                    handleTypeChange(qIndex, e.target.value as "mcq" | "code")
                  }
                >
                  <option value="mcq">Multiple Choice Question</option>
                  <option value="code">Code Editor Question</option>
                </select>

                <input
                  type="text"
                  placeholder="Enter the question"
                  className="input input-bordered w-full"
                  value={q.question_text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />

                {q.type === "mcq" && (
                  <div className="space-y-2">
                    <div>
                      <label className="block font-medium">Difficulty:</label>
                      <select
                        value={q.difficulty}
                        onChange={(e) =>
                          handleDifficultyChange(
                            qIndex,
                            e.target.value as "Easy" | "Medium" | "Hard"
                          )
                        }
                        className="select select-bordered w-full"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {["A", "B", "C", "D"].map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correct_option === option}
                            onChange={() =>
                              handleCorrectAnswerChange(qIndex, option)
                            }
                          />
                          <input
                            type="text"
                            placeholder={`Option ${option}`}
                            className="input input-bordered w-full"
                            value={
                              q[
                                `option_${option.toLowerCase()}` as keyof Question
                              ] as string
                            }
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                `option_${option.toLowerCase()}` as
                                  | "option_a"
                                  | "option_b"
                                  | "option_c"
                                  | "option_d",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {q.type === "code" && (
                  <textarea
                    placeholder="Enter the code question"
                    className="textarea textarea-bordered w-full h-28"
                    value={q.code || ""}
                    onChange={(e) => handleCodeChange(qIndex, e.target.value)}
                  />
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="btn btn-outline btn-primary w-full"
            >
              ➕ Add Another Question
            </button>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-500 transition-all duration-300 shadow-md"
      >
        Submit Exam
      </button>
    </div>
  );
}
