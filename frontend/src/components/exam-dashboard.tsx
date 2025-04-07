// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import Cookies from "js-cookie";
// import ExamHeader from "./exam-header";
// import QuestionList from "./question-list";
// import CodingQuestion from "./coding-question";
// import MultipleChoiceQuestion from "./multiple-choice-question";
// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// export default function ExamDashboard() {
//   const router = useRouter();
//   const { id } = useParams();

//   const [exam, setExam] = useState<any>(null);
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [timeLeft, setTimeLeft] = useState(0); // in seconds
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, any>>({});
//   const [showScoreAlert, setShowScoreAlert] = useState(false);
//   const [score, setScore] = useState(0);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Fetch exam data and questions from API
//   useEffect(() => {
//     if (!id) return;

//     const fetchExamData = async () => {
//       const token = Cookies.get("token");

//       try {
//         setLoading(true);

//         // Fetch exam title
//         const tempExamRes = await fetch(
//           `http://127.0.0.1:8000/exam/temp-exams/${id}/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!tempExamRes.ok) throw new Error("Failed to fetch temp exam");
//         const tempExamData = await tempExamRes.json();

//         // Fetch exam duration
//         const examRes = await fetch(
//           `http://127.0.0.1:8000/exam/exams/${tempExamData.exam}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!examRes.ok) throw new Error("Failed to fetch exam details");
//         const examData = await examRes.json();

//         setExam({
//           id: id,
//           title: tempExamData.title,
//           duration: examData.duration,
//         });

//         setTimeLeft(examData.duration * 60 || 0);

//         // Fetch questions
//         const questionsRes = await fetch(
//           `http://127.0.0.1:8000/exam/exam/temp-exams/${id}/questions/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!questionsRes.ok) throw new Error("Failed to fetch questions");
//         const questionsData = await questionsRes.json();

//         // Transform the questions to match our component structure
//         const formattedQuestions = questionsData.map((q: any) => {
//           if (q.type === "coding") {
//             return {
//               id: q.id,
//               type: "coding",
//               title: q.title || `Question ${q.id}`,
//               description: q.question_text || q.description,
//               starterCode: q.starter_code || "",
//               testCases: q.test_cases || [],
//               language: q.language || "python",
//             };
//           } else {
//             return {
//               id: q.id,
//               type: "multiple-choice",
//               title: q.title || `Question ${q.id}`,
//               question: q.question_text,
//               code: q.code,
//               options: [
//                 { id: "a", text: q.option_a },
//                 { id: "b", text: q.option_b },
//                 { id: "c", text: q.option_c },
//                 { id: "d", text: q.option_d },
//               ],
//               correctAnswer: q.correct_answer,
//             };
//           }
//         });

//         setQuestions(formattedQuestions);

//         // Check if exam was already submitted
//         const stored = localStorage.getItem(`submitted_exam_${id}`);
//         setIsSubmitted(stored === "true");
//       } catch (error) {
//         console.error("Error fetching exam or questions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExamData();
//   }, [id]);

//   // Timer effect
//   useEffect(() => {
//     if (!id) return;

//     const fetchExamData = async () => {
//       const token = Cookies.get("token");

//       try {
//         setLoading(true);

//         // Fetch exam title
//         const tempExamRes = await fetch(
//           `http://127.0.0.1:8000/exam/temp-exams/${id}/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!tempExamRes.ok) throw new Error("Failed to fetch temp exam");
//         const tempExamData = await tempExamRes.json();

//         // Fetch exam duration
//         const examRes = await fetch(
//           `http://127.0.0.1:8000/exam/exams/${tempExamData.exam}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!examRes.ok) throw new Error("Failed to fetch exam details");
//         const examData = await examRes.json();

//         setExam({
//           id: id,
//           title: tempExamData.title,
//           duration: examData.duration,
//         });

//         setTimeLeft(examData.duration * 60 || 0);

//         // Fetch questions
//         const questionsRes = await fetch(
//           `http://127.0.0.1:8000/exam/exam/temp-exams/${id}/questions/`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!questionsRes.ok) throw new Error("Failed to fetch questions");
//         const questionsData = await questionsRes.json();

