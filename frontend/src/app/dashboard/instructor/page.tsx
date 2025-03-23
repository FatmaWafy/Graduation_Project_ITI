"use client";
import { useEffect, useState } from "react";

export default function InstructorDashboard() {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600">Welcome, Instructor! 📚</h1>
    </div>
  );
}
