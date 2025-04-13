"use client";
import { api } from "@/lib/api";
import type React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
} from "lucide-react";

interface TestCase {
  input_data: string;
  expected_output: string;
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

  useEffect(() => {
    fetchQuestions();
  }, [questionType, selectedLanguage]);

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
          ? api.mcq_filter
          : api.coding_filter;

      let url = baseUrl;
      if (selectedLanguage !== "all") {
        const languageMap: Record<string, string> = {
          python: "Python",
          javascript: "JavaScript",
          java: "Java",
          sql: "SQL",
        };

        const formattedLanguage =
          languageMap[selectedLanguage.toLowerCase()] || selectedLanguage;
        url = `${baseUrl}?language=${formattedLanguage}`;
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
    updatedQuestions[index].language = value;
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
    field: "input_data" | "expected_output",
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
        language: "Python",
      },
    ]);
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
          language: q.language,
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
          language: q.language,
          tags: q.tags || [],
        }));

      const createdMCQIds: number[] = [];
      const createdCodingIds: number[] = [];

      if (newMCQs.length > 0) {
        for (const mcq of newMCQs) {
          try {
            const mcqResponse = await fetch(
              api.mcq_questions,
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
              toast.error(
                `Failed to create MCQ: ${errorData.message || "Unknown error"}`
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
              api.code_questions,
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
                    api.test_cases,
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
                      }),
                    }
                  );

                  if (!testCaseResponse.ok) {
                    const errorData = await testCaseResponse.json();
                    console.error("Failed to create test case:", errorData);
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
        MCQQuestions: [...selectedQuestions.map((q) => q.id), ...createdMCQIds],
        CodingQuestions: [
          ...codingQuestions.map((q) => q.id),
          ...createdCodingIds,
        ],
      };

      const examResponse = await fetch(api.exams, {
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

      toast.success("Exam created successfully!");
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

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Exam Creator</h1>
          <p className="text-muted-foreground">
            Create and manage your exams with multiple choice and coding
            questions.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exam Information</CardTitle>
            <CardDescription>
              Set the basic information for your exam.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="exam-title">Exam Title</Label>
                <Input
                  id="exam-title"
                  placeholder="Enter exam title"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-duration">Duration (minutes)</Label>
                <Input
                  id="exam-duration"
                  type="number"
                  placeholder="Enter duration"
                  value={examDuration}
                  onChange={(e) => setExamDuration(Number(e.target.value))}
                  min="1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="question-bank" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="question-bank">Question Bank</TabsTrigger>
            <TabsTrigger value="selected-questions">
              Selected Questions (
              {selectedQuestions.length + codingQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="create-questions">Create Questions</TabsTrigger>
          </TabsList>

          <TabsContent value="question-bank" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Question Bank</CardTitle>
                <CardDescription>
                  Browse and select questions from the existing question bank.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="question-type">Question Type</Label>
                    <Select
                      value={questionType}
                      onValueChange={(value) =>
                        setQuestionType(value as "mcq" | "code")
                      }
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mcq">Multiple Choice</SelectItem>
                        <SelectItem value="code">Coding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty-filter">Difficulty</Label>
                    <Select
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
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
                    <Label htmlFor="language-filter">Language</Label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="sql">SQL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={fetchQuestions}
                      className="h-10 w-10"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="sr-only">Refresh questions</span>
                    </Button>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
                    {error}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Question</TableHead>
                          <TableHead>Difficulty</TableHead>
                          <TableHead>Language</TableHead>
                          <TableHead className="text-right">Action</TableHead>
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
                            <TableRow key={question.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {question.type === "mcq" ? (
                                    <FileQuestion className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Code className="h-4 w-4 text-muted-foreground" />
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
                                {question.language || "N/A"}
                              </TableCell>
                              <TableCell className="text-right ">
                                <Button
                                className="bg-[#007acc] hover:bg-blue-700  rounded-md text-white font-semibold"
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
                      <div className="flex justify-center py-3 border-t">
                        <Button
                          variant="ghost"
                          onClick={() => setShowAllQuestions(!showAllQuestions)}
                          className="text-sm"
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
            <Card>
              <CardHeader>
                <CardTitle>Selected Questions</CardTitle>
                <CardDescription>
                  Questions that will be included in your exam.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedQuestions.length === 0 &&
                codingQuestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions selected yet. Add questions from the Question
                    Bank.
                  </div>
                ) : (
                  <>
                    {selectedQuestions.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Multiple Choice Questions ({selectedQuestions.length})
                        </h3>
                        <div className="rounded-md border divide-y">
                          {selectedQuestions.map((question) => (
                            <div key={question.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {question.question_text}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {getDifficultyBadge(question.difficulty)}
                                    <span>|</span>
                                    <span>
                                      Language: {question.language || "N/A"}
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
                        <h3 className="text-lg font-medium">
                          Coding Questions ({codingQuestions.length})
                        </h3>
                        <div className="rounded-md border divide-y">
                          {codingQuestions.map((question) => (
                            <div key={question.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="font-medium">
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
                                      Language: {question.language || "N/A"}
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
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Questions</CardTitle>
                <CardDescription>
                  Create new questions to add to your exam.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion
                  type="multiple"
                  className="w-full"
                  defaultValue={["question-0"]}
                >
                  {questions.map((question, index) => (
                    <AccordionItem
                      key={index}
                      value={`question-${index}`}
                      className="border rounded-lg px-2 mb-4"
                    >
                      <div className="flex items-center justify-between py-4">
                        <AccordionTrigger className="hover:no-underline">
                          <span className="font-medium">
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
                          <div className="space-y-2">
                            <Label>Question Type</Label>
                            <Select
                              value={question.type}
                              onValueChange={(value) =>
                                handleTypeChange(index, value as "mcq" | "code")
                              }
                            >
                              <SelectTrigger>
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
                            <Label>
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
                            />
                          </div>

                          {question.type === "code" && (
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Enter the question description"
                                className="min-h-[100px]"
                                value={question.description || ""}
                                onChange={(e) =>
                                  handleDescriptionChange(index, e.target.value)
                                }
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Language</Label>
                            <Select
                              value={question.language}
                              onValueChange={(value) =>
                                handleLanguageChange(index, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="JavaScript">
                                  JavaScript
                                </SelectItem>
                                <SelectItem value="Java">Java</SelectItem>
                                <SelectItem value="SQL">SQL</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Select
                              value={question.difficulty}
                              onValueChange={(value) =>
                                handleDifficultyChange(
                                  index,
                                  value as "Easy" | "Medium" | "Hard"
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Points</Label>
                            <Input
                              type="number"
                              placeholder="Enter points"
                              value={question.points || 1}
                              onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].points = Number(
                                  e.target.value
                                );
                                setQuestions(updatedQuestions);
                              }}
                              min="0.1"
                              step="0.1"
                            />
                          </div>

                          {question.type === "mcq" ? (
                            <div className="space-y-4">
                              <Label>Options</Label>
                              <RadioGroup
                                value={question.correct_option || "A"}
                                onValueChange={(value) =>
                                  handleCorrectAnswerChange(index, value)
                                }
                              >
                                {["A", "B", "C", "D"].map((option) => (
                                  <div
                                    key={option}
                                    className="flex items-center space-x-2 space-y-2 "
                                  >
                                    <div className="grid gap-1.5">
                                      <div className="flex items-center space-x-2 ">
                                        <RadioGroupItem
                                        className="text-[#007acc]  border-[#007acc]"
                                          value={option}
                                          id={`option-${index}-${option}`}
                                        />
                                        <Label
                                          htmlFor={`option-${index}-${option}`}
                                          className="font-normal "
                                        >
                                          Option {option}
                                        </Label>
                                      </div>
                                    </div>
                                    <Input
                                      placeholder={`Enter option ${option}`}
                                      value={
                                        (question[
                                          `option_${option.toLowerCase()}` as keyof Question
                                        ] as string) || ""
                                      }
                                      onChange={(e) =>
                                        handleOptionChange(
                                          index,
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
                              </RadioGroup>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Starter Code</Label>
                                <Textarea
                                  placeholder="Enter the starter code"
                                  className="font-mono min-h-[150px]"
                                  value={question.starter_code || ""}
                                  onChange={(e) =>
                                    handleCodeChange(index, e.target.value)
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Test Cases</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAddTestCase(index)}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Test Case
                                  </Button>
                                </div>

                                {question.test_cases &&
                                question.test_cases.length > 0 ? (
                                  <div className="space-y-4">
                                    {question.test_cases.map(
                                      (testCase, tcIndex) => (
                                        <Card key={tcIndex}>
                                          <CardHeader className="py-3">
                                            <div className="flex items-center justify-between">
                                              <CardTitle className="text-sm font-medium">
                                                Test Case {tcIndex + 1}
                                              </CardTitle>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                  handleRemoveTestCase(
                                                    index,
                                                    tcIndex
                                                  )
                                                }
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                              >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">
                                                  Remove
                                                </span>
                                              </Button>
                                            </div>
                                          </CardHeader>
                                          <CardContent className="py-2 space-y-4">
                                            <div className="space-y-2">
                                              <Label className="text-sm">
                                                Input
                                              </Label>
                                              <Textarea
                                                placeholder="Input data"
                                                className="font-mono min-h-[80px]"
                                                value={testCase.input_data}
                                                onChange={(e) =>
                                                  handleTestCaseChange(
                                                    index,
                                                    tcIndex,
                                                    "input_data",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label className="text-sm">
                                                Expected Output
                                              </Label>
                                              <Textarea
                                                placeholder="Expected output"
                                                className="font-mono min-h-[80px]"
                                                value={testCase.expected_output}
                                                onChange={(e) =>
                                                  handleTestCaseChange(
                                                    index,
                                                    tcIndex,
                                                    "expected_output",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 border rounded-md text-muted-foreground">
                                    No test cases added yet.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addQuestion}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="  border-0">
          <CardContent className="pt-6">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-lg bg-[#007acc] hover:bg-blue-700  rounded-md text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5 " />
                  Create Exam
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {debugInfo && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto max-h-[200px]">
                {debugInfo}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}