"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, Info, CheckCircle } from "lucide-react"

export default function AddStudentPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tracks, setTracks] = useState<{ id: number; name: string }[]>([])

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

    if (!csvFile) {
      alert("❌ Please select a CSV file first.")
      return
    }

    setIsSubmitting(true)

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
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white to-[#f0f7ff]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#007acc]">Bulk Student Registration</h1>
              <p className="mt-2 text-[#007abc]">Add multiple students to the system using CSV upload</p>
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
                    <span>Prepare your CSV file with all required student information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-[#c7e5ff] text-[#007acc] rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>Upload the file using the form to register multiple students at once</span>
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
              <div className="bg-[#007acc] text-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold">Bulk Registration Form</h2>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">CSV Upload</span>
                </div>
              </div>

              <CardContent className="p-6">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