//         // Combine MCQ and coding questions
//         const allQuestions = [
//           ...questionsData.mcq_questions.map((q: any) => ({
//             id: q.id,
//             type: "multiple-choice",
//             title: q.title || `Question ${q.id}`,
//             question: q.question_text,
//             code: q.code,
//             options: [
//               { id: "a", text: q.option_a },
//               { id: "b", text: q.option_b },
//               { id: "c", text: q.option_c },
//               { id: "d", text: q.option_d },
//             ],
//             correctAnswer: q.correct_answer,
//             language: q.language || "python",
//           })),
//           ...questionsData.coding_questions.map((q: any) => ({
//             id: q.id,
//             type: "coding",
//             title: q.title || `Question ${q.id}`,
//             description: q.description,
//             starterCode: q.starter_code || "",
//             testCases: q.test_cases || [],
//             language: q.language || "python",
//           })),
//         ];

//         setQuestions(allQuestions);

//         // Check if exam was already submitted
//         const stored = localStorage.getItem(`submitted_exam_${id}`);
//         setIsSubmitted(stored === "true");
//       } catch (error) {
//         console.error("Error fetching exam or questions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExamData();
//   }, [id]);

//   const handleAnswerChange = (questionId: string, answer: any) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: answer,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (isSubmitted) {
//       alert("You have already submitted this exam.");
//       return;
//     }

//     const token = Cookies.get("token");

//     // Format answers for submission
//     const formattedAnswers: Record<string, any> = {};

//     // Format MCQ answers
//     const mcqAnswers: Record<string, string> = {};

//     // Format coding answers
//     const codingAnswers: Record<string, string> = {};

//     Object.entries(answers).forEach(([questionId, answer]) => {
//       const question = questions.find((q) => q.id.toString() === questionId);
//       if (question) {
//         if (question.type === "multiple-choice") {
//           mcqAnswers[questionId] = answer;
//         } else if (question.type === "coding") {
//           codingAnswers[questionId] = answer;
//         }
//       }
//     });

//     try {
//       const response = await fetch(
//         `http://127.0.0.1:8000/exam/exam-answers/submit-answers/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             exam_instance: id,
//             mcq_answers: mcqAnswers,
//             coding_answers: codingAnswers,
//           }),
//         }
//       );
//       if (response.ok) {
//         const result = await response.json();
//         setScore(result.score || 0);
//         setShowScoreAlert(true);
//         setIsSubmitted(true);
//         localStorage.setItem(`submitted_exam_${id}`, "true");
//       } else {
//         const errorText = await response.text();
//         console.error(`Error: ${errorText}`);
//         alert(`Error submitting exam: ${errorText}`);
//       }
//     } catch (error) {
//       console.error("Error submitting the exam:", error);
//       alert("Error submitting the exam. Please try again.");
//     }
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrevQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex((prev) => prev - 1);
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading exam...
//       </div>
//     );
//   if (!exam)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Exam not found
//       </div>
//     );

//   const currentQuestion = questions[currentQuestionIndex] || null;

//   if (!currentQuestion)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         No questions available
//       </div>
//     );

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <ExamHeader
//         title={exam.title}
//         timeLeft={formatTime(timeLeft)}
//         onSubmit={handleSubmit}
//       />

//       <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
//           <QuestionList
//             questions={questions}
//             currentIndex={currentQuestionIndex}
//             onSelectQuestion={setCurrentQuestionIndex}
//             answers={answers}
//           />
//         </div>

//         <div className="md:col-span-3 bg-white rounded-lg shadow">
//           {currentQuestion.type === "coding" ? (
//             <CodingQuestion
//               question={currentQuestion}
//               onAnswerChange={(answer) =>
//                 handleAnswerChange(currentQuestion.id, answer)
//               }
//               answer={
//                 answers[currentQuestion.id] || currentQuestion.starterCode
//               }
//             />
//           ) : (
//             <MultipleChoiceQuestion
//               question={currentQuestion}
//               onAnswerChange={(answer) =>
//                 handleAnswerChange(currentQuestion.id, answer)
//               }
//               selectedOption={answers[currentQuestion.id]}
//             />
//           )}

//           <div className="p-4 border-t flex justify-between">
//             <Button
//               variant="outline"
//               onClick={handlePrevQuestion}
//               disabled={currentQuestionIndex === 0}
//             >
//               Previous
//             </Button>
//             <Button
//               variant="outline"
//               onClick={handleNextQuestion}
//               disabled={currentQuestionIndex === questions.length - 1}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>

