import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ExamLogsHeaderProps {
  examId: string
}

export function ExamLogsHeader({ examId }: ExamLogsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <Link href="/exams" passHref>
          <Button variant="ghost" size="sm" className="mb-2 h-8 pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exams
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Exam Logs
        </h1>
        <p className="text-muted-foreground mt-1">Viewing logs for Exam #{examId}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">Export Logs</Button>
        <Button variant="default">Refresh</Button>
      </div>
    </div>
  )
}

