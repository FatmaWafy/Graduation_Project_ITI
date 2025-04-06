import { Suspense } from "react"
import ExamDashboard from "@/components/exam-dashboard"

export default function ExamPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <ExamDashboard />
      </Suspense>
    </main>
  )
}

