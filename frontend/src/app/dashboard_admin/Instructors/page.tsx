"use client";

import { Button } from "@/components/ui/button";
import { Shield, Users, School } from "lucide-react";
import { InstructorTable } from "@/components/instructor-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import type { User } from "@/app/dashboard_admin/types";

export default function InstructorApprovalPage() {
  const { user, loading: authLoading } = useAuth(); // Ensure this is at the top level
  const [applicants, setApplicants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // const origin = "http://127.0.0.1:8000";

  // Fetch pending instructors for stats
  useEffect(() => {
    const fetchPendingInstructors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/users/instructors/pending`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pending instructors");
        }
        const data = await response.json();
        setApplicants(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingInstructors();
  }, []);

  // Calculate stats
  const totalApplicants = applicants.length;
  const uniqueBranches = new Set(applicants.map((app) => app.branch)).size;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#007acc]">
            Instructor Applications
          </h1>
          <p className="text-muted-foreground">
            Review and manage instructor applications
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-[#f0f9ff] to-white border-[#e6f4ff]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#007acc]">
              Pending Applications
            </CardTitle>
            <CardDescription>Users waiting for approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {isLoading ? "..." : totalApplicants}
              </span>
              <Users className="h-8 w-8 text-[#007acc] opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#f0fff4] to-white border-[#e6ffe6]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-green-600">
              Branches
            </CardTitle>
            <CardDescription>Unique branch locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">
                {isLoading ? "..." : uniqueBranches}
              </span>
              <School className="h-8 w-8 text-green-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#fff0f9] to-white border-[#ffe6f4]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-purple-600">
              Admin Controls
            </CardTitle>
            <CardDescription>Manage instructor permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">Active</span>
              <Shield className="h-8 w-8 text-purple-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {error ? (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <h2 className="text-xl font-semibold text-destructive">
                Error Loading Applications
              </h2>
              <p className="mt-2 text-muted-foreground">{error.message}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="destructive"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-[#e6f4ff] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">
              Instructor Applicants
            </CardTitle>
            <CardDescription>
              Review and approve instructor applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InstructorTable />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
