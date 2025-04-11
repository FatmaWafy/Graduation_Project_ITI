"use client";

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
  language: string;
  title?: string;
  description?: string;
  starter_code?: string;
  tags?: any[];
  test_cases?: TestCase[];
}

const MCQ_ENDPOINT = "http://127.0.0.1:8000/exam/mcq-questions/";
const CODING_ENDPOINT = "http://127.0.0.1:8000/exam/code-questions/";
const EXAM_ENDPOINT = "http://127.0.0.1:8000/exam/exams/";

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
  const [examTitle, setExamTitle] = useState<string>("");
  const [examDuration, setExamDuration] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [debugInfo, setDebugInfo] = useState<string>("");

  const getTokenFromCookies = (): string | null => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "token" || name === "authToken") {
        return value;
      }
    }
    return null;
  };

  const validateQuestion = (question: Question): boolean => {
    if (question.type === "mcq") {
      return (
        question.question_text.trim() !== "" &&
        question.option_a.trim() !== "" &&
        question.option_b.trim() !== "" &&
        !!question.correct_option
      );
    } else {
      return (
        (question.title?.trim() || question.question_text?.trim()) !== "" &&
        !!question.language
      );
    }
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
        throw new Error("No authentication token found");
      }

      const baseUrl =
        questionType === "mcq"
          ? "http://127.0.0.1:8000/exam/mcq-filter/"
          : "http://127.0.0.1:8000/exam/coding-filter/";

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
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch questions");
      }

      const data = await response.json();
      const questionsWithType = data.map((q: any) => ({
        ...q,
        type: questionType,
        question_text: q.question_text || q.title || "",
      }));

      setAllQuestions(questionsWithType);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to fetch questions: ${errorMessage}`);
      toast.error(`Failed to fetch questions: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (index: number, type: "mcq" | "code") => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      type,
      question_text: "",
      option_a: type === "mcq" ? "" : undefined,
      option_b: type === "mcq" ? "" : undefined,
      option_c: type === "mcq" ? "" : undefined,
      option_d: type === "mcq" ? "" : undefined,
      correct_option: type === "mcq" ? "A" : undefined,
      title: type === "code" ? "" : undefined,
      description: type === "code" ? "" : undefined,
      starter_code: type === "code" ? "" : undefined,
      test_cases: type === "code" ? [] : undefined,
      difficulty: "Easy",
      points: 1.0,
      language: updatedQuestions[index].language || "Python",
    };
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
    const questionWithType = { ...question, type: currentType };

    if (currentType === "mcq") {
      if (!selectedQuestions.some((q) => q.id === question.id)) {
        setSelectedQuestions((prev) => [...prev, questionWithType]);
        toast.success("MCQ question added to exam");
      }
    } else {
      if (!codingQuestions.some((q) => q.id === question.id)) {
        setCodedQuestions((prev) => [...prev, questionWithType]);
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

  const submitQuestions = async (token: string) => {
    const createdMCQIds: number[] = [];
    const createdCodingIds: number[] = [];

    // Process MCQs
    const mcqPromises = questions
      .filter((q) => q.type === "mcq" && validateQuestion(q))
      .map(async (q) => {
        try {
          const response = await fetch(MCQ_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              question_text: q.question_text,
              option_a: q.option_a,
              option_b: q.option_b,
              option_c: q.option_c,
              option_d: q.option_d,
              correct_option: q.correct_option,
              difficulty: q.difficulty,
              points: q.points || 1.0,
              language: q.language,
              source: "exam_ui",
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create MCQ");
          }

          const data = await response.json();
          createdMCQIds.push(data.id);
          return data;
        } catch (error) {
          console.error("Error creating MCQ:", error);
          throw error;
        }
      });

    // Process Coding Questions
    const codingPromises = questions
      .filter((q) => q.type === "code" && validateQuestion(q))
      .map(async (q) => {
        try {
          const response = await fetch(CODING_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: q.title || q.question_text,
              description: q.description || "",
              difficulty: q.difficulty,
              starter_code: q.starter_code || "",
              points: q.points || 1.0,
              language: q.language,
              source: "exam_ui",
              tags: q.tags || [],
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to create coding question"
            );
          }

          const data = await response.json();
          createdCodingIds.push(data.id);
          return data;
        } catch (error) {
          console.error("Error creating coding question:", error);
          throw error;
        }
      });

    await Promise.all([...mcqPromises, ...codingPromises]);
    return { createdMCQIds, createdCodingIds };
  };

  const submitExam = async () => {
    const token = getTokenFromCookies();
    if (!token) {
      throw new Error("Authentication token missing");
    }

    setDebugInfo("Starting exam creation...");

    // Submit new questions
    const { createdMCQIds, createdCodingIds } = await submitQuestions(token);

    // Create exam
    const examData = {
      title: examTitle,
      duration: examDuration,
      MCQQuestions: [...selectedQuestions.map((q) => q.id), ...createdMCQIds],
      CodingQuestions: [
        ...codingQuestions.map((q) => q.id),
        ...createdCodingIds,
      ],
    };

    const response = await fetch(EXAM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(examData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create exam");
    }

    return response.json();
  };

  const resetForm = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setDebugInfo("Starting validation...");

    try {
      // Validate exam info
      if (!examTitle.trim()) {
        toast.error("Exam title is required");
        return;
      }

      // Validate questions
      const invalidQuestions = questions.filter((q) => !validateQuestion(q));
      if (invalidQuestions.length > 0) {
        toast.error(`${invalidQuestions.length} questions are incomplete`);
        return;
      }

      // Process submission
      await submitExam();
      toast.success("Exam created successfully!");

      // Reset form
      resetForm();
    } catch (error) {
      let errorMessage = "Failed to create exam";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("401")) {
          errorMessage = "Authentication expired - please log in again";
        } else if (error.message.includes("400")) {
          errorMessage = "Invalid data - please check your questions";
        }
      }
      toast.error(errorMessage);
      setDebugInfo(`Error: ${errorMessage}\n${new Date().toISOString()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return <Badge variant="success">{difficulty}</Badge>;
      case "Medium":
        return <Badge variant="warning">{difficulty}</Badge>;
      case "Hard":
        return <Badge variant="destructive">{difficulty}</Badge>;
      default:
        return <Badge>{difficulty}</Badge>;
    }
  };

  const filteredQuestions =
    selectedDifficulty === "all"
      ? allQuestions
      : allQuestions.filter((q) => q.difficulty === selectedDifficulty);

  const displayedQuestions = showAllQuestions
    ? filteredQuestions
    : filteredQuestions.slice(0, 4);

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <ToastContainer position="top-right" autoClose={5000} />

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
                              <TableCell className="text-right">
                                <Button
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
                                    <span>|</span>
                                    <span>
                                      Points: {question.points || 1.0}
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
                                    <span>|</span>
                                    <span>
                                      Points: {question.points || 1.0}
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
                              onChange={(e) => {
                                const updatedQuestions = [...questions];
                                if (question.type === "mcq") {
                                  updatedQuestions[index].question_text =
                                    e.target.value;
                                } else {
                                  updatedQuestions[index].title =
                                    e.target.value;
                                  updatedQuestions[index].question_text =
                                    e.target.value;
                                }
                                setQuestions(updatedQuestions);
                              }}
                            />
                          </div>

                          {question.type === "code" && (
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                placeholder="Enter the question description"
                                className="min-h-[100px]"
                                value={question.description || ""}
                                onChange={(e) => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[index].description =
                                    e.target.value;
                                  setQuestions(updatedQuestions);
                                }}
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label>Language</Label>
                            <Select
                              value={question.language}
                              onValueChange={(value) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].language = value;
                                setQuestions(updatedQuestions);
                              }}
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
                              onValueChange={(value) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].difficulty = value as
                                  | "Easy"
                                  | "Medium"
                                  | "Hard";
                                setQuestions(updatedQuestions);
                              }}
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
                              value={question.points || 1.0}
                              onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].points =
                                  parseFloat(e.target.value) || 1.0;
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
                                onValueChange={(value) => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[index].correct_option =
                                    value;
                                  setQuestions(updatedQuestions);
                                }}
                              >
                                {["A", "B", "C", "D"].map((option) => (
                                  <div
                                    key={option}
                                    className="flex items-center space-x-2 space-y-2"
                                  >
                                    <div className="grid gap-1.5">
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value={option}
                                          id={`option-${index}-${option}`}
                                        />
                                        <Label
                                          htmlFor={`option-${index}-${option}`}
                                          className="font-normal"
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
                                      onChange={(e) => {
                                        const updatedQuestions = [...questions];
                                        updatedQuestions[index][
                                          `option_${option.toLowerCase()}` as keyof Question
                                        ] = e.target.value;
                                        setQuestions(updatedQuestions);
                                      }}
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
                                  onChange={(e) => {
                                    const updatedQuestions = [...questions];
                                    updatedQuestions[index].starter_code =
                                      e.target.value;
                                    setQuestions(updatedQuestions);
                                  }}
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Test Cases</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const updatedQuestions = [...questions];
                                      if (!updatedQuestions[index].test_cases) {
                                        updatedQuestions[index].test_cases = [];
                                      }
                                      updatedQuestions[index].test_cases!.push({
                                        input_data: "",
                                        expected_output: "",
                                      });
                                      setQuestions(updatedQuestions);
                                    }}
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
                                                onClick={() => {
                                                  const updatedQuestions = [
                                                    ...questions,
                                                  ];
                                                  updatedQuestions[
                                                    index
                                                  ].test_cases!.splice(
                                                    tcIndex,
                                                    1
                                                  );
                                                  setQuestions(
                                                    updatedQuestions
                                                  );
                                                }}
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
                                                onChange={(e) => {
                                                  const updatedQuestions = [
                                                    ...questions,
                                                  ];
                                                  updatedQuestions[
                                                    index
                                                  ].test_cases![
                                                    tcIndex
                                                  ].input_data = e.target.value;
                                                  setQuestions(
                                                    updatedQuestions
                                                  );
                                                }}
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
                                                onChange={(e) => {
                                                  const updatedQuestions = [
                                                    ...questions,
                                                  ];
                                                  updatedQuestions[
                                                    index
                                                  ].test_cases![
                                                    tcIndex
                                                  ].expected_output =
                                                    e.target.value;
                                                  setQuestions(
                                                    updatedQuestions
                                                  );
                                                }}
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

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
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
