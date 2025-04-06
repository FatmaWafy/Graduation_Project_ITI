"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Clock } from "lucide-react"

interface ExamHeaderProps {
  title: string
  timeLeft: string
  onSubmit: () => void
}

export default function ExamHeader({ title, timeLeft, onSubmit }: ExamHeaderProps) {
  const isTimeRunningOut = timeLeft.startsWith("00") && Number.parseInt(timeLeft.split(":")[1]) < 30

  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-2xl font-bold mb-4 md:mb-0">{title}</h1>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${isTimeRunningOut ? "text-red-500" : ""}`}>
          <Clock className="h-5 w-5" />
          <span className="text-lg font-mono">{timeLeft}</span>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default">Submit Exam</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Once submitted, you cannot return to the exam. Make sure you have answered all questions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSubmit}>Submit</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

