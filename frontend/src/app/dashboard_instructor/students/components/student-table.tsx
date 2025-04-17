"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, Trash2, Search, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteStudentDialog } from "./delete-student-dialog"
import type { Student } from "../types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StudentTableProps {
  students: Student[]
  isLoading: boolean
  onEdit: (student: Student) => void
  onView: (studentId: number) => void
}

export function StudentTable({ students, isLoading, onEdit, onView }: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  const columns: ColumnDef<Student>[] = [
    {
      id: "name",
      accessorFn: (row) => row.user.username,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-[#f0f9ff]"
          >
            Student
            {{
              asc: <ChevronUp className="ml-2 h-4 w-4 text-[#007acc]" />,
              desc: <ChevronDown className="ml-2 h-4 w-4 text-[#007acc]" />,
            }[column.getIsSorted() as string] ?? <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onView(row.original.id)}>
          <Avatar className="h-8 w-8 border border-[#e6f4ff]">
            <AvatarImage src={row.original.user.profile_image || ""} alt={row.original.user.username} />
            <AvatarFallback className="bg-[#f0f9ff] text-[#007acc]">
              {row.original.user.username?.charAt(0).toUpperCase() || "S"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.user.username}</div>
          </div>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => <div className="font-mono text-sm text-muted-foreground">{row.original.user.email}</div>,
    },
    {
      id: "track",
      accessorFn: (row) => row.track?.name || "Not assigned",
      header: "Track",
      cell: ({ row }) => <div className="text-sm">{row.original.track?.name || "Not assigned"}</div>,
    },
    {
      id: "branch",
      accessorFn: (row) => row.branch?.name || "Not assigned",
      header: "Branch",
      cell: ({ row }) => <div className="text-sm">{row.original.branch?.name || "Not assigned"}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original

        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onView(student.id)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setStudentToDelete(student)
                    setDeleteDialogOpen(true)
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  if (isLoading) {
    return <StudentTableSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="pl-9 w-full sm:max-w-sm bg-white"
          />
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {students.length} students
        </div>
      </div>

      <div className="rounded-md border border-[#e6f4ff] overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-[#f8fafc]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-[#f0f9ff]/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[#64748b] font-medium">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-[#f0f9ff]/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-[#e6f4ff] hover:bg-[#f0f9ff] hover:text-[#007acc]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-[#e6f4ff] hover:bg-[#f0f9ff] hover:text-[#007acc]"
          >
            Next
          </Button>
        </div>
      </div>

      <DeleteStudentDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        student={studentToDelete}
      />
    </div>
  )
}

function StudentTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-6 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[150px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[120px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-[80px]" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-[120px]" />
                      <Skeleton className="h-3 w-[80px] mt-1" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[180px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
