"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";
import ExamHeader from "./exam-header";
import QuestionList from "./question-list";
import CodingQuestion from "./coding-question";
import MultipleChoiceQuestion from "./multiple-choice-question";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StudentMonitor from "./monitoring/student-monitor";

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
  csharp: "6.12.0",
  php: "8.2.0",
  ruby: "3.2.0",
  go: "1.18.0",
  rust: "1.68.0",
  typescript: "5.0.3",
};

interface TestCaseResult {
  input: string;
  output: string;
  expectedOutput: string;
  isSuccess: boolean;
}

interface Question {
  id: string;
  type: "multiple-choice" | "coding";
  title: string;
  [key: string]: any;
}

export default function ExamDashboard() {
  const router = useRouter();
  const { id } = useParams();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showScoreAlert, setShowScoreAlert] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [codeResults, setCodeResults] = useState<
    Record<string, TestCaseResult[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchExamData = async () => {
      const token = Cookies.get("token");

      try {
        setLoading(true);

        const [tempExamRes, questionsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/exam/temp-exams/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://127.0.0.1:8000/exam/exam/temp-exams/${id}/questions/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!tempExamRes.ok || !questionsRes.ok) {
          throw new Error("Failed to fetch exam data");
        }

        const [tempExamData, questionsData] = await Promise.all([
          tempExamRes.json(),
          questionsRes.json(),
        ]);

        let examDuration = tempExamData.duration;
        if (!examDuration && tempExamData.exam) {
          const examRes = await fetch(
            `http://127.0.0.1:8000/exam/exams/${tempExamData.exam}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (examRes.ok) {
            const examData = await examRes.json();
            examDuration = examData.duration;
          }
        }

        const formattedQuestions = [
          ...(questionsData.mcq_questions?.map((q: any) => ({
            id: q.id.toString(),
            type: "multiple-choice" as const,
            title: q.title || `Question ${q.id}`,
            question: q.question_text,
            code: q.code,
            options: [
              { id: "A", text: q.option_a },
              { id: "B", text: q.option_b },
              { id: "C", text: q.option_c },
              { id: "D", text: q.option_d },
            ],
            correctAnswer: q.correct_answer,
            language: q.language || "python",
          })) || []),
          ...(questionsData.coding_questions?.map((q: any) => ({
            id: q.id.toString(),
            type: "coding" as const,
            title: q.title || `Question ${q.id}`,
            description: q.description,
            starterCode: q.starter_code || "",
            testCases: q.test_cases || [],
            language: q.language || "python",
          })) || []),
        ];

        setExam({
          id: id,
          title: tempExamData.title,
          duration: examDuration,
        });
        setTimeLeft(examDuration * 60 || 0);
        setQuestions(formattedQuestions);

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
    if (timeLeft <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  useEffect(() => {
    if (timeExpired && !isSubmitted) {
      const confirmSubmit = window.confirm(
        "Time has expired. Would you like to submit your exam now?"
      );
      if (confirmSubmit) {
        handleSubmit();
      }
    }
  }, [timeExpired, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleTestResultsChange = (
    questionId: string,
    results: TestCaseResult[]
  ) => {
    setCodeResults((prev) => ({
      ...prev,
      [questionId]: results,
    }));
  };
  const handleSubmit = async () => {
    if (isSubmitted) {
      alert("You have already submitted this exam.");
      return;
    }

    const token = Cookies.get("token");
    setIsLoading(true);

    try {
      // First run all test cases for coding questions
      const updatedCodeResults: Record<string, TestCaseResult[]> = {
        ...codeResults,
      };

      // Run all test cases for each coding question
      for (const question of questions) {
        if (question.type === "coding" && answers[question.id]) {
          try {
            // Find the coding question component reference
            const codeAnswer = answers[question.id];

            // Run test cases for this question
            const testResults: TestCaseResult[] = [];

            for (let i = 0; i < question.testCases.length; i++) {
              const testCase = question.testCases[i];

              // Prepare code with input handling
              const language = question.language.toLowerCase();
              const functionName = testCase.function_name || "solution";
              const input = testCase.input_data;

              let codeWithInput = "";
              switch (language) {
                case "python":
                  codeWithInput = `${codeAnswer}\n\n# Test the function\nprint(${functionName}(${input}))`;
                  break;
                case "javascript":
                  codeWithInput = `${codeAnswer}\n\n// Test the function\nconsole.log(${functionName}(${input}));`;
                  break;
                default:
                  codeWithInput = codeAnswer;
              }

              // Execute the code
              const response = await fetch(
                "https://emkc.org/api/v2/piston/execute",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    language: language,
                    version: LANGUAGE_VERSIONS[language] || "latest",
                    files: [{ content: codeWithInput }],
                  }),
                }
              );

              if (!response.ok) {
                throw new Error("Failed to execute code");
              }

              const result = await response.json();
              const output = result.run.output.trim();
              const expectedOutput = testCase.expected_output.trim();
              const isSuccess = output === expectedOutput;

              testResults.push({
                input: testCase.input_data,
                output: output,
                expectedOutput: testCase.expected_output,
                isSuccess: isSuccess,
              });
            }

            updatedCodeResults[question.id] = testResults;
          } catch (error) {
            console.error(
              `Error running test cases for question ${question.id}:`,
              error
            );
            // Create failed test results if execution failed
            updatedCodeResults[question.id] = question.testCases.map(
              (testCase: { input_data: any; expected_output: any }) => ({
                input: testCase.input_data,
                output: "Error executing code",
                expectedOutput: testCase.expected_output,
                isSuccess: false,
              })
            );
          }
        }
      }

      // Update code results state
      setCodeResults(updatedCodeResults);

      // Calculate scores for each question
      let totalScore = 0;
      const submissionData = {
        exam_instance: id,
        mcq_answers: {} as Record<string, string>,
        coding_answers: {} as Record<string, string>,
        code_results: [] as any[],
      };

      // Process MCQ answers - ensure keys are strings
      questions.forEach((question) => {
        const answer = answers[question.id];
        if (!answer) return;

        if (question.type === "multiple-choice") {
          const cleanAnswer = answer.charAt(0).toUpperCase();
          if (["A", "B", "C", "D"].includes(cleanAnswer)) {
            submissionData.mcq_answers[question.id.toString()] = cleanAnswer;

            // Check if answer is correct and add points
            if (cleanAnswer === question.correctAnswer) {
              totalScore += question.points || 0;
            }
          }
        } else if (question.type === "coding") {
          submissionData.coding_answers[question.id.toString()] = answer.trim();

          // Calculate points based on test case results
          const results = updatedCodeResults[question.id] || [];
          const allPassed =
            results.length > 0 && results.every((r) => r.isSuccess);

          // Add to code_results array, score only if all test cases passed
          const earnedPoints = allPassed ? question.points || 0 : 0;

          submissionData.code_results.push({
            question_id: question.id.toString(),
            test_results: results,
          });

          // Add to total score if all test cases passed
          totalScore += earnedPoints;
        }
      });
      console.log("Submitting data:", submissionData); // Debug log

      const response = await fetch(
        `http://127.0.0.1:8000/exam/exam-answers/submit-answer/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Submission successful:", result); // Debug log
        setScore(result.score || 0);
        setShowScoreAlert(true);
        setIsSubmitted(true);
        localStorage.setItem(`submitted_exam_${id}`, "true");
      } else {
        const errorText = await response.text();
        console.error("Submission error:", errorText);
        alert(`Error submitting exam: ${errorText}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Error submitting the exam. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        Loading exam...
      </div>
    );
  if (!exam)
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        Exam not found
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex] || null;

  if (!currentQuestion)
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        No questions available
      </div>
    );

  return (
    <div className="container mx-auto px-4 pt-6 bg-background">
      <ExamHeader
        title={exam.title}
        timeLeft={formatTime(timeLeft)}
        onSubmit={handleSubmit}
        isSubmitted={isSubmitted}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-background p-4 rounded-lg shadow border border-border">
          <QuestionList
            questions={questions}
            currentIndex={currentQuestionIndex}
            onSelectQuestion={setCurrentQuestionIndex}
            answers={answers}
          />
        </div>

        <div className="md:col-span-3 bg-background rounded-lg shadow border border-border">
          {currentQuestion.type === "coding" ? (
            <CodingQuestion
              question={
                currentQuestion as MultipleChoiceQuestionProps["question"]
              }
              onAnswerChange={(answer) =>
                handleAnswerChange(currentQuestion.id, answer)
              }
              onTestResultsChange={handleTestResultsChange}
              answer={
                answers[currentQuestion.id] || currentQuestion.starterCode
              }
            />
          ) : (
            <MultipleChoiceQuestion
              question={currentQuestion}
              onAnswerChange={(answer) =>
                handleAnswerChange(currentQuestion.id, answer)
              }
              selectedOption={answers[currentQuestion.id]}
            />
          )}

          <div className="p-4 border-t border-border flex justify-between bg-background">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="border-border"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="border-border"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showScoreAlert} onOpenChange={setShowScoreAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exam Completed</AlertDialogTitle>
            <AlertDialogDescription>
              Your score: {score} Points
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => router.push("/dashboard_student")}
            >
              Return to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {id && <StudentMonitor examId={Array.isArray(id) ? id[0] : id} />}
    </div>
  );
}