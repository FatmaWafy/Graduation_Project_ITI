"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Code,
  FileQuestion,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  BookOpen,
  Clock,
  ListChecks,
  PenTool,
  Database,
  Lightbulb,
  Download,
} from "lucide-react";
const origin = process.env.NEXT_PUBLIC_API_URL;
interface TestCase {
  input_data: string;
  expected_output: string;
  function_name?: string;
}

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
  test_cases?: TestCase[];
}

interface Course {
  id: number;
  name: string;
  description?: string;
}

export default function AddExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [allExpanded, setAllExpanded] = useState<boolean>(true);
  const [createdExamId, setCreatedExamId] = useState<number | null>(null);
  const [createdExamTitle, setCreatedExamTitle] = useState<string>("");

  const languageMapForDisplay: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    xml: "XML",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    php: "PHP",
    razor: "Razor",
    markdown: "Markdown",
    yaml: "YAML",
    shell: "Shell",
    powershell: "PowerShell",
    lua: "Lua",
    r: "R",
    perl: "Perl",
    swift: "Swift",
    "objective-c": "Objective-C",
    scss: "SCSS",
    less: "LESS",
  };

  const languageMapForSubmission: Record<string, string> = {
    Python: "python",
    JavaScript: "javascript",
    TypeScript: "typescript",
    HTML: "html",
    CSS: "css",
    JSON: "json",
    XML: "xml",
    Java: "java",
    C: "c",
    "C++": "cpp",
    "C#": "csharp",
    PHP: "php",
    Razor: "razor",
    Markdown: "markdown",
    YAML: "yaml",
    Shell: "shell",
    PowerShell: "powershell",
    Lua: "lua",
    R: "r",
    Perl: "perl",
    Swift: "swift",
    "Objective-C": "objective-c",
    SCSS: "scss",
    LESS: "less",
  };

  const normalizeLanguageForSubmission = (language: string): string => {
    return (
      languageMapForSubmission[language] || language.toLowerCase() || "python"
    );
  };

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

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("No authentication token found in cookies");
      }

      const response = await fetch(`${origin}/users/courses/`, {
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
      setCourses(data);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toast.error(
        `Failed to fetch courses: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [questionType, selectedLanguage]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("No authentication token found in cookies");
      }

      const baseUrl =
        questionType === "mcq"
          ? `${origin}/exam/mcq-filter/`
          : `${origin}/exam/coding-filter/`;

      let url = baseUrl;
      if (selectedLanguage !== "all") {
        url = `${baseUrl}?language=${selectedLanguage}`;
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

      const questionsWithType = data.map((q: any) => {
        if (questionType === "code") {
          return {
            ...q,
            type: "code",
            question_text: q.title || q.question_text || "",
            description: q.description || "",
            language: q.language,
          };
        } else {
          return {
            ...q,
            type: "mcq",
            language: q.language,
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
      toast.error(
        `Failed to fetch questions: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions =
    selectedDifficulty === "all"
      ? allQuestions
      : allQuestions.filter((q) => q.difficulty === selectedDifficulty);

  const displayedQuestions = showAllQuestions
    ? filteredQuestions
    : filteredQuestions.slice(0, 4);

  const handleTypeChange = (index: number, type: "mcq" | "code") => {
    const updatedQuestions = [...questions];
    const currentLanguage = updatedQuestions[index].language || "python";
    console.log(
      `Changing question ${index} to type ${type}, language: ${currentLanguage}`
    );
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
        language: currentLanguage,
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
        language: currentLanguage,
        tags: [],
        test_cases: [],
      };
    }
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[index].type === "mcq") {
      updatedQuestions[index].question_text = value;
    } else {
      updatedQuestions[index].title = value;
      updatedQuestions[index].question_text = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].description = value;
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
    updatedQuestions[index].starter_code = value;
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
    const normalizedLanguage = normalizeLanguageForSubmission(value);
    console.log(
      `Setting language for question ${index} to ${normalizedLanguage}`
    );
    updatedQuestions[index].language = normalizedLanguage;
    setQuestions(updatedQuestions);
  };

  const handleAddTestCase = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    if (!updatedQuestions[questionIndex].test_cases) {
      updatedQuestions[questionIndex].test_cases = [];
    }
    updatedQuestions[questionIndex].test_cases!.push({
      input_data: "",
      expected_output: "",
      function_name: "",
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveTestCase = (
    questionIndex: number,
    testCaseIndex: number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].test_cases!.splice(testCaseIndex, 1);
    setQuestions(updatedQuestions);
  };

  const handleTestCaseChange = (
    questionIndex: number,
    testCaseIndex: number,
    field: "input_data" | "expected_output" | "function_name",
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].test_cases![testCaseIndex][field] = value;
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
        language: "python",
      },
    ]);
    setAllExpanded(true);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    toast.info("Question removed");
  };

  const addQuestionToExam = (question: Question) => {
    const currentType = questionType;
    const questionWithType = {
      ...question,
      type: currentType,
    };

    console.log(`Adding ${currentType} question to exam:`, questionWithType);

    if (currentType === "mcq") {
      if (!selectedQuestions.some((q) => q.id === question.id)) {
        setSelectedQuestions((prevSelected) => [
          ...prevSelected,
          questionWithType,
        ]);
        toast.success("MCQ question added to exam");
      }
    } else if (currentType === "code") {
      if (!codingQuestions.some((q) => q.id === question.id)) {
        setCodedQuestions((prevCoding) => [...prevCoding, questionWithType]);
        toast.success("Coding question added to exam");
      }
    }
  };

  const removeSelectedQuestion = (questionId: number, type: "mcq" | "code") => {
    if (type === "mcq") {
      setSelectedQuestions(
        selectedQuestions.filter((q) => q.id !== questionId)
      );
    } else {
      setCodedQuestions(codingQuestions.filter((q) => q.id !== questionId));
    }
    toast.info("Question removed from exam");
  };

  const validateQuestions = (questions: Question[]) => {
    console.log("Validating questions:", questions);
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.language) {
        console.error(
          `Validation failed: Question ${i + 1} has no language.`,
          question
        );
        toast.error(`Please select a language for question ${i + 1}.`);
        return false;
      }
      if (!question.difficulty) {
        console.error(
          `Validation failed: Question ${i + 1} has no difficulty.`,
          question
        );
        toast.error(`Please select a difficulty level for question ${i + 1}.`);
        return false;
      }
      if (question.type === "mcq" && !question.question_text.trim()) {
        console.error(
          `Validation failed: Question ${i + 1} has no question text.`,
          question
        );
        toast.error(`Please provide text for question ${i + 1} (MCQ).`);
        return false;
      }
      if (question.type === "code" && !question.title?.trim()) {
        console.error(
          `Validation failed: Question ${i + 1} has no title.`,
          question
        );
        toast.error(`Please provide a title for question ${i + 1} (Coding).`);
        return false;
      }
    }
    return true;
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

      if (!examTitle.trim()) {
        toast.error("Please enter an exam title");
        setIsSubmitting(false);
        return;
      }

      if (!validateQuestions(questions)) {
        setIsSubmitting(false);
        return;
      }

      const newMCQs = questions
        .filter((q) => q.type === "mcq" && q.question_text.trim() !== "")
        .map((q) => ({
          question_text: q.question_text,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c || "",
          option_d: q.option_d || "",
          correct_option: q.correct_option,
          difficulty: q.difficulty,
          source: "exam_ui",
          points: q.points || 1.0,
          language: normalizeLanguageForSubmission(q.language || "python"),
        }));

      const newCodingQuestions = questions
        .filter(
          (q) =>
            q.type === "code" &&
            ((q.title && q.title.trim() !== "") ||
              (q.question_text && q.question_text.trim() !== ""))
        )
        .map((q) => ({
          title: q.title || q.question_text,
          description: q.description || "",
          difficulty: q.difficulty,
          starter_code: q.starter_code || "",
          source: "exam_ui",
          points: q.points || 1.0,
          language: normalizeLanguageForSubmission(q.language || "python"),
          tags: q.tags || [],
        }));

      console.log("Submitting MCQs:", newMCQs);
      console.log("Submitting Coding Questions:", newCodingQuestions);

      const createdMCQIds: number[] = [];
      const createdCodingIds: number[] = [];

      if (newMCQs.length > 0) {
        for (const mcq of newMCQs) {
          try {
            const mcqResponse = await fetch(`${origin}/exam/mcq-questions/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(mcq),
            });

            if (!mcqResponse.ok) {
              const errorData = await mcqResponse.json();
              console.error("MCQ creation failed:", errorData);
              toast.error(
                `Failed to create MCQ question: ${
                  errorData.message || "Unknown error"
                }`
              );
              continue;
            }

            const createdQuestion = await mcqResponse.json();
            createdMCQIds.push(createdQuestion.id);
            toast.success("MCQ question created successfully");
          } catch (error) {
            console.error("Error creating MCQ:", error);
            toast.error(
              `Error creating MCQ: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          }
        }
      }

      if (newCodingQuestions.length > 0) {
        for (let i = 0; i < newCodingQuestions.length; i++) {
          const codingQ = newCodingQuestions[i];
          const originalQuestion = questions.find(
            (q) =>
              (q.type === "code" && q.title === codingQ.title) ||
              (q.type === "code" && q.question_text === codingQ.title)
          );

          try {
            const codingResponse = await fetch(
              `${origin}/exam/code-questions/`,
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
              console.error("Coding question creation failed:", errorData);
              toast.error(
                `Failed to create coding question: ${
                  errorData.message || "Unknown error"
                }`
              );
              continue;
            }

            const createdQuestion = await codingResponse.json();
            createdCodingIds.push(createdQuestion.id);
            toast.success("Coding question created successfully");

            if (
              originalQuestion?.test_cases &&
              originalQuestion.test_cases.length > 0
            ) {
              for (const testCase of originalQuestion.test_cases) {
                try {
                  const testCaseResponse = await fetch(
                    `${origin}/exam/test-cases/`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        question: createdQuestion.id,
                        input_data: testCase.input_data,
                        expected_output: testCase.expected_output,
                        function_name:
                          testCase.function_name || "function_name",
                      }),
                    }
                  );

                  if (!testCaseResponse.ok) {
                    const errorData = await testCaseResponse.json();
                    console.error("Test case creation failed:", errorData);
                    toast.error(
                      `Failed to create test case: ${
                        errorData.message || "Unknown error"
                      }`
                    );
                  } else {
                    toast.success("Test case added successfully");
                  }
                } catch (error) {
                  console.error("Error creating test case:", error);
                  toast.error(
                    `Error creating test case: ${
                      error instanceof Error ? error.message : "Unknown error"
                    }`
                  );
                }
              }
            }
          } catch (error) {
            console.error("Error creating coding question:", error);
            toast.error(
              `Error creating coding question: ${
                error instanceof Error ? error.message : "Unknown error"
              }`
            );
          }
        }
      }

      const examData = {
        title: examTitle,
        duration: examDuration,
        course: selectedCourse || null,
        MCQQuestions: [...selectedQuestions.map((q) => q.id), ...createdMCQIds],
        CodingQuestions: [
          ...codingQuestions.map((q) => q.id),
          ...createdCodingIds,
        ],
      };

      const examResponse = await fetch(`${origin}/exam/exams/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
      });

      if (!examResponse.ok) {
        const errorData = await examResponse.json();
        throw new Error(errorData.message || "Failed to create exam");
      }
      const createdExam = await examResponse.json();
      setCreatedExamId(createdExam.id);
      setCreatedExamTitle(createdExam.title);
      toast.success("Exam created successfully!");
      setExamTitle("");
      setExamDuration(60);
      setQuestions([]);
      setSelectedQuestions([]);
      setCodedQuestions([]);
      setShowCreateQuestion(false);

      fetchQuestions();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            {difficulty}
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            {difficulty}
          </Badge>
        );
      case "Hard":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            {difficulty}
          </Badge>
        );
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };
  const handleExportPDF = async () => {
    if (!createdExamId) {
      toast.error("No exam created yet. Please create an exam first.");
      return;
    }
    console.log("Exporting PDF for exam ID:", createdExamId);
    try {
      const token = getTokenFromCookies();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${origin}/exam/export-bubble-sheet/${createdExamId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to export Exam");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const exportExamTitle = createdExamTitle || "exam";
      link.download = `${exportExamTitle}_id(${createdExamId}).pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Exam exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error(
        `Error exporting Exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#007acc]">
            Exam Creator
          </h1>
          <p className="text-[#007abc]">
            Create and manage your exams with multiple choice and coding
            questions.
          </p>
        </div>

        <Card className="border-[#c7e5ff] shadow-md">
          <CardHeader className="bg-gradient-to-r from-[#007acc] to-[#007abc] text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Exam Information
            </CardTitle>
            <CardDescription className="text-white/80">
              Set the basic information for your exam.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="exam-title"
                  className="text-[#007acc] font-medium flex items-center gap-2"
                >
                  <PenTool className="h-4 w-4" />
                  Exam Title
                </Label>
                <Input
                  id="exam-title"
                  placeholder="Enter exam title"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  required
                  className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="course-select"
                  className="text-[#007acc] font-medium flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Course
                </Label>
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger
                    id="course-select"
                    className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                  >
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {isLoadingCourses ? (
                      <SelectItem value="loading" disabled>
                        Loading courses...
                      </SelectItem>
                    ) : courses.length > 0 ? (
                      courses.map((course) => (
                        <SelectItem
                          key={course.id}
                          value={course.id.toString()}
                        >
                          {course.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-courses" disabled>
                        No courses available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="exam-duration"
                  className="text-[#007acc] font-medium flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Duration (minutes)
                </Label>
                <Input
                  id="exam-duration"
                  type="number"
                  placeholder="Enter duration"
                  value={examDuration}
                  onChange={(e) => setExamDuration(Number(e.target.value))}
                  min="1"
                  required
                  className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="question-bank" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-[#c7e5ff]">
            <TabsTrigger
              value="question-bank"
              className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Question Bank
            </TabsTrigger>
            <TabsTrigger
              value="selected-questions"
              className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
            >
              <ListChecks className="h-4 w-4 mr-2" />
              Selected Questions (
              {selectedQuestions.length + codingQuestions.length})
            </TabsTrigger>
            <TabsTrigger
              value="create-questions"
              className="data-[state=active]:bg-[#007acc] data-[state=active]:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="question-bank" className="space-y-6">
            <Card className="border-[#c7e5ff] shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#007acc]">Question Bank</CardTitle>
                <CardDescription>
                  Browse and select questions from the existing question bank.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="question-type" className="text-[#007acc]">
                      Question Type
                    </Label>
                    <Select
                      value={questionType}
                      onValueChange={(value) =>
                        setQuestionType(value as "mcq" | "code")
                      }
                    >
                      <SelectTrigger className="w-full md:w-[180px] border-[#c7e5ff]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="code">Coding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="difficulty-filter"
                      className="text-[#007acc]"
                    >
                      Difficulty
                    </Label>
                    <Select
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <SelectTrigger className="w-full md:w-[180px] border-[#c7e5ff]">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language-filter" className="text-[#007acc]">
                      Language
                    </Label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="w-full md:w-[180px] border-[#c7e5ff]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {Object.entries(languageMapForDisplay).map(
                          ([backendValue, displayValue]) => (
                            <SelectItem key={backendValue} value={backendValue}>
                              {displayValue}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={fetchQuestions}
                      className="h-10 w-10 border-[#007acc] text-[#007acc] hover:bg-[#c7e5ff]"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh questions</span>
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#007acc]"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                ) : (
                  <div className="rounded-md border border-[#c7e5ff]">
                    <Table>
                      <TableHeader className="bg-[#f0f7ff]">
                        <TableRow>
                          <TableHead className="w-[50%] text-[#007acc]">
                            Question
                          </TableHead>
                          <TableHead className="text-[#007acc]">
                            Difficulty
                          </TableHead>
                          <TableHead className="text-[#007acc]">
                            Language
                          </TableHead>
                          <TableHead className="text-right text-[#007acc]">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {displayedQuestions.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="text-center py-6 text-muted-foreground"
                            >
                              No questions found for the selected criteria.
                            </TableCell>
                          </TableRow>
                        ) : (
                          displayedQuestions.map((question) => (
                            <TableRow
                              key={question.id}
                              className="hover:bg-[#f0f7ff]"
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {question.type === "mcq" ? (
                                    <FileQuestion className="h-4 w-4 text-[#007acc]" />
                                  ) : (
                                    <Code className="h-4 w-4 text-[#007acc]" />
                                  )}
                                  <span className="line-clamp-1">
                                    {question.question_text || question.title}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getDifficultyBadge(question.difficulty)}
                              </TableCell>
                              <TableCell>
                                {languageMapForDisplay[question.language] ||
                                  question.language ||
                                  "N/A"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  className="bg-[#007acc] hover:bg-[#007abc] rounded-md text-white font-semibold"
                                  onClick={() => addQuestionToExam(question)}
                                  size="sm"
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
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>

                    {filteredQuestions.length > 4 && (
                      <div className="flex justify-center py-3 border-t border-[#c7e5ff]">
                        <Button
                          variant="ghost"
                          onClick={() => setShowAllQuestions(!showAllQuestions)}
                          className="text-sm text-[#007acc] hover:bg-[#c7e5ff] hover:text-[#007acc]"
                        >
                          {showAllQuestions ? (
                            <>
                              <ChevronUp className="mr-2 h-4 w-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-2 h-4 w-4" />
                              Show More ({filteredQuestions.length - 4} more)
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="selected-questions" className="space-y-6">
            <Card className="border-[#c7e5ff] shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#f0f7ff] to-[#c7e5ff]">
                <CardTitle className="text-[#007acc]">
                  Selected Questions
                </CardTitle>
                <CardDescription>
                  Questions that will be included in your exam.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {selectedQuestions.length === 0 &&
                codingQuestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground bg-[#f0f7ff] rounded-md border border-[#c7e5ff]">
                    No questions selected yet. Add questions from the Question
                    Bank.
                  </div>
                ) : (
                  <>
                    {selectedQuestions.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-[#007acc] flex items-center gap-2">
                          <FileQuestion className="h-5 w-5" />
                          Multiple Choice Questions ({selectedQuestions.length})
                        </h3>
                        <div className="rounded-md border border-[#c7e5ff] divide-y">
                          {selectedQuestions.map((question) => (
                            <div
                              key={question.id}
                              className="p-4 hover:bg-[#f0f7ff]"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="font-medium text-[#007abc]">
                                    {question.question_text}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {getDifficultyBadge(question.difficulty)}
                                    <span>|</span>
                                    <span>
                                      Language:{" "}
                                      {languageMapForDisplay[
                                        question.language
                                      ] ||
                                        question.language ||
                                        "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeSelectedQuestion(question.id, "mcq")
                                  }
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {codingQuestions.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-[#007acc] flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Coding Questions ({codingQuestions.length})
                        </h3>
                        <div className="rounded-md border border-[#c7e5ff] divide-y">
                          {codingQuestions.map((question) => (
                            <div
                              key={question.id}
                              className="p-4 hover:bg-[#f0f7ff]"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="font-medium text-[#007abc]">
                                    {question.question_text || question.title}
                                  </div>
                                  {question.description && (
                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                      {question.description}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {getDifficultyBadge(question.difficulty)}
                                    <span>|</span>
                                    <span>
                                      Language:{" "}
                                      {languageMapForDisplay[
                                        question.language
                                      ] ||
                                        question.language ||
                                        "N/A"}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeSelectedQuestion(question.id, "code")
                                  }
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-questions" className="space-y-6">
            <Card className="border-[#c7e5ff] shadow-md">
              <CardHeader className="bg-gradient-to-r from-[#007acc] to-[#007abc] text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Create Custom Questions
                </CardTitle>
                <CardDescription className="text-white/80">
                  Create new questions to add to your exam.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex justify-between mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setAllExpanded(!allExpanded)}
                    className="border-[#007acc] text-[#007acc] hover:bg-[#c7e5ff]"
                  >
                    {allExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Collapse All
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Expand All
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={addQuestion}
                    className="bg-[#007acc] hover:bg-[#007abc] text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Question
                  </Button>
                </div>

                {questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 bg-[#f0f7ff] rounded-md border border-[#c7e5ff]">
                    <p className="text-muted-foreground mb-4">
                      No questions created yet. Click the button above to add
                      your first question.
                    </p>
                  </div>
                ) : (
                  <Accordion
                    type="multiple"
                    className="w-full"
                    value={
                      allExpanded
                        ? questions.map((_, index) => `question-${index}`)
                        : []
                    }
                  >
                    {questions.map((question, index) => (
                      <AccordionItem
                        key={index}
                        value={`question-${index}`}
                        className={`border rounded-lg px-2 mb-4 ${
                          question.type === "mcq"
                            ? "border-l-4 border-l-[#007acc]"
                            : "border-l-4 border-l-green-500"
                        }`}
                      >
                        <div className="flex items-center justify-between py-4">
                          <AccordionTrigger className="hover:no-underline">
                            <span
                              className={`font-medium ${
                                question.type === "mcq"
                                  ? "text-[#007acc]"
                                  : "text-green-600"
                              }`}
                            >
                              {question.type === "mcq"
                                ? "Multiple Choice Question"
                                : "Coding Question"}{" "}
                              {index + 1}
                            </span>
                          </AccordionTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeQuestion(index);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <AccordionContent className="pb-4 space-y-4">
                          <div className="space-y-4">
                            <div className="space-y-2 bg-[#f0f7ff] p-4 rounded-md">
                              <Label className="text-[#007acc] font-medium">
                                Question Type
                              </Label>
                              <Select
                                value={question.type}
                                onValueChange={(value) =>
                                  handleTypeChange(
                                    index,
                                    value as "mcq" | "code"
                                  )
                                }
                              >
                                <SelectTrigger className="border-[#c7e5ff]">
                                  <SelectValue placeholder="Select question type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mcq">
                                    Multiple Choice Question
                                  </SelectItem>
                                  <SelectItem value="code">
                                    Coding Question
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[#007acc] font-medium">
                                {question.type === "mcq"
                                  ? "Question Text"
                                  : "Question Title"}
                              </Label>
                              <Input
                                placeholder={
                                  question.type === "mcq"
                                    ? "Enter the question"
                                    : "Enter the title"
                                }
                                value={
                                  question.type === "mcq"
                                    ? question.question_text
                                    : question.title || ""
                                }
                                onChange={(e) =>
                                  handleQuestionChange(index, e.target.value)
                                }
                                className="border-[#c7e5ff]"
                              />
                            </div>

                            {question.type === "code" && (
                              <div className="space-y-2 bg-[#f0f7ff] p-4 rounded-md">
                                <Label className="text-[#007acc] font-medium">
                                  Description
                                </Label>
                                <Textarea
                                  placeholder="Enter the question description"
                                  className="min-h-[100px] border-[#c7e5ff]"
                                  value={question.description || ""}
                                  onChange={(e) =>
                                    handleDescriptionChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-[#007acc] font-medium">
                                  Difficulty
                                </Label>
                                <Select
                                  value={question.difficulty}
                                  onValueChange={(value) =>
                                    handleDifficultyChange(
                                      index,
                                      value as "Easy" | "Medium" | "Hard"
                                    )
                                  }
                                >
                                  <SelectTrigger className="border-[#c7e5ff]">
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-[#007acc] font-medium">
                                  Language
                                </Label>
                                <Select
                                  value={
                                    languageMapForDisplay[question.language] ||
                                    question.language
                                  }
                                  onValueChange={(value) =>
                                    handleLanguageChange(index, value)
                                  }
                                >
                                  <SelectTrigger className="border-[#c7e5ff]">
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(languageMapForDisplay).map(
                                      ([backendValue, displayValue]) => (
                                        <SelectItem
                                          key={backendValue}
                                          value={displayValue}
                                        >
                                          {displayValue}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {question.type === "mcq" && (
                              <>
                                <div className="space-y-4 bg-[#f0f7ff] p-4 rounded-md">
                                  <Label className="text-[#007acc] font-medium">
                                    Options
                                  </Label>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`option-a-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        Option A
                                      </Label>
                                      <Input
                                        id={`option-a-${index}`}
                                        placeholder="Enter option A"
                                        value={question.option_a || ""}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            index,
                                            "option_a",
                                            e.target.value
                                          )
                                        }
                                        className="border-[#c7e5ff]"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`option-b-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        Option B
                                      </Label>
                                      <Input
                                        id={`option-b-${index}`}
                                        placeholder="Enter option B"
                                        value={question.option_b || ""}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            index,
                                            "option_b",
                                            e.target.value
                                          )
                                        }
                                        className="border-[#c7e5ff]"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`option-c-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        Option C
                                      </Label>
                                      <Input
                                        id={`option-c-${index}`}
                                        placeholder="Enter option C"
                                        value={question.option_c || ""}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            index,
                                            "option_c",
                                            e.target.value
                                          )
                                        }
                                        className="border-[#c7e5ff]"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`option-d-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        Option D
                                      </Label>
                                      <Input
                                        id={`option-d-${index}`}
                                        placeholder="Enter option D"
                                        value={question.option_d || ""}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            index,
                                            "option_d",
                                            e.target.value
                                          )
                                        }
                                        className="border-[#c7e5ff]"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2 bg-[#f0f7ff] p-4 rounded-md">
                                  <Label className="text-[#007acc] font-medium">
                                    Correct Answer
                                  </Label>
                                  <RadioGroup
                                    value={question.correct_option}
                                    onValueChange={(value) =>
                                      handleCorrectAnswerChange(index, value)
                                    }
                                    className="grid grid-cols-4 gap-4"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="A"
                                        id={`A-${index}`}
                                      />
                                      <Label
                                        htmlFor={`A-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        A
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="B"
                                        id={`B-${index}`}
                                      />
                                      <Label
                                        htmlFor={`B-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        B
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="C"
                                        id={`C-${index}`}
                                      />
                                      <Label
                                        htmlFor={`C-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        C
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="D"
                                        id={`D-${index}`}
                                      />
                                      <Label
                                        htmlFor={`D-${index}`}
                                        className="text-[#007acc]"
                                      >
                                        D
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>
                              </>
                            )}

                            {question.type === "code" && (
                              <>
                                <div className="space-y-2 bg-[#f0f7ff] p-4 rounded-md">
                                  <Label className="text-[#007acc] font-medium">
                                    Starter Code
                                  </Label>
                                  <Textarea
                                    placeholder="Enter starter code (optional)"
                                    className="min-h-[100px] font-mono border-[#c7e5ff]"
                                    value={question.starter_code || ""}
                                    onChange={(e) =>
                                      handleCodeChange(index, e.target.value)
                                    }
                                  />
                                </div>

                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-[#007acc] font-medium">
                                      Test Cases
                                    </Label>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAddTestCase(index)}
                                      className="border-[#007acc] text-[#007acc] hover:bg-[#c7e5ff]"
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Test Case
                                    </Button>
                                  </div>
                                  {question.test_cases?.map(
                                    (testCase, tcIndex) => (
                                      <div
                                        key={tcIndex}
                                        className="border rounded-md p-4 bg-[#f0f7ff] space-y-4 relative"
                                      >
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleRemoveTestCase(index, tcIndex)
                                          }
                                          className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                          <X className="h-4 w-4" />
                                          <span className="sr-only">
                                            Remove test case
                                          </span>
                                        </Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`input-${index}-${tcIndex}`}
                                              className="text-[#007acc]"
                                            >
                                              Input
                                            </Label>
                                            <Input
                                              id={`input-${index}-${tcIndex}`}
                                              placeholder="Enter input data"
                                              value={testCase.input_data}
                                              onChange={(e) =>
                                                handleTestCaseChange(
                                                  index,
                                                  tcIndex,
                                                  "input_data",
                                                  e.target.value
                                                )
                                              }
                                              className="border-[#c7e5ff]"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`output-${index}-${tcIndex}`}
                                              className="text-[#007acc]"
                                            >
                                              Expected Output
                                            </Label>
                                            <Input
                                              id={`output-${index}-${tcIndex}`}
                                              placeholder="Enter expected output"
                                              value={testCase.expected_output}
                                              onChange={(e) =>
                                                handleTestCaseChange(
                                                  index,
                                                  tcIndex,
                                                  "expected_output",
                                                  e.target.value
                                                )
                                              }
                                              className="border-[#c7e5ff]"
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor={`function-name-${index}-${tcIndex}`}
                                              className="text-[#007acc]"
                                            >
                                              Function Name (Optional)
                                            </Label>
                                            <Input
                                              id={`function-name-${index}-${tcIndex}`}
                                              placeholder="Enter function name"
                                              value={
                                                testCase.function_name || ""
                                              }
                                              onChange={(e) =>
                                                handleTestCaseChange(
                                                  index,
                                                  tcIndex,
                                                  "function_name",
                                                  e.target.value
                                                )
                                              }
                                              className="border-[#c7e5ff]"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 ">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#007acc] hover:bg-[#007abc] text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Exam
              </>
            )}
          </Button>
          {createdExamId && (
            <Button
              onClick={handleExportPDF}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Exam (pdf)
            </Button>
          )}
        </div>

        {debugInfo && (
          <div className="mt-4 p-4 border border-[#c7e5ff] bg-[#f0f7ff] rounded-md">
            <h3 className="text-[#007acc] font-medium">Debug Info</h3>
            <p className="text-sm text-muted-foreground">{debugInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
