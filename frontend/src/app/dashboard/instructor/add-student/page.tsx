"use client";

import { useState } from "react";

export default function AddStudentPage() {
  const [studentData, setStudentData] = useState({
    username: "",
    email: "",
    university: "",
    graduation_year: "",
    college: "",
    leetcode_profile: "",
    github_profile: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const response = await fetch("http://127.0.0.1:8000/users/register-student/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Student added successfully! Email sent.");
      setStudentData({
        username: "",
        email: "",
        university: "",
        graduation_year: "",
        college: "",
        leetcode_profile: "",
        github_profile: "",
      });
    } else {
      alert(`❌ Error: ${data.error || "Failed to add student."}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">📚 Register a New Student</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={studentData.username}
            onChange={handleChange}
            className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={studentData.email}
            onChange={handleChange}
            className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-300"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="university"
            placeholder="University"
            value={studentData.university}
            onChange={handleChange}
            className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-300"
          />
          <input
            type="number"
            name="graduation_year"
            placeholder="Graduation Year"
            value={studentData.graduation_year}
            onChange={handleChange}
            className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-300"
          />
        </div>

        <input
          type="text"
          name="college"
          placeholder="College"
          value={studentData.college}
          onChange={handleChange}
          className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-300"
        />
        <input
          type="url"
          name="leetcode_profile"
          placeholder="LeetCode Profile URL"
          value={studentData.leetcode_profile}
          onChange={handleChange}
          className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-300"
        />
        <input
          type="url"
          name="github_profile"
          placeholder="GitHub Profile URL"
          value={studentData.github_profile}
          onChange={handleChange}
          className="input input-bordered w-full focus:border-green-500 focus:ring focus:ring-green-300"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-500 transition-all duration-300 shadow-md"
        >
           Register Student
        </button>
      </form>
    </div>
  );
}
