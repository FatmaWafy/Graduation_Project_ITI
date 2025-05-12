"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Search, ArrowUpDown } from "lucide-react";
import type { User } from "@/app/dashboard_admin/types";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function InstructorTable() {
  const [applicants, setApplicants] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const origin = process.env.NEXT_PUBLIC_API_URL;
  const { toast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "approve" | "reject";
    user: User | null;
  }>({
    isOpen: false,
    type: "approve",
    user: null,
  });
  // const origin = "http://127.0.0.1:8000";
  // Fetch pending instructors
  useEffect(() => {
    const fetchPendingInstructors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${origin}/users/instructors/pending`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pending instructors");
        }
        const data = await response.json();
        setApplicants(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load pending instructors",
          variant: "destructive",
        });
        console.error("Error fetching pending instructors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingInstructors();
  }, []);

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant?.name
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase() ?? "") ||
      applicant?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase() ?? "")
  );
  const handleApprove = async (user: User) => {
    try {
      const response = await fetch(
        `${origin}/users/instructors/approve/${user.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve instructor");
      }

      // Remove the approved user from the local state
      setApplicants(applicants.filter((applicant) => applicant.id !== user.id));

      toast({
        title: "Instructor Approved",
        description: `${user.name} has been approved as an instructor.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve instructor. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to approve instructor:", error);
    }
    setConfirmDialog({ isOpen: false, type: "approve", user: null });
  };

  const handleReject = async (user: User) => {
    try {
      const response = await fetch(
        `${origin}/users/instructors/reject/${user.id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject instructor");
      }

      // Remove the rejected user from the local state
      setApplicants(applicants.filter((applicant) => applicant.id !== user.id));

      toast({
        title: "Instructor Rejected",
        description: `${user.name}'s application has been rejected.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject instructor. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to reject instructor:", error);
    }
    setConfirmDialog({ isOpen: false, type: "reject", user: null });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007acc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Email
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Branch</TableHead>

              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {applicants.length === 0
                    ? "No pending instructor applications."
                    : "No matching applicants found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredApplicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">
                    {applicant.name}
                  </TableCell>
                  <TableCell>{applicant.email}</TableCell>
                  <TableCell>{applicant.branch || "N/A"}</TableCell>

                  <TableCell>
                    {new Date(applicant.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                        onClick={() =>
                          setConfirmDialog({
                            isOpen: true,
                            type: "approve",
                            user: applicant,
                          })
                        }
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() =>
                          setConfirmDialog({
                            isOpen: true,
                            type: "reject",
                            user: applicant,
                          })
                        }
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "approve"
                ? "Approve Instructor Application"
                : "Reject Instructor Application"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "approve"
                ? "This will change the user's role to instructor. Are you sure?"
                : "This will reject the user's application. Are you sure?"}
            </DialogDescription>
          </DialogHeader>
          {confirmDialog.user && (
            <div className="py-4 space-y-2">
              <p>
                <strong>Name:</strong> {confirmDialog.user.name}
              </p>
              <p>
                <strong>Email:</strong> {confirmDialog.user.email}
              </p>
              <p>
                <strong>Branch:</strong> {confirmDialog.user.branch || "N/A"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog({ ...confirmDialog, isOpen: false })
              }
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmDialog.type === "approve" ? "default" : "destructive"
              }
              onClick={() => {
                if (confirmDialog.user) {
                  if (confirmDialog.type === "approve") {
                    handleApprove(confirmDialog.user);
                  } else {
                    handleReject(confirmDialog.user);
                  }
                }
              }}
            >
              {confirmDialog.type === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
