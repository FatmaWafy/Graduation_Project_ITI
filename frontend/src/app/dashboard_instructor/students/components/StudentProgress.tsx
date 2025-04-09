'use client'

import { useEffect, useState } from "react"
import { Github, Code } from "lucide-react"

type ExternalStats = {
  github_repos: number | null
  leetcode_solved: number | null
}

export default function StudentProgress({ studentId }: { studentId: number }) {
  const [externalStats, setExternalStats] = useState<ExternalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExternalStats = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/users/students/${studentId}/external-stats/`)
        if (!res.ok) throw new Error("Failed to fetch external stats")
        const data = await res.json()
        setExternalStats(data)
      } catch (error) {
        console.error("Error fetching external stats:", error)
        setExternalStats(null)
      } finally {
        setLoading(false)
      }
    }

    fetchExternalStats()
  }, [studentId])

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  return (
    <div className="grid grid-cols-2 gap-6 justify-items-center">
      {/* GitHub */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted stroke-current"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="2"
            />
            <path
              className="text-primary stroke-current"
              strokeDasharray={`${Math.min((externalStats?.github_repos || 0) * 10, 100)}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="2"
            />
            <text x="18" y="20.35" className="text-sm fill-primary" textAnchor="middle">
              {externalStats?.github_repos || 0}
            </text>
          </svg>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Github className="h-4 w-4 text-muted-foreground" />
          GitHub Repos
        </div>
      </div>

      {/* LeetCode */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted stroke-current"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="2"
            />
            <path
              className="text-green-500 stroke-current"
              strokeDasharray={`${Math.min((externalStats?.leetcode_solved || 0) / 2, 100)}, 100`}
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="2"
            />
            <text x="18" y="20.35" className="text-sm fill-green-500" textAnchor="middle">
              {externalStats?.leetcode_solved || 0}
            </text>
          </svg>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Code className="h-4 w-4 text-muted-foreground" />
          LeetCode Solved
        </div>
      </div>
    </div>
  )
}