//       <AlertDialog open={showScoreAlert} onOpenChange={setShowScoreAlert}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Exam Completed</AlertDialogTitle>
//             <AlertDialogDescription>
//               Your score: {score}%
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogAction
//               onClick={() => router.push("/dashboard_student")}
//             >
//               Return to Dashboard
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Cookies from "js-cookie"
import ExamHeader from "./exam-header"
import QuestionList from "./question-list"
import CodingQuestion from "./coding-question"
import MultipleChoiceQuestion from "./multiple-choice-question"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ExamDashboard() {
  const router = useRouter()
  const { id } = useParams()

  const [exam, setExam] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0) // in seconds
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showScoreAlert, setShowScoreAlert] = useState(false)
  const [score, setScore] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Fetch exam data and questions from API
  useEffect(() => {
    if (!id) return

    const fetchExamData = async () => {
      const token = Cookies.get("token")

      try {
        setLoading(true)

        // Fetch exam title
        const tempExamRes = await fetch(`http://127.0.0.1:8000/exam/temp-exams/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!tempExamRes.ok) throw new Error("Failed to fetch temp exam")
        const tempExamData = await tempExamRes.json()

        // Fetch exam duration
        const examRes = await fetch(`http://127.0.0.1:8000/exam/exams/${tempExamData.exam}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!examRes.ok) throw new Error("Failed to fetch exam details")
        const examData = await examRes.json()

        setExam({
          id: id,
          title: tempExamData.title,
          duration: examData.duration,
        })

        setTimeLeft(examData.duration * 60 || 0)

        // Fetch questions
        const questionsRes = await fetch(`http://127.0.0.1:8000/exam/exam/temp-exams/${id}/questions/`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!questionsRes.ok) throw new Error("Failed to fetch questions")
        const questionsData = await questionsRes.json()

        // Combine MCQ and coding questions
        const allQuestions = [
          ...questionsData.mcq_questions.map((q: any) => ({
            id: q.id,
            type: "multiple-choice",
            title: q.title || `Question ${q.id}`,
            question: q.question_text,
            code: q.code,
            options: [
              { id: "a", text: q.option_a },
              { id: "b", text: q.option_b },
              { id: "c", text: q.option_c },
              { id: "d", text: q.option_d },
            ],
            correctAnswer: q.correct_answer,
            language: q.language || "python",
          })),
          ...questionsData.coding_questions.map((q: any) => ({
            id: q.id,
            type: "coding",
            title: q.title || `Question ${q.id}`,
            description: q.description,
            starterCode: q.starter_code || "",
            testCases: q.test_cases || [],
            language: q.language || "python",
          })),
        ]

        setQuestions(allQuestions)

        // Check if exam was already submitted
        const stored = localStorage.getItem(`submitted_exam_${id}`)
        setIsSubmitted(stored === "true")
      } catch (error) {
        console.error("Error fetching exam or questions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExamData()
  }, [id])

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isSubmitted])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft <= 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleSubmit = async () => {
    if (isSubmitted) {
      alert("You have already submitted this exam.")
      return
    }

    const token = Cookies.get("token")

    // Format answers for submission
    const mcqAnswers: Record<string, string> = {}
    const codingAnswers: Record<string, string> = {}

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find((q) => q.id.toString() === questionId)
      if (question) {
        if (question.type === "multiple-choice") {
          mcqAnswers[questionId] = answer
        } else if (question.type === "coding") {
          codingAnswers[questionId] = answer
        }
      }
    })

    try {
      const response = await fetch(`http://127.0.0.1:8000/exam/exam-answers/submit-answers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exam_instance: id,
          mcq_answers: mcqAnswers,
          coding_answers: codingAnswers,
        }),
      })
      if (response.ok) {
        const result = await response.json()
        setScore(result.score || 0)
        setShowScoreAlert(true)
        setIsSubmitted(true)
        localStorage.setItem(`submitted_exam_${id}`, "true")
      } else {
        const errorText = await response.text()
        console.error(`Error: ${errorText}`)
        alert(`Error submitting exam: ${errorText}`)
      }
    } catch (error) {
      console.error("Error submitting the exam:", error)
      alert("Error submitting the exam. Please try again.")
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">Loading exam...</div>
    )
  if (!exam)
    return <div className="flex justify-center items-center h-screen bg-background text-foreground">Exam not found</div>

  const currentQuestion = questions[currentQuestionIndex] || null

  if (!currentQuestion)
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground">
        No questions available
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-6 bg-background">
      <ExamHeader title={exam.title} timeLeft={formatTime(timeLeft)} onSubmit={handleSubmit} />

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
              question={currentQuestion}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
              answer={answers[currentQuestion.id] || currentQuestion.starterCode}
            />
          ) : (
            <MultipleChoiceQuestion
              question={currentQuestion}
              onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
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
            <AlertDialogDescription>Your score: {score}%</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/dashboard_student")}>Return to Dashboard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

