"use client";

import { useState } from "react";
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
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Edit,
  Eye,
  Trash2,
  Search,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton";
import { DeleteStudentDialog } from "./delete-student-dialog";
import type { Student } from "../types";
import dayjs from "dayjs";

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  onEdit: (student: Student) => void;
  onView: (studentId: number) => void;
}

export function StudentTable({
  students,
  isLoading,
  onEdit,
  onView,
}: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const columns: ColumnDef<Student>[] = [
    {
      id: "name",
      accessorFn: (row) => row.user.username,
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {{
              asc: <ChevronUp className='ml-2 h-4 w-4' />,
              desc: <ChevronDown className='ml-2 h-4 w-4' />,
            }[column.getIsSorted() as string] ?? (
              <ChevronsUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='font-medium'>{row.original.user.username}</div>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original.user.email}</div>,
    },

    // will continue after edit backend (enrollment_date)
    {
      id: "enrollment_date",
      header: ({ column }) => (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Enrollment Date
          {{
            asc: <ChevronUp className='ml-2 h-4 w-4' />,
            desc: <ChevronDown className='ml-2 h-4 w-4' />,
          }[column.getIsSorted() as string] ?? (
            <ChevronsUpDown className='ml-2 h-4 w-4' />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const rawDate = row.original.enrollment_date;
        if (!rawDate) {
          return <div className='text-red-500'>Invalid Date</div>;
        }

        const date = dayjs(rawDate);
        return date.isValid() ? (
          <div>{date.format("DD/MM/YYYY")}</div>
        ) : (
          <div className='text-red-500'>❌ Invalid Date</div>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;

        return (
          <div className='flex items-center justify-end gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onView(student.id)}
              title='View student details'
            >
              <Eye className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onEdit(student)}
              title='Edit student'
            >
              <Edit className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => {
                setStudentToDelete(student);
                setDeleteDialogOpen(true);
              }}
              title='Delete student'
              className='text-destructive hover:text-destructive'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        );
      },
    },
  ];

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
  });

  if (isLoading) {
    return <StudentTableSkeleton />;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Search className='h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Filter students...'
            // value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            // onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}

            value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>
        <div className='flex items-center gap-2'>
          <p className='text-sm text-muted-foreground'>
            Showing {table.getFilteredRowModel().rows.length} of{" "}
            {students.length} students
          </p>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <DeleteStudentDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        student={studentToDelete}
      />
    </div>
  );
}

function StudentTableSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-[250px]' />
        <Skeleton className='h-4 w-[180px]' />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className='h-6 w-[100px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-6 w-[150px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-6 w-[120px]' />
              </TableHead>
              <TableHead>
                <Skeleton className='h-6 w-[80px]' />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className='h-6 w-[150px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[200px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[100px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-6 w-[100px]' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
