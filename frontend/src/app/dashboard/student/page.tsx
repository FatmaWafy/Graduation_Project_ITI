"use client";
import { useEffect, useState } from "react";

export default function StudentDashboard() {
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("role") || "");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-green-600">Welcome, Student! 🎓</h1>
    </div>
  );
}
