"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  User,
  BookOpen,
  Calendar,
  Building,
  Code,
  Github,
  FileSpreadsheet,
  Info,
  CheckCircle,
} from "lucide-react"

export default function AddStudentPage() {
  const [studentData, setStudentData] = useState({
    username: "",
    email: "",
    university: "",
    graduation_year: "",
    college: "",
    leetcode_username: "",
    github_profile: "",
    track_name: "",
  })

  const [tracks, setTracks] = useState<{ id: number; name: string }[]>([])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("single")

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const accessToken = Cookies.get("token")
        if (!accessToken) {
          console.error("❌ No authentication token found.")
          return
        }

        const response = await fetch("http://127.0.0.1:8000/users/get-tracks/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })

        const data = await response.json()
        if (response.ok) {
          setTracks(data || [])
        } else {
          console.error("❌ Failed to fetch tracks:", data)
          setTracks([])
        }
      } catch (error) {
        console.error("❌ Error fetching tracks:", error)
        setTracks([])
      }
    }

    fetchTracks()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value })
  }

  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCsvFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const accessToken = Cookies.get("token")

    if (!accessToken) {
      alert("❌ Authentication Error: No token found. Please log in again.")
      return
    }

    setIsSubmitting(true)

    if (activeTab === "bulk") {
      // إذا تم رفع ملف CSV
      if (!csvFile) {
        alert("❌ Please select a CSV file first.")
        setIsSubmitting(false)
        return
      }

      const formData = new FormData()
      formData.append("file", csvFile)

      try {
        const response = await fetch("http://127.0.0.1:8000/users/register-students-excel/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        })

        const data = await response.json()

        if (response.ok) {
          alert(`✅ ${data.message}`)
          setCsvFile(null)
          // Reset file input
          const fileInput = document.getElementById("csv-upload") as HTMLInputElement
          if (fileInput) fileInput.value = ""
        } else {
          alert(`❌ Error: ${JSON.stringify(data, null, 2)}`)
        }
      } catch (error) {
        console.error("❌ Request Error:", error)
        alert("❌ Something went wrong. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // إذا لم يتم رفع ملف CSV، نقوم بإرسال البيانات العادية
      try {
        const response = await fetch("http://127.0.0.1:8000/users/register-student/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(studentData),
        })

        const data = await response.json()

        if (response.ok) {
          alert("✅ Student added successfully!")
          // Reset form
          setStudentData({
            username: "",
            email: "",
            university: "",
            graduation_year: "",
            college: "",
            leetcode_username: "",
            github_profile: "",
            track_name: "",
          })
        } else {
          alert(`❌ Error: ${JSON.stringify(data, null, 2)}`)
        }
      } catch (error) {
        console.error("❌ Request Error:", error)
        alert("❌ Something went wrong. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-[#f0f7ff]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#007acc]">Student Registration</h1>
              <p className="mt-2 text-[#007abc]">Add new students to the system individually or in bulk</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border border-[#c7e5ff]">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Students are automatically notified via email</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Info Cards */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="bg-white border border-[#c7e5ff] shadow-md overflow-hidden">
              <div className="bg-[#007acc] p-3">
                <h3 className="text-white font-medium flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Quick Tips
                </h3>
              </div>
              <CardContent className="p-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="bg-[#c7e5ff] text-[#007acc] rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>
                      Use <strong>Single Student</strong> mode for adding individual students
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#c7e5ff] text-[#007acc] rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>
                      Use <strong>Bulk Upload</strong> for adding multiple students at once
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#c7e5ff] text-[#007acc] rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>Students will receive login credentials via email</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border border-[#c7e5ff] shadow-md overflow-hidden">
              <div className="bg-[#007acc] p-3">
                <h3 className="text-white font-medium flex items-center">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  CSV Format
                </h3>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-3">Your CSV file should include:</p>
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-xs font-mono">
                  username,email,track_name
                </div>
                <p className="text-xs text-gray-500 mt-2">Additional fields are optional</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-9">
            <Card className="border-0 shadow-xl overflow-hidden bg-white">
              <Tabs defaultValue="single" className="w-full" onValueChange={setActiveTab}>
                <div className="bg-[#007acc] text-white p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Registration Form</h2>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      {activeTab === "single" ? "Individual Registration" : "Bulk Registration"}
                    </span>
                  </div>
                  <TabsList className="grid w-full grid-cols-2 bg-[#0069b3]">
                    <TabsTrigger
                      value="single"
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#007acc]"
                    >
                      <User className="h-4 w-4" />
                      <span>Single Student</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="bulk"
                      className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-[#007acc]"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Bulk Upload</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <CardContent className="p-6">
                  <TabsContent value="single">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="bg-[#f8fcff] border border-[#c7e5ff] rounded-lg p-5">
                        <h3 className="text-[#007acc] font-medium mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="username" className="flex items-center gap-2 text-[#007acc]">
                              <User className="h-4 w-4 text-[#007acc]" />
                              <span>Username</span>
                            </Label>
                            <Input
                              id="username"
                              name="username"
                              value={studentData.username}
                              onChange={handleChange}
                              required
                              className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                              placeholder="Enter username"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-[#007acc]">
                              <svg className="h-4 w-4 text-[#007acc]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              <span>Email</span>
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={studentData.email}
                              onChange={handleChange}
                              required
                              className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                              placeholder="student@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#f8fcff] border border-[#c7e5ff] rounded-lg p-5">
                        <h3 className="text-[#007acc] font-medium mb-4 flex items-center">
                          <Building className="h-5 w-5 mr-2" />
                          Academic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="university" className="flex items-center gap-2 text-[#007acc]">
                              <Building className="h-4 w-4 text-[#007acc]" />
                              <span>University</span>
                            </Label>
                            <Input
                              id="university"
                              name="university"
                              value={studentData.university}
                              onChange={handleChange}
                              className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                              placeholder="University name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="graduation_year" className="flex items-center gap-2 text-[#007acc]">
                              <Calendar className="h-4 w-4 text-[#007acc]" />
                              <span>Graduation Year</span>
                            </Label>
                            <Input
                              id="graduation_year"
                              name="graduation_year"
                              type="number"
                              value={studentData.graduation_year}
                              onChange={handleChange}
                              className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                              placeholder="YYYY"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label htmlFor="college" className="flex items-center gap-2 text-[#007acc]">
                            <BookOpen className="h-4 w-4 text-[#007acc]" />
                            <span>College</span>
                          </Label>
                          <Input
                            id="college"
                            name="college"
                            value={studentData.college}
                            onChange={handleChange}
                            className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc] mt-1"
                            placeholder="College or faculty name"
                          />
                        </div>
                      </div>

                      <div className="bg-[#f8fcff] border border-[#c7e5ff] rounded-lg p-5">
                        <h3 className="text-[#007acc] font-medium mb-4 flex items-center">
                          <Code className="h-5 w-5 mr-2" />
                          Coding Profiles
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <Label htmlFor="leetcode_profile" className="flex items-center gap-2 text-[#007acc]">
                              <Code className="h-4 w-4 text-[#007acc]" />
                              <span>LeetCode Username</span>
                            </Label>
                            <Input
                              id="leetcode_profile"
                              name="leetcode_profile"
                              value={studentData.leetcode_username}
                              onChange={handleChange}
                              className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                              placeholder="username"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="github_profile" className="flex items-center gap-2 text-[#007acc]">
                              <Github className="h-4 w-4 text-[#007acc]" />
                              <span>GitHub Profile</span>
                            </Label>
                            <Input
                              id="github_profile"
                              name="github_profile"
                              type="url"
                              value={studentData.github_profile}
                              onChange={handleChange}
                              className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]"
                              placeholder="https://github.com/username"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#f8fcff] border border-[#c7e5ff] rounded-lg p-5">
                        <h3 className="text-[#007acc] font-medium mb-4 flex items-center">
                          <svg className="h-5 w-5 mr-2 text-[#007acc]" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Track Assignment
                        </h3>
                        <div className="space-y-2">
                          <Label htmlFor="track" className="flex items-center gap-2 text-[#007acc]">
                            <span>Select Track</span>
                          </Label>
                          <Select onValueChange={(value) => setStudentData({ ...studentData, track_name: value })}>
                            <SelectTrigger className="border-[#c7e5ff] focus:border-[#007acc] focus:ring-[#007acc]">
                              <SelectValue placeholder="Select a track" />
                            </SelectTrigger>
                            <SelectContent>
                              {tracks.map((track) => (
                                <SelectItem key={track.id} value={track.name}>
                                  {track.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#007acc] hover:bg-[#0069b3] text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </div>
                        ) : (
                          <span className="flex items-center justify-center">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Register Student
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="bulk">
                    <div className="space-y-6">
                      <div className="bg-[#f8fcff] border border-[#c7e5ff] rounded-lg p-5">
                        <h3 className="text-[#007acc] font-medium mb-3 flex items-center">
                          <FileSpreadsheet className="h-5 w-5 mr-2" />
                          CSV File Requirements
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-md p-4">
                          <p className="text-gray-700 mb-3">Your CSV file must include these columns:</p>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="bg-[#c7e5ff] text-[#007acc] p-2 rounded text-center text-sm font-medium">
                              username
                            </div>
                            <div className="bg-[#c7e5ff] text-[#007acc] p-2 rounded text-center text-sm font-medium">
                              email
                            </div>
                            <div className="bg-[#c7e5ff] text-[#007acc] p-2 rounded text-center text-sm font-medium">
                              track_name
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Optional columns: university, graduation_year, college, leetcode_profile, github_profile
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="bg-[#f8fcff] border border-[#c7e5ff] rounded-lg p-5">
                          <Label htmlFor="csv-upload" className="flex items-center gap-2 text-[#007acc] mb-3">
                            <Upload className="h-4 w-4 text-[#007acc]" />
                            <span>Upload CSV File</span>
                          </Label>
                          <div className="border-2 border-dashed border-[#c7e5ff] rounded-lg p-10 text-center hover:border-[#007acc] transition-colors bg-white">
                            <input
                              id="csv-upload"
                              type="file"
                              accept=".csv"
                              onChange={handleCsvChange}
                              className="hidden"
                            />
                            <label htmlFor="csv-upload" className="cursor-pointer">
                              <Upload className="h-12 w-12 text-[#007acc] mx-auto" />
                              <p className="mt-3 text-base font-medium text-[#007acc]">
                                {csvFile ? csvFile.name : "Click to upload or drag and drop"}
                              </p>
                              <p className="mt-2 text-sm text-gray-500">CSV files only (max 10MB)</p>
                            </label>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || !csvFile}
                          className="w-full bg-[#007acc] hover:bg-[#0069b3] text-white font-medium py-3 rounded-lg transition-colors"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </div>
                          ) : (
                            <span className="flex items-center justify-center">
                              <FileSpreadsheet className="mr-2 h-5 w-5" />
                              Upload and Register Students
                            </span>
                          )}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                </CardContent>

                <CardFooter className="bg-[#c7e5ff] p-4 text-center text-sm text-[#007acc] border-t border-[#c7e5ff]">
                  <div className="flex items-center justify-center w-full">
                    <svg className="h-4 w-4 mr-2 text-[#007acc]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    All student information will be securely stored in our database
                  </div>
                </CardFooter>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
