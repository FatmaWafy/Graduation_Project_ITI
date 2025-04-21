"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Upload, FileSpreadsheet, Info, CheckCircle } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddStudentPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tracks, setTracks] = useState<{ id: number; name: string }[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setCsvFile(file)
      } else {
        toast.error("Please upload a CSV file only.")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const accessToken = Cookies.get("token")

    if (!accessToken) {
      toast.error("Authentication Error: No token found. Please log in again.")
      return
    }

    if (!csvFile) {
      toast.error("Please select a CSV file first.")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("file", csvFile)

    try {
      setUploadStatus("uploading")
      setUploadProgress(10)

      const xhr = new XMLHttpRequest()
      xhr.open("POST", "http://127.0.0.1:8000/users/register-students-excel/", true)
      xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 90)
          setUploadProgress(percentComplete)
        }
      }

      xhr.onload = async () => {
        setUploadProgress(100)

        try {
          const data = JSON.parse(xhr.responseText)

          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadStatus("success")
            toast.success(data.message)
            setCsvFile(null)
            // Reset file input
            const fileInput = document.getElementById("csv-upload") as HTMLInputElement
            if (fileInput) fileInput.value = ""
          } else {
            setUploadStatus("error")
            toast.error(typeof data.detail === "string" ? data.detail : JSON.stringify(data, null, 2))
          }
        } catch (error) {
          setUploadStatus("error")
          toast.error("Could not parse server response.")
        } finally {
          setIsSubmitting(false)
        }
      }

      xhr.onerror = () => {
        setUploadStatus("error")
        setIsSubmitting(false)
        toast.error("Something went wrong. Please try again.")
      }

      xhr.send(formData)
    } catch (error) {
      setUploadStatus("error")
      setIsSubmitting(false)
      console.error("❌ Request Error:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const downloadSampleCsv = () => {
    const csvContent =
      "username,email,track_name,university,graduation_year,college,leetcode_profile,github_profile\nstudent1,student1@example.com,Web Development,Example University,2024,Engineering,leetcode.com/student1,github.com/student1\nstudent2,student2@example.com,Data Science,Another University,2025,Computer Science,leetcode.com/student2,github.com/student2"
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "sample_students.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 text-xs w-full border-[#c7e5ff] text-[#007acc] hover:bg-[#f0f7ff]"
                  onClick={downloadSampleCsv}
                >
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  Download Sample CSV
                </Button>
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
                    <div
                      className={`border-2 border-dashed ${dragActive ? "border-[#007acc] bg-[#f0f7ff]" : "border-[#c7e5ff]"} rounded-lg p-10 text-center hover:border-[#007acc] transition-colors bg-white relative`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input id="csv-upload" type="file" accept=".csv" onChange={handleCsvChange} className="hidden" />
                      <label htmlFor="csv-upload" className="cursor-pointer block">
                        <Upload className="h-12 w-12 text-[#007acc] mx-auto" />
                        <p className="mt-3 text-base font-medium text-[#007acc]">
                          {csvFile ? csvFile.name : "Click to upload or drag and drop"}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">CSV files only (max 10MB)</p>
                      </label>

                      {csvFile && (
                        <div className="mt-4 bg-[#f0f7ff] p-3 rounded-lg border border-[#c7e5ff] flex items-center">
                          <FileSpreadsheet className="h-5 w-5 text-[#007acc] mr-2" />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-[#007acc] truncate">{csvFile.name}</p>
                            <p className="text-xs text-gray-500">{(csvFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => {
                              setCsvFile(null)
                              const fileInput = document.getElementById("csv-upload") as HTMLInputElement
                              if (fileInput) fileInput.value = ""
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      )}

                      {uploadStatus === "uploading" && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-[#007acc] h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                        </div>
                      )}
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
                  {uploadStatus === "success" && (
                    <Alert className="bg-green-50 border-green-200 text-green-800 mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Upload Successful</AlertTitle>
                      <AlertDescription>
                        Students have been registered successfully and will receive login credentials via email.
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploadStatus === "error" && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTitle>Upload Failed</AlertTitle>
                      <AlertDescription>
                        There was an error processing your CSV file. Please check the format and try again.
                      </AlertDescription>
                    </Alert>
                  )}
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}
