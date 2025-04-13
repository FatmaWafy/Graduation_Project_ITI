"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Student, ApiError } from "../types";

// API base URL - using your specific endpoint
const API_URL = "http://localhost:8000/users/students";

// Helper function to get auth headers from cookies

const getAuthHeaders = () => {
  let token = null;

  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((row) => row.startsWith("token="));
    token = tokenCookie ? tokenCookie.split("=")[1] : null;
  }

  // console.log("  token", token)

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
// Fetch all students
async function fetchStudents(): Promise<Student[]> {
  // console.log("Fetching students with headers:", getAuthHeaders())

  const response = await fetch(`${API_URL}/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = new Error("Failed to fetch students") as ApiError;
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  // console.log("Fetched students data:", data)

  return data;
}

// Fetch a single student by ID
async function fetchStudentById(id: number): Promise<Student> {
  const response = await fetch(`${API_URL}/${id}/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = new Error(
      `Failed to fetch student with ID ${id}`
    ) as ApiError;
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// Add a new student
async function addStudent(student: Omit<Student, "id">): Promise<Student> {
  // console.log("Adding student with data:", student)

  const response = await fetch(`${API_URL}/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    let errorMessage = "Failed to add student";
    try {
      const errorData = await response.json();
      errorMessage = JSON.stringify(errorData);
      // console.error("Error response:", errorData)
    } catch (e) {}

    const error = new Error(errorMessage) as ApiError;
    error.status = response.status;
    throw error;
  }

  return response.json();
}

// Update an existing student
async function updateStudent(student: Student): Promise<Student> {
  const response = await fetch(`${API_URL}/${student.id}/`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(student),
  });
  console.log("API Response:", response);
  if (!response.ok) {
    const error = new Error(
      `Failed to update student with ID ${student.id}`
    ) as ApiError;
    error.status = response.status;
    throw error;
  }

  return response.json();
}
// Delete a student
async function deleteStudent(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/delete-by-student-id/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = new Error(
      `Failed to delete student with ID ${id}`
    ) as ApiError;
    error.status = response.status;
    throw error;
  }
}
// React Query hooks
export function useStudents() {
  const query = useQuery<Student[], ApiError>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  return {
    students: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}

export const useStudentById = (studentId: number) => {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/users/students/by-id/${studentId}/`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch student");
      }
      return res.json();
    },
    enabled: !!studentId, // عشان مايضربش قبل ما الـ id يوصل
  });
};

export function useAddStudent() {
  const queryClient = useQueryClient();

  return useMutation<Student, ApiError, Omit<Student, "id">>({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation<Student, ApiError, Student>({
    mutationFn: updateStudent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", data.id] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
