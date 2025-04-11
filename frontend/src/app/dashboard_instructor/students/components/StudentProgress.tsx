'use client'

import { useEffect, useState } from "react"
import { Github, Code, ExternalLink } from "lucide-react"
import Link from "next/link"

type ExternalStats = {
  github_repos: number | null
  leetcode_solved: number | null
}

type StudentProfile = {
  github_profile: string | null
  leetcode_profile: string | null
}

export default function StudentProgress({ studentId }: { studentId: number }) {
  const [externalStats, setExternalStats] = useState<ExternalStats | null>(null)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [githubCount, setGithubCount] = useState(0)
  const [leetcodeCount, setLeetcodeCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profileRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/users/students/external-stats/by-student-id/${studentId}/`),
          fetch(`http://127.0.0.1:8000/users/students/by-id/${studentId}/`)
        ])

        if (!statsRes.ok || !profileRes.ok) throw new Error("Failed to fetch data")

        const statsData = await statsRes.json()
        const profileData = await profileRes.json()

        setExternalStats(statsData)
        setStudentProfile({
          github_profile: profileData.github_profile,
          leetcode_profile: profileData.leetcode_profile
        })
      } catch (error) {
        console.error("Error fetching progress data:", error)
        setExternalStats(null)
        setStudentProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [studentId])

  // Count-up animation
  useEffect(() => {
    if (!externalStats) return

    const githubTarget = externalStats.github_repos || 0
    const leetcodeTarget = externalStats.leetcode_solved || 0

    let githubInterval = setInterval(() => {
      setGithubCount(prev => {
        if (prev >= githubTarget) {
          clearInterval(githubInterval)
          return githubTarget
        }
        return prev + 1
      })
    }, 30)

    let leetcodeInterval = setInterval(() => {
      setLeetcodeCount(prev => {
        if (prev >= leetcodeTarget) {
          clearInterval(leetcodeInterval)
          return leetcodeTarget
        }
        return prev + 1
      })
    }, 10)

    return () => {
      clearInterval(githubInterval)
      clearInterval(leetcodeInterval)
    }
  }, [externalStats])

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>

  const CircleProgress = ({
    value,
    max,
    color,
  }: {
    value: number
    max: number
    color: string
  }) => {
    const percentage = Math.min((value / max) * 100, 100)
    return (
      <svg viewBox="0 0 36 36" className="w-24 h-24 drop-shadow">
        <path
          className="text-gray-300 stroke-current"
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="3"
        />
        <path
          className={`${color} stroke-current transition-all duration-300`}
          strokeDasharray={`${percentage}, 100`}
          d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="3"
        />
        <text
          x="18"
          y="20.5"
          className={`text-base font-bold ${color.replace("text-", "fill-")}`}
          textAnchor="middle"
        >
          {value}
        </text>
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Student Progress</h2>
      <div className="grid grid-cols-2 gap-6 justify-items-center">

        {/* GitHub */}
        <div className="flex flex-col items-center gap-2">
          <CircleProgress value={githubCount} max={10} color="text-green-500" />
          <div className="flex items-center gap-1 text-sm font-medium">
            <Github className="h-4 w-4 text-muted-foreground" />
            GitHub Repos
            {studentProfile?.github_profile && (
              <Link href={studentProfile.github_profile} target="_blank">
                <ExternalLink className="h-4 w-4 text-blue-500 hover:text-blue-600 ml-1" />
              </Link>
            )}
          </div>
        </div>

        {/* LeetCode */}
        <div className="flex flex-col items-center gap-2">
          <CircleProgress value={leetcodeCount} max={200} color="text-orange-500" />
          <div className="flex items-center gap-1 text-sm font-medium">
            <Code className="h-4 w-4 text-muted-foreground" />
            LeetCode Solved
            {studentProfile?.leetcode_profile && (
              <Link href={`https://leetcode.com/${studentProfile.leetcode_profile}`} target="_blank">
                <ExternalLink className="h-4 w-4 text-blue-500 hover:text-blue-600 ml-1" />
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
