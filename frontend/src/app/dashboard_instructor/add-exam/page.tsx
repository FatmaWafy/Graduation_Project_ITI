"use client";

import type React from "react";

import { useState, useEffect } from "react";

interface Question {
  id: number;
  type: "mcq" | "code";
  question_text: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  correct_option?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  source?: string;
  points?: number;
  code?: string;
  language: string;
  title?: string;
  description?: string;
  starter_code?: string;
  tags?: any[];
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
      language: "Python",
    },
  ]);

  // Added for fetching and filtering questions
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [codingQuestions, setCodedQuestions] = useState<Question[]>([]);
  const [questionType, setQuestionType] = useState<"mcq" | "code">("mcq");
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState<boolean>(false);
  const [examTitle, setExamTitle] = useState<string>("");
  const [examDuration, setExamDuration] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Function to get token from cookies
  const getTokenFromCookies = () => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token" || name === "authToken") {
        return value;
      }
    }
    return null;
  };

  // Fetch questions based on selected type and language
  useEffect(() => {
    fetchQuestions();
  }, [questionType, selectedLanguage]);

  // Fix the fetchQuestions function to properly handle language filtering
  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getTokenFromCookies();

      if (!token) {
        throw new Error("No authentication token found in cookies");
      }

      // Choose URL based on question type
      const baseUrl =
        questionType === "mcq"
          ? "http://127.0.0.1:8000/exam/mcq-filter/"
          : "http://127.0.0.1:8000/exam/coding-filter/";

      // Try different parameter formats for language
      let url = baseUrl;
      if (selectedLanguage !== "all") {
        // Try exact match first (case sensitive as defined in your model)
        const languageMap: Record<string, string> = {
          python: "Python",
          javascript: "JavaScript",
          java: "Java",
          sql: "SQL",
        };

        const formattedLanguage =
          languageMap[selectedLanguage.toLowerCase()] || selectedLanguage;
        url = `${baseUrl}?language=${formattedLanguage}`;

        // Log the URL for debugging
        console.log("Fetching questions with URL:", url);
      }

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
      console.log("Fetched questions:", data);

      // Make sure each question has a type property and correct structure
      const questionsWithType = data.map((q: any) => {
        // Handle different field structures between MCQ and coding questions
        if (questionType === "code") {
          return {
            ...q,
            type: "code",
            question_text: q.title || q.question_text || "", // Use title for display if available
          };
        } else {
          return {
            ...q,
            type: "mcq",
          };
        }
      });

      setAllQuestions(questionsWithType);
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
    if (type === "mcq") {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
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
        language: updatedQuestions[index].language || "Python",
      };
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        type: "code",
        title: "",
        description: "",
        starter_code: "",
        difficulty: "Easy",
        source: "exam_ui",
        points: 1.0,
        language: updatedQuestions[index].language || "Python",
        tags: [],
      };
    }
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[index].type === "mcq") {
      updatedQuestions[index].question_text = value;
    } else {
      // For coding questions, update both title and description
      updatedQuestions[index].title = value;
      updatedQuestions[index].description = value;
      updatedQuestions[index].question_text = value; // For display purposes
    }
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
    updatedQuestions[index].starter_code = value; // Update to match model field name
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

  const handleLanguageChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].language = value;
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
        language: "Python",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  // Fix the addQuestionToExam function to properly handle different question types
  const addQuestionToExam = (question: Question) => {
    // Preserve the original question type from the fetched data
    const currentType = questionType;

    // Create a properly typed question object
    const questionWithType = {
      ...question,
      type: currentType, // Set type based on current filter
    };

    console.log(`Adding ${currentType} question to exam:`, questionWithType);

    if (currentType === "mcq") {
      // Check if this MCQ question is already added
      if (!selectedQuestions.some((q) => q.id === question.id)) {
        // Use functional update to ensure we're working with the latest state
        setSelectedQuestions((prevSelected) => [
          ...prevSelected,
          questionWithType,
        ]);
      }
    } else if (currentType === "code") {
      // Check if this coding question is already added
      if (!codingQuestions.some((q) => q.id === question.id)) {
        // Use functional update to ensure we're working with the latest state
        setCodedQuestions((prevCoding) => [...prevCoding, questionWithType]);
      }
    }
  };

  // Function to remove a question from selected questions
  const removeSelectedQuestion = (questionId: number, type: "mcq" | "code") => {
    if (type === "mcq") {
      setSelectedQuestions(
        selectedQuestions.filter((q) => q.id !== questionId)
      );
    } else {
      setCodedQuestions(codingQuestions.filter((q) => q.id !== questionId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setDebugInfo("Starting submission process...");

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Validate exam title
      if (!examTitle.trim()) {
        alert("Please enter an exam title");
        setIsSubmitting(false);
        return;
      }

      // Prepare new MCQ questions (only those with actual content)
      const newMCQs = questions
        .filter((q) => q.type === "mcq" && q.question_text.trim() !== "")
        .map((q) => ({
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c || "", // Ensure empty string if null
          option_d: q.option_d || "", // Ensure empty string if null
          correct_option: q.correct_option,
          difficulty: q.difficulty,
          source: "exam_ui",
          points: q.points || 1.0,
          language: q.language, // Include language field
        }));

      setDebugInfo(
        (prev) => prev + "\nPrepared MCQ questions: " + JSON.stringify(newMCQs)
      );

      // Prepare new coding questions - updated to match model fields
      const newCodingQuestions = questions
        .filter(
          (q) =>
            q.type === "code" &&
            ((q.title && q.title.trim() !== "") ||
              (q.question_text && q.question_text.trim() !== ""))
        )
        .map((q) => ({
          title: q.title || q.question_text, // Use title or question_text
          description: q.description || q.question_text, // Use description or question_text
          difficulty: q.difficulty,
          starter_code: q.starter_code || "", // Match model field name
          source: "exam_ui",
          points: q.points || 1.0,
          language: q.language,
          tags: q.tags || [], // Add default empty tags array
        }));

      setDebugInfo(
        (prev) =>
          prev +
          "\nPrepared coding questions: " +
          JSON.stringify(newCodingQuestions)
      );

      // Arrays to store newly created question IDs
      const createdMCQIds: number[] = [];
      const createdCodingIds: number[] = [];

      // First, create new MCQ questions if any
      if (newMCQs.length > 0) {
        for (const mcq of newMCQs) {
          try {
            const mcqResponse = await fetch(
              "http://127.0.0.1:8000/exam/mcq-questions/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(mcq),
              }
            );

            if (!mcqResponse.ok) {
              const errorData = await mcqResponse.json();
              console.error("Failed to create MCQ:", errorData);
              continue;
            }

            const createdQuestion = await mcqResponse.json();
            createdMCQIds.push(createdQuestion.id);
          } catch (error) {
            console.error("Error creating MCQ:", error);
          }
        }
      }

      // Create new coding questions if any
      if (newCodingQuestions.length > 0) {
        for (const codingQ of newCodingQuestions) {
          try {
            const codingResponse = await fetch(
              "http://127.0.0.1:8000/exam/code-questions/",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(codingQ),
              }
            );

            if (!codingResponse.ok) {
              const errorData = await codingResponse.json();
              console.error("Failed to create coding question:", errorData);
              continue;
            }

            const createdQuestion = await codingResponse.json();
            createdCodingIds.push(createdQuestion.id);
          } catch (error) {
            console.error("Error creating coding question:", error);
          }
        }
      }

      // Prepare exam data
      const examData = {
        title: examTitle,
        duration: examDuration,
        MCQQuestions: [...selectedQuestions.map((q) => q.id), ...createdMCQIds],
        CodingQuestions: [
          ...codingQuestions.map((q) => q.id),
          ...createdCodingIds,
        ],
      };

      setDebugInfo(
        (prev) =>
          prev + "\nCreating exam with data: " + JSON.stringify(examData)
      );

      // Create the exam
      const examResponse = await fetch("http://127.0.0.1:8000/exam/exams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
      });

      if (!examResponse.ok) {
        const errorData = await examResponse.json();
        setDebugInfo(
          (prev) => prev + "\nError creating exam: " + JSON.stringify(errorData)
        );
        throw new Error(errorData.message || "Failed to create exam");
      }

      const examResult = await examResponse.json();
      setDebugInfo(
        (prev) =>
          prev + "\nExam created successfully: " + JSON.stringify(examResult)
      );

      // Success - reset form and show success message
      alert("Exam created successfully!");
      setExamTitle("");
      setExamDuration(60);
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
          source: "exam_ui",
          points: 1.0,
          language: "Python",
        },
      ]);
      setSelectedQuestions([]);
      setCodedQuestions([]);
      setShowCreateQuestion(false);

      // Optional: Redirect or refresh question bank
      fetchQuestions();
    } catch (error) {
      console.error("Error:", error);
      setDebugInfo((prev) => prev + "\nFinal error: " + String(error));
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-black-700 text-center mb-6">
        Add Exam Questions
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

            <div>
              <label className="font-medium mr-2">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="select select-bordered"
              >
                <option value="all">All Languages</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="sql">SQL</option>
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
                  <th>Language</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedQuestions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No questions found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  displayedQuestions.map((question) => (
                    <tr key={question.id} className="border-t">
                      <td className="max-w-md truncate">
                        {question.question_text || question.title}
                      </td>
                      <td>{questionType === "mcq" ? "MCQ" : "Code"}</td>
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
                      <td>{question.language || "N/A"}</td>
                      <td>
                        <button
                          onClick={() => addQuestionToExam(question)}
                          className="btn btn-primary btn-sm"
                          disabled={
                            questionType === "mcq"
                              ? selectedQuestions.some(
                                  (q) => q.id === question.id
                                )
                              : codingQuestions.some(
                                  (q) => q.id === question.id
                                )
                          }
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
      {(selectedQuestions.length > 0 || codingQuestions.length > 0) && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Selected Questions</h3>
          <div className="space-y-4">
            {/* MCQ Questions */}
            {selectedQuestions.length > 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">
                  MCQ Questions ({selectedQuestions.length})
                </h4>
                {selectedQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {question.question_text}
                      </div>
                      <div className="text-sm text-gray-600">
                        Type: MCQ | Difficulty:{" "}
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
                        {" | Language: "}
                        {question.language || "N/A"}
                      </div>
                    </div>
                    <button
                      onClick={() => removeSelectedQuestion(question.id, "mcq")}
                      className="btn btn-error btn-sm ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Coding Questions */}
            {codingQuestions.length > 0 && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">
                  Coding Questions ({codingQuestions.length})
                </h4>
                {codingQuestions.map((question) => (
                  <div
                    key={question.id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {question.question_text || question.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        Type: Code | Difficulty:{" "}
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
                        </span>{" "}
                        | Language: {question.language || "N/A"}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        removeSelectedQuestion(question.id, "code")
                      }
                      className="btn btn-error btn-sm ml-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                className="p-4 border rounded-lg shadow-md bg-gray-50 space-y-4 relative"
              >
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="btn btn-error btn-sm absolute top-2 right-2"
                >
                  ×
                </button>

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
                  placeholder={
                    q.type === "mcq" ? "Enter the question" : "Enter the title"
                  }
                  className="input input-bordered w-full"
                  value={q.type === "mcq" ? q.question_text : q.title || ""}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />

                {/* Language field for both question types */}
                <div>
                  <label className="block font-medium mb-1">Language:</label>
                  <select
                    value={q.language}
                    onChange={(e) =>
                      handleLanguageChange(qIndex, e.target.value)
                    }
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="Python">Python</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Java">Java</option>
                    <option value="SQL">SQL</option>
                  </select>
                </div>

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
                              (q[
                                `option_${option.toLowerCase()}` as keyof Question
                              ] as string) || ""
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
                    <div>
                      <label className="block font-medium">Starter Code:</label>
                      <textarea
                        placeholder="Enter the starter code"
                        className="textarea textarea-bordered w-full h-28"
                        value={q.starter_code || ""}
                        onChange={(e) =>
                          handleCodeChange(qIndex, e.target.value)
                        }
                      />
                    </div>
                  </div>
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
        className="w-full bg-[#007ACC] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#1E90FF] transition-all duration-300 shadow-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Exam"}
      </button>

      {/* Debug info - can be removed in production */}
      {debugInfo && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs font-mono whitespace-pre-wrap">
          <h4 className="font-bold mb-2">Debug Info:</h4>
          {debugInfo}
        </div>
      )}
    </div>
  );
}
