"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export default function AddStudentPage() {
  const [studentData, setStudentData] = useState({
    username: "",
    email: "",
    university: "",
    graduation_year: "",
    college: "",
    leetcode_profile: "",
    github_profile: "",
    track_name: "",
  });

  const [tracks, setTracks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const accessToken = Cookies.get("token");
        if (!accessToken) {
          console.error("❌ No authentication token found.");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/users/get-tracks/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = await response.json();
        if (response.ok) {
          setTracks(data.tracks);
        } else {
          console.error("❌ Failed to fetch tracks:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching tracks:", error);
      }
    };

    fetchTracks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = Cookies.get("token");

    if (!accessToken) {
      alert("❌ Authentication Error: No token found. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/register-student/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Student added successfully!");
      } else {
        alert(`❌ Error: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error("❌ Request Error:", error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-4xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">📚 Register a New Student</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input type="text" name="username" placeholder="Username" value={studentData.username} onChange={handleChange} required />
            <Input type="email" name="email" placeholder="Email" value={studentData.email} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="text" name="university" placeholder="University" value={studentData.university} onChange={handleChange} />
            <Input type="number" name="graduation_year" placeholder="Graduation Year" value={studentData.graduation_year} onChange={handleChange} />
          </div>

          <Input type="text" name="college" placeholder="College" value={studentData.college} onChange={handleChange} />
          <Input type="url" name="leetcode_profile" placeholder="LeetCode Profile URL" value={studentData.leetcode_profile} onChange={handleChange} />
          <Input type="url" name="github_profile" placeholder="GitHub Profile URL" value={studentData.github_profile} onChange={handleChange} />

          {/* 🔹 Dropdown لاختيار التراك */}
          <Select onValueChange={(value) => setStudentData({ ...studentData, track_name: value })}>
            <SelectTrigger className="w-full">{studentData.track_name || "Select Track"}</SelectTrigger>
            <SelectContent>
              {tracks.map((track) => (
                <SelectItem key={track} value={track}>
                  {track}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-500" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Register Student"}
          </Button>
        </form>
      </Card>
    </div>
  );
}