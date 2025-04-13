// 'use client'
// import { Suspense, useEffect, useState } from "react"
// import { notFound } from "next/navigation"
// import { ExamLogsTable } from "../../../../components/exam-logs-table"
// import { ExamLogsHeader } from "../../../../components/exam-logs-header"
// import { getExamLogs } from "@/lib/api"

// // Import the ExamLog type from the correct module
// import { ExamLog } from "@/lib/types"

// interface ExamLogsPageProps {
//   params: {
//     id: string
//   }
// }

// const getAuthToken = () => {
//   if (typeof window !== 'undefined') {
//     const token = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('token='))
//       ?.split('=')[1]
//     return token || ''
//   }
//   return ''
// }

// export default function ExamLogsPage({ params }: ExamLogsPageProps) {
//   const { id } = params

//   if (!id || isNaN(Number(id))) {
//     notFound()
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <ExamLogsHeader examId={id} />
//       <Suspense fallback={<ExamLogsTableSkeleton />}>
//         <ExamLogsContent examId={id} />
//       </Suspense>
//     </div>
//   )
// }

// function ExamLogsContent({ examId }: { examId: string }) {
//   const [token, setToken] = useState<string | null>(null)
//   const [logs, setLogs] = useState<ExamLog[]>([])

//   useEffect(() => {
//     // استخراج التوكن عند تحميل الصفحة في العميل
//     const token = getAuthToken()
//     setToken(token)

//     if (token) {
//       const fetchLogs = async () => {
//         const logs = await getExamLogs(examId, token)
//         setLogs(logs)
//       }
//       fetchLogs()
//     }
//   }, [examId])

//   if (!token) {
//     return (
//       <div className="mt-8 text-center p-8 bg-muted rounded-lg">
//         <h3 className="text-xl font-medium">No token found</h3>
//         <p className="text-muted-foreground mt-2">Please log in to view the logs.</p>
//       </div>
//     )
//   }

//   if (!logs || logs.length === 0) {
//     return (
//       <div className="mt-8 text-center p-8 bg-muted rounded-lg">
//         <h3 className="text-xl font-medium">No logs found</h3>
//         <p className="text-muted-foreground mt-2">There are no logs available for this exam.</p>
//       </div>
//     )
//   }

//   return <ExamLogsTable logs={logs} />
// }

// function ExamLogsTableSkeleton() {
//   return (
//     <div className="mt-8 space-y-3">
//       <div className="h-10 bg-muted rounded animate-pulse" />
//       <div className="space-y-2">
//         {Array.from({ length: 5 }).map((_, i) => (
//           <div key={i} className="h-16 bg-muted rounded animate-pulse" />
//         ))}
//       </div>
//     </div>
//   )
// }



'use client'
import { Suspense, useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { ExamLogsTable } from "../../../../components/exam-logs-table"
import { ExamLogsHeader } from "../../../../components/exam-logs-header"
import { getExamLogs } from "@/lib/api"
import { api } from "@/lib/api";


// Import the ExamLog type from the correct module
import { ExamLog } from "@/lib/types"

// Change the function signature to use React.use
interface ExamLogsPageProps {
  params: Promise<{ id: string }>
}

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1]
    return token || ''
  }
  return ''
}

export default function ExamLogsPage({ params }: ExamLogsPageProps) {
  const [examId, setExamId] = useState<string | null>(null)

  useEffect(() => {
    // Unwrap the Promise to get the `id` value
    params.then(param => {
      const { id } = param
      if (!id || isNaN(Number(id))) {
        notFound()
      } else {
        setExamId(id)
      }
    })
  }, [params])

  if (!examId) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <ExamLogsHeader examId={examId} />
      <Suspense fallback={<ExamLogsTableSkeleton />}>
        <ExamLogsContent examId={examId} />
      </Suspense>
    </div>
  )
}

function ExamLogsContent({ examId }: { examId: string }) {
  const [token, setToken] = useState<string | null>(null)
  const [logs, setLogs] = useState<ExamLog[]>([])

  useEffect(() => {
 
    const token = getAuthToken()
    setToken(token)

    if (token) {
      const fetchLogs = async () => {
        const logs = await getExamLogs(examId, token)
        setLogs(logs)
      }
      fetchLogs()
    }
  }, [examId])

  if (!token) {
    return (
      <div className="mt-8 text-center p-8 bg-muted rounded-lg">
        <h3 className="text-xl font-medium">No token found</h3>
        <p className="text-muted-foreground mt-2">Please log in to view the logs.</p>
      </div>
    )
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="mt-8 text-center p-8 bg-muted rounded-lg">
        <h3 className="text-xl font-medium">No logs found</h3>
        <p className="text-muted-foreground mt-2">There are no logs available for this exam.</p>
      </div>
    )
  }

  return <ExamLogsTable logs={logs} />
}

function ExamLogsTableSkeleton() {
  return (
    <div className="mt-8 space-y-3">
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}
