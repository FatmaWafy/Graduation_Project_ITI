"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { type Assignment, getAssignments } from "@/lib/api"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await getAssignments()
        setAssignments(data)
      } catch (error) {
        console.error("Error fetching assignments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const pendingAssignments = assignments.filter((a) => a.status === "pending")
  const completedAssignments = assignments.filter((a) => a.status === "completed")
  const overdueAssignments = assignments.filter((a) => a.status === "overdue")

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">View and manage your assignments</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueAssignments.length})</TabsTrigger>
          <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 pt-4">
          {pendingAssignments.length === 0 ? (
            <p className="text-center text-muted-foreground">No pending assignments</p>
          ) : (
            pendingAssignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 pt-4">
          {completedAssignments.length === 0 ? (
            <p className="text-center text-muted-foreground">No completed assignments</p>
          ) : (
            completedAssignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4 pt-4">
          {overdueAssignments.length === 0 ? (
            <p className="text-center text-muted-foreground">No overdue assignments</p>
          ) : (
            overdueAssignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 pt-4">
          {assignments.length === 0 ? (
            <p className="text-center text-muted-foreground">No assignments</p>
          ) : (
            assignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const statusIcons = {
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    completed: <CheckCircle className="h-5 w-5 text-green-500" />,
    overdue: <AlertCircle className="h-5 w-5 text-red-500" />,
  }

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    completed: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    overdue: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>{assignment.courseName}</CardDescription>
          </div>
          <Badge className={statusColors[assignment.status]}>
            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">{assignment.description}</p>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              {statusIcons[assignment.status]}
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

