"use client"
import { AlertTriangle, Camera, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"


export default function ExamRulesPage() {
    const { id } = useParams()
    const router = useRouter()
    const [isViolated, setIsViolated] = useState(false)
    const [violationReason, setViolationReason] = useState("")
    const [loading, setLoading] = useState(true)

useEffect(() => {
    // Check if exam has been violated
    const examId = Array.isArray(id) ? id[0] : id
    const violated = localStorage.getItem(`exam_violated_${examId}`) === "true"

    if (violated) {
      setIsViolated(true)
      setViolationReason(localStorage.getItem(`exam_violation_reason_${examId}`) || "Exam rules violation")
    }

    setLoading(false)
  }, [id])

  const startExam = () => {
    if (isViolated) {
      alert("You cannot take this exam due to previous violations.")
      return
    }

    const examId = Array.isArray(id) ? id[0] : id
    router.push(`/dashboard_student/exams/exam/${examId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    )
  }
  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 bg-black text-white">
      <div className="border-2 border-black rounded-lg overflow-hidden">
        <div className="bg-gray-800 text-black p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Exam Rules & Instructions</h1>
        </div>
  
        <div className="p-8 space-y-8 bg-black">
          <div className="text-center mb-6">
            <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-2" />
            <p className="text-lg font-semibold">Please read all rules carefully before starting the exam</p>
          </div>
  
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 border border-gray-700 rounded-lg">
              <Copy className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-1">No Copying Allowed</h3>
                <p>
                  Copying any content during the exam is strictly prohibited. If you attempt to copy any material, you
                  will be immediately removed from the exam.
                </p>
              </div>
            </div>
  
            <div className="flex items-start gap-4 p-4 border border-gray-700 rounded-lg">
              <ExternalLink className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-1">No Tab Switching</h3>
                <p>
                  Navigating away from the exam tab is not allowed. If you switch to another tab or application, you
                  will be immediately removed from the exam.
                </p>
              </div>
            </div>
  
            <div className="flex items-start gap-4 p-4 border border-gray-700 rounded-lg">
              <Camera className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-1">Camera Must Stay On</h3>
                <p>
                  Your camera must remain on throughout the exam. Make sure you stay within the camera frame. If you
                  receive 5 alerts about being out of frame, you will be removed from the exam.
                </p>
              </div>
            </div>
          </div>
  
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="font-medium text-center">
              By clicking "Start Exam", you agree to follow all the rules stated above.
            </p>
          </div>
      
  
          {isViolated && (
            <div className="bg-red-900 border border-red-500 text-white p-4 rounded-lg">
              <p className="font-bold text-center">You cannot take this exam</p>
              <p className="text-center">Reason: {violationReason}</p>
            </div>
          )}
        </div>
  
        <div className="border-t border-gray-700 p-6 flex justify-center bg-black">
          {isViolated ? (
            <Link href="/dashboard_student">
              <button className="px-8 py-2 bg-gray-600 text-white rounded-md">Return to Dashboard</button>
            </Link>
          ) : (
            <button onClick={startExam} className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
              Start Exam
            </button>
          )}
        </div>
      </div>
    </div>
  )
}  