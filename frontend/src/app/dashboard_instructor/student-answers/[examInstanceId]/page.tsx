"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getClientSideToken } from "@/lib/cookies";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";


interface Answer {
  questionId: string;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  type: "mcq" | "coding";
  codeAnswer?: string;
}

interface ApiResponse {
  exam_title: string;
  student_name: string;
  score: number;
  total_points: number;
  mcq_answers: Record<
    string,
    {
      question_text: string;
      student_answer: string;
      correct_answer: string;
      is_correct: boolean;
    }
  >;
  coding_answers: Record<
    string,
    {
      question_text: string;
      student_answer: string;
      correct_answer: string;
      is_correct: boolean;
      code_answer?: string;
    }
  >;
}

export default function StudentAnswersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { examInstanceId } = params;

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [examData, setExamData] = useState<{
    examTitle: string;
    studentName: string;
    score: number;
    totalPoints: number;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudentAnswers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getClientSideToken();
        if (!token) {
          router.push("/login");
          return;
        }

        const studentName = searchParams.get("student");
        if (!studentName) {
          throw new Error("Student name not provided");
        }

        const response = await fetch(
          api.getStudentAnswersUrl(Number(examInstanceId), studentName),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        setExamData({
          examTitle: data.exam_title,
          studentName: data.student_name,
          score: data.score,
          totalPoints: data.total_points,
        });

        const processedAnswers: Answer[] = [];

        Object.entries(data.mcq_answers).forEach(([questionId, answer]) => {
          processedAnswers.push({
            questionId,
            questionText: answer.question_text,
            studentAnswer: answer.student_answer,
            correctAnswer: answer.correct_answer,
            isCorrect: answer.is_correct,
            type: "mcq",
          });
        });

        Object.entries(data.coding_answers).forEach(([questionId, answer]) => {
          processedAnswers.push({
            questionId,
            questionText: answer.question_text,
            studentAnswer: answer.student_answer,
            correctAnswer: answer.correct_answer,
            isCorrect: answer.is_correct,
            type: "coding",
            codeAnswer: answer.code_answer,
          });
        });

        setAnswers(processedAnswers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student answers:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load student answers"
        );
        setLoading(false);
      }
    };

    if (examInstanceId) {
      fetchStudentAnswers();
    }
  }, [examInstanceId, router, searchParams]);

  const filteredAnswers = answers.filter((answer) =>
    answer.questionText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mcqAnswers = filteredAnswers.filter((answer) => answer.type === "mcq");
  const codingAnswers = filteredAnswers.filter(
    (answer) => answer.type === "coding"
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          Loading student answers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grades
        </Button>
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grades
        </Button>
        <div className="flex justify-center items-center h-64">
          Student exam data not found
        </div>
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grades
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>No Answers Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This student hasn't submitted any answers for this exam.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Grades
      </Button>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {examData.studentName}'s Answers
          </CardTitle>
          <CardDescription>{examData.examTitle}</CardDescription>
          <div className="mt-2 text-lg">
            Score:{" "}
            <span className="font-bold">
              {examData.score}/{examData.totalPoints}
            </span>
          </div>
        </CardHeader>
      </Card>

      <div className="mb-6">
        <Input
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Questions</TabsTrigger>
          <TabsTrigger value="mcq">Multiple Choice</TabsTrigger>
          <TabsTrigger value="coding">Coding</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredAnswers.length > 0 ? (
            filteredAnswers.map((answer, index) => (
              <AnswerCard
                key={answer.questionId}
                answer={answer}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No questions match your search
            </div>
          )}
        </TabsContent>

        <TabsContent value="mcq" className="space-y-6">
          {mcqAnswers.length > 0 ? (
            mcqAnswers.map((answer, index) => (
              <AnswerCard
                key={answer.questionId}
                answer={answer}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No matching multiple choice questions"
                : "No multiple choice answers available"}
            </div>
          )}
        </TabsContent>

        <TabsContent value="coding" className="space-y-6">
          {codingAnswers.length > 0 ? (
            codingAnswers.map((answer, index) => (
              <AnswerCard
                key={answer.questionId}
                answer={answer}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No matching coding questions"
                : "No coding answers available"}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AnswerCard({ answer, index }: { answer: Answer; index: number }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">
            Question {index + 1}: {answer.questionText}
          </CardTitle>
          <CardDescription className="mt-1">
            {answer.type === "mcq"
              ? "Multiple Choice Question"
              : "Coding Question"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {answer.type === "coding" ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Student's Answer:</h4>
              <pre className="bg-slate-100 p-4 rounded-md overflow-x-auto text-sm">
                {answer.codeAnswer || "No code submitted"}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Correct Answer:</h4>
              <pre className="bg-green-50 p-4 rounded-md overflow-x-auto text-sm">
                {answer.correctAnswer}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Student's Answer:</h4>
              <p className="text-gray-800">{answer.studentAnswer}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Correct Answer:</h4>
              <p className="text-green-600">{answer.correctAnswer}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
