"use client"

import { Loader2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useDeleteStudent } from "../hooks/use-students"
import type { Student } from "../types"

interface DeleteStudentDialogProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

export function DeleteStudentDialog({ isOpen, onClose, student }: DeleteStudentDialogProps) {
  const { toast } = useToast()
  const { mutate: deleteStudent, isPending } = useDeleteStudent()

  const handleDelete = () => {
    if (!student) return

    deleteStudent(student.id, {
      onSuccess: () => {
        toast({
          title: "Student deleted",
          description: "The student has been deleted successfully.",
        })
        onClose()
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `Failed to delete student: ${error.message}`,
          variant: "destructive",
        })
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold">{student?.name}</span>'s record and remove their data from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button className="bg-[#007acc] hover:bg-[#007abc]" variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

