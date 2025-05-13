"use client"

import { Button } from "@/components/ui/button"
import { Shield, Users, School } from "lucide-react"
import { InstructorTable } from "@/components/instructor-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import type { User } from "@/app/dashboard_admin/types"

export default function InstructorApprovalPage() {
  const { user, loading: authLoading } = useAuth() // Ensure this is at the top level
  const [applicants, setApplicants] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const origin = process.env.NEXT_PUBLIC_API_URL

  // Fetch pending instructors for stats
  useEffect(() => {
    const fetchPendingInstructors = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${origin}/users/instructors/pending`)
        if (!response.ok) {
          throw new Error("Failed to fetch pending instructors")
        }
        const data = await response.json()
        setApplicants(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingInstructors()
  }, [])

  // Calculate stats
  const totalApplicants = applicants.length
  const uniqueBranches = new Set(applicants.map((app) => app.branch)).size

  return (
    <div className="w-full space-y-6 max-w-none">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Instructor Applications</h1>
          <p className="text-muted-foreground">Review and manage instructor applications</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full max-w-none">
        <Card className="bg-white border-gray-100 overflow-hidden shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-900">Pending Applications</CardTitle>
            <CardDescription>Users waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{isLoading ? "..." : totalApplicants}</span>
              <Users className="h-8 w-8 text-[#A61B1B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 overflow-hidden shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-900">Branches</CardTitle>
            <CardDescription>Unique branch locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">{isLoading ? "..." : uniqueBranches}</span>
              <School className="h-8 w-8 text-[#A61B1B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-100 overflow-hidden shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-900">Admin Controls</CardTitle>
            <CardDescription>Manage instructor permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">Active</span>
              <Shield className="h-8 w-8 text-[#A61B1B]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <h2 className="text-xl font-semibold text-red-600">Error Loading Applications</h2>
              <p className="mt-2 text-muted-foreground">{error.message}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700"
                variant="destructive"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-100 shadow-sm w-full">
          <CardHeader className="pb-3 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">Instructor Applicants</CardTitle>
            <CardDescription>Review and approve instructor applications</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <InstructorTable />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
