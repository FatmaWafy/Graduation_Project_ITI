"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
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
import { Trophy } from "lucide-react";
const origin = process.env.NEXT_PUBLIC_API_URL;


// Import our improved components
import ExamHeader from "./exam-header";
import QuestionNavigator from "./question-navigator";
import MultipleChoiceQuestion from "./multiple-choice-question";
import CodingQuestion from "./coding-question";
import QuestionProgressBar from "./question-progress-bar";
import axios from "axios";

// Runtime support mapping for Piston - must match coding-question.tsx
const PISTON_LANGUAGE_RUNTIME = {
  python: "python3",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  php: "php",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  sql: "sqlite",
  r: "r",
  perl: "perl",
  swift: "swift",
  shell: "bash",
  powershell: "powershell",
  lua: "lua",
  objectivec: "objectivec",
  yaml: "python3",
  markdown: "python3",
  html: "python3",
  css: "python3",
  scss: "python3",
  less: "python3",
  xml: "python3",
  json: "python3",
  razor: "csharp",
};

// Default versions for languages - must match coding-question.tsx
const LANGUAGE_VERSIONS = {
  python3: "3.10.0",
  javascript: "18.15.0",
  typescript: "5.0.3",
  java: "15.0.2",
  cpp: "10.2.0",
  csharp: "6.12.0",
  php: "8.2.0",
  ruby: "3.2.0",
  go: "1.18.0",
  rust: "1.68.0",
  r: "4.2.0",
  perl: "5.36.0",
  swift: "5.8.0",
  lua: "5.4.4",
};

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

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
  // Mock router for compatibility
  const router = {
    push: (path: string) => {
      window.location.href = path;
    },
  };

  // Mock useParams for compatibility
  const id = window.location.pathname.split("/").pop() || "";

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
          fetch(`${origin}/exam/temp-exams/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${origin}/exam/exam/temp-exams/${id}/questions/`, {
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
            `${origin}/exam/exams/${tempExamData.exam}`,
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
            testCases: [], // MCQ questions won't have test cases
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

  // Special handler for SQLite execution - same as in coding-question.tsx
  const executeSQLite = async (sourceCode: string, input = "") => {
    try {
      // Create a wrapper script to execute SQLite commands
      const pythonWrapper = `
import sqlite3
import sys

# Create in-memory database
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Execute the schema creation code
schema_sql = """${sourceCode}"""
try:
    cursor.executescript(schema_sql)
    conn.commit()
except sqlite3.Error as e:
    print(f"Schema error: {e}", file=sys.stderr)
    sys.exit(1)

# If input is provided (for non-test case scenarios), execute it
if """${input}""":
    try:
        cursor.executescript("""${input}""")
        conn.commit()
    except sqlite3.Error as e:
        print(f"Input error: {e}", file=sys.stderr)
        sys.exit(1)

# For SELECT statements in the schema, fetch and print all results
if "SELECT" in schema_sql.upper():
    try:
        # Split schema into statements and process all SELECT statements
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        output_lines = []
        for stmt in statements:
            if 'SELECT' in stmt.upper():
                rows = cursor.execute(stmt).fetchall()
                # Format each row as pipe-separated values
                for row in rows:
                    output_lines.append("|".join(str(col) for col in row))
        # Print each line with a newline separator
        if output_lines:
            for line in output_lines:
                print(line)
    except sqlite3.Error as e:
        print(f"Query error: {e}", file=sys.stderr)

conn.close()
`.trim();

      // Execute the Python wrapper with Piston
      const response = await API.post("/execute", {
        language: "python3",
        version: "3.10.0",
        files: [{ content: pythonWrapper }],
      });

      return response.data;
    } catch (error) {
      console.error("Error executing SQLite:", error);
      throw error;
    }
  };

  // Execute code function - same approach as coding-question.tsx
  const executeCode = async (
    language: string,
    sourceCode: string,
    input = ""
  ) => {
    try {
      // Special handling for SQLite
      if (language.toLowerCase() === "sql") {
        return await executeSQLite(sourceCode, input);
      }

      // For non-SQL languages, use the standard execution approach
      const runtime =
        PISTON_LANGUAGE_RUNTIME[language.toLowerCase()] ||
        language.toLowerCase();
      const version = LANGUAGE_VERSIONS[runtime] || "latest";

      if (!runtime) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const payload = {
        language: runtime,
        version: version,
        files: [
          {
            content: sourceCode,
          },
        ],
      };

      // Log payload for debugging
      console.log("Executing payload:", payload);

      const response = await API.post("/execute", payload);
      return response.data;
    } catch (error) {
      console.error("Piston API error:", error);
      throw error;
    }
  };

  // Helper function to get code with input handling - same as in coding-question.tsx
  const getCodeWithInputHandling = (
    code: string,
    language: string,
    input: string,
    functionName: string
  ) => {
    // For SQL, return the code as-is (handled by executeSQLite)
    if (language.toLowerCase() === "sql") {
      return code;
    }

    // For languages that support function-based testing
    switch (language.toLowerCase()) {
      case "python":
        // For Python, handle comma-separated inputs properly
        if (input.includes(",")) {
          // Split the input by comma and trim whitespace
          const args = input
            .split(",")
            .map((arg) => arg.trim())
            .join(", ");
          return `${code}\n\n# Test the function\nprint(${functionName}(${args}))`;
        } else {
          return `${code}\n\n# Test the function\nprint(${functionName}(${input}))`;
        }
      case "javascript":
      case "typescript":
        return `${code}\n\n// Test the function\nconsole.log(${functionName}(${input}));`;
      case "java":
        return `${code}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(${functionName}(${input}));\n    }\n}`;
      case "cpp":
        return `${code}\n\nint main() {\n    auto result = ${functionName}(${input});\n    std::cout << result;\n    return 0;\n}`;
      case "c":
        return `${code}\n\nint main() {\n    printf("%d\\n", ${functionName}(${input}));\n    return 0;\n}`;
      case "csharp":
        return `${code}\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine(${functionName}(${input}));\n    }\n}`;
      case "php":
        return `<?php\n${code}\n\n// Test the function\necho ${functionName}(${input});\n?>`;
      case "ruby":
        return `${code}\n\n# Test the function\nputs ${functionName}(${input})`;
      case "go":
        return `${code}\n\nfunc main() {\n    fmt.Println(${functionName}(${input}))\n}`;
      case "rust":
        return `${code}\n\nfn main() {\n    println!("{}", ${functionName}(${input}));\n}`;
      case "r":
        return `${code}\n\n# Test the function\nprint(${functionName}(${input}))`;
      case "swift":
        return `${code}\n\n// Test the function\nprint(${functionName}(${input}))`;
      case "perl":
        return `${code}\n\n# Test the function\nprint ${functionName}(${input});`;
      case "lua":
        return `${code}\n\n-- Test the function\nprint(${functionName}(${input}))`;
      case "objectivec":
        return `${code}\n\nint main() {\n    NSLog(@"%@", ${functionName}(${input}));\n    return 0;\n}`;
      case "shell":
      case "powershell":
        return `${code}\n\n# Test with input\necho "${input}" | ${
          language.toLowerCase() === "shell" ? "bash" : "powershell"
        }`;
      default:
        return code;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      alert("You have already submitted this exam.");
      return;
    }

    const token = Cookies.get("token");
    setIsLoading(true);

    try {
      const updatedCodeResults: Record<string, TestCaseResult[]> = {
        ...codeResults,
      };

      for (const question of questions) {
        if (question.type === "coding" && answers[question.id]) {
          try {
            const codeAnswer = answers[question.id];
            const testResults: TestCaseResult[] = [];
            const language = question.language.toLowerCase();
            const isSQL = language === "sql";

            for (let i = 0; i < question.testCases.length; i++) {
              const testCase = question.testCases[i];
              const functionName = testCase.function_name || "solution";
              const input = testCase.input_data;

              let codeToExecute;
              let inputData = "";

              if (isSQL) {
                // For SQL, use the special SQL execution
                codeToExecute = codeAnswer;
                inputData = input;
              } else {
                // For non-SQL languages, use the function wrapper approach
                codeToExecute = getCodeWithInputHandling(
                  codeAnswer,
                  language,
                  input,
                  functionName
                );
              }

              // Execute the code using our executeCode function
              const result = await executeCode(
                language,
                codeToExecute,
                inputData
              );

              // Extract the output
              const rawOutput = result.run.output;
              const errorOutput = result.run.stderr;
              const outputLines = rawOutput.split("\n");
              let output = rawOutput.trim();

              // For non-SQL languages, extract the last non-empty line if needed
              if (outputLines.length > 0 && !isSQL) {
                // Find the last non-empty line
                for (let i = outputLines.length - 1; i >= 0; i--) {
                  if (outputLines[i].trim()) {
                    output = outputLines[i].trim();
                    break;
                  }
                }
              }

              // If there's an error, log it for debugging
              if (errorOutput) {
                console.error("Execution error:", errorOutput);
              }

              // Compare with expected output
              const expectedOutput = testCase.expected_output.trim();
              const isSuccess = output === expectedOutput;

              testResults.push({
                input: isSQL ? "N/A (SQL)" : input,
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

      setCodeResults(updatedCodeResults);

      let totalScore = 0;
      const submissionData = {
        exam_instance: id,
        mcq_answers: {} as Record<string, string>,
        coding_answers: {} as Record<string, string>,
        code_results: [] as any[],
      };

      questions.forEach((question) => {
        const answer = answers[question.id];
        if (!answer) return;

        if (question.type === "multiple-choice") {
          const cleanAnswer = answer.charAt(0).toUpperCase();
          if (["A", "B", "C", "D"].includes(cleanAnswer)) {
            submissionData.mcq_answers[question.id.toString()] = cleanAnswer;

            if (cleanAnswer === question.correctAnswer) {
              totalScore += question.points || 0;
            }
          }
        } else if (question.type === "coding") {
          submissionData.coding_answers[question.id.toString()] = answer.trim();

          const results = updatedCodeResults[question.id] || [];
          const allPassed =
            results.length > 0 && results.every((r) => r.isSuccess);

          submissionData.code_results.push({
            question_id: question.id.toString(),
            test_results: results,
          });

          totalScore += allPassed ? question.points || 0 : 0;
        }
      });

      const response = await fetch(
        `${origin}/exam/exam-answers/submit-answer/`,
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

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
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
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-40 bg-muted rounded-md mb-4"></div>
          <div className="h-4 w-24 bg-muted rounded-md"></div>
        </div>
      </div>
    );

  if (!exam)
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Exam not found</h2>
          <p className="text-muted-foreground mb-4">
            The exam you are looking for is not available
          </p>
          <Button onClick={() => router.push("/dashboard_student")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex] || null;

  if (!currentQuestion)
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No questions available</h2>
          <p className="text-muted-foreground mb-4">
            This exam doesn't have any questions
          </p>
          <Button onClick={() => router.push("/dashboard_student")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pb-4">
        <ExamHeader
          title={exam.title}
          timeLeft={formatTime(timeLeft)}
          onSubmit={handleSubmit}
          isSubmitted={isSubmitted}
        />

        {/* Question Progress */}
        <div className="mt-4">
          {questions.length > 0 && (
            <div className="w-full mb-3">
              {/* @ts-ignore */}
              <QuestionProgressBar
                currentQuestion={currentQuestionIndex}
                totalQuestions={questions.length}
                answeredQuestions={Object.keys(answers).length}
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-2">
          {/* Question Navigator */}
          <QuestionNavigator
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onSelectQuestion={handleSelectQuestion}
            answers={answers}
          />

          {/* Main Content Area */}
          <div className="flex-1 bg-background rounded-xl overflow-hidden border border-border">
            <div className="border-b border-border bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center bg-primary/10 text-primary w-7 h-7 rounded-full text-sm font-semibold mr-2">
                      {currentQuestionIndex + 1}
                    </span>
                    <h2 className="text-xl font-bold text-foreground">
                      {currentQuestion.title}
                    </h2>
                    <span
                      className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                        currentQuestion.type === "coding"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      }`}
                    >
                      {currentQuestion.type === "coding"
                        ? "Coding"
                        : "Multiple Choice"}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Left side: Question content */}
              <div className="w-full lg:w-1/2 border-r border-border lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto">
                {currentQuestion.type === "multiple-choice" ? (
                  <MultipleChoiceQuestion
                    key={currentQuestion.id} // Add unique key
                    question={{
                      id: currentQuestion.id,
                      title: currentQuestion.title,
                      question: currentQuestion.question || "",
                      code: currentQuestion.code,
                      options: currentQuestion.options || [],
                    }}
                    onAnswerChange={(answer) =>
                      handleAnswerChange(currentQuestion.id, answer)
                    }
                    selectedOption={answers[currentQuestion.id]}
                    isFirstQuestion={currentQuestionIndex === 0}
                    isLastQuestion={
                      currentQuestionIndex === questions.length - 1
                    }
                    onNextQuestion={handleNextQuestion}
                    onPrevQuestion={handlePrevQuestion}
                  />
                ) : (
                  <div className="p-6">
                    <div
                      className="prose max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground"
                      dangerouslySetInnerHTML={{
                        __html: currentQuestion.description,
                      }}
                    />
                    <div className="flex justify-between pt-4 mt-6 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="gap-1"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                        className="gap-1"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right side: Code editor (only for coding questions) */}
              <div className="w-full lg:w-1/2">
                {currentQuestion.type === "coding" ? (
                  <CodingQuestion
                    question={currentQuestion as any}
                    onAnswerChange={(answer) =>
                      handleAnswerChange(currentQuestion.id, answer)
                    }
                    onTestResultsChange={handleTestResultsChange}
                    answer={
                      answers[currentQuestion.id] ||
                      currentQuestion.starterCode ||
                      ""
                    }
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelectQuestion={handleSelectQuestion}
                    answers={answers}
                    onNextQuestion={handleNextQuestion}
                    onPrevQuestion={handlePrevQuestion}
                    isFirstQuestion={currentQuestionIndex === 0}
                    isLastQuestion={
                      currentQuestionIndex === questions.length - 1
                    }
                  />
                ) : (
                  <div className="hidden lg:flex flex-col justify-center items-center p-12 h-full bg-muted/20">
                    <div className="text-center">
                      <div className="mb-4 p-4 rounded-full bg-muted/50 inline-block">
                        <Trophy className="h-12 w-12 text-primary opacity-60" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        Multiple Choice Question
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Select your answer from the options on the left. The
                        code editor is only available for programming questions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showScoreAlert} onOpenChange={setShowScoreAlert}>
        <AlertDialogContent className="bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Exam Completed
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-center">
                <span className="block font-medium text-lg">
                  {score} Points
                </span>
                <span className="block text-muted-foreground mt-1">
                  Your exam has been submitted successfully
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-primary"
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
