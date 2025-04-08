// "use client";

// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

// export default function AddStudentPage() {
//   const [studentData, setStudentData] = useState({
//     username: "",
//     email: "",
//     university: "",
//     graduation_year: "",
//     college: "",
//     leetcode_profile: "",
//     github_profile: "",
//     track_name: "",
//   });

//   const [tracks, setTracks] = useState<{ id: number; name: string }[]>([]);

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchTracks = async () => {
//       try {
//         const accessToken = Cookies.get("token");
//         if (!accessToken) {
//           console.error("❌ No authentication token found.");
//           return;
//         }

//         const response = await fetch("http://127.0.0.1:8000/users/get-tracks/", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setTracks(data || []); // ✅ استخدم `data` مباشرة بدل `data.tracks`
//         } else {
//           console.error("❌ Failed to fetch tracks:", data);
//           setTracks([]);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching tracks:", error);
//         setTracks([]);
//       }
//     };

//     fetchTracks();
//   }, []);


//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setStudentData({ ...studentData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const accessToken = Cookies.get("token");

//     if (!accessToken) {
//       alert("❌ Authentication Error: No token found. Please log in again.");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/users/register-student/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(studentData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("✅ Student added successfully!");
//       } else {
//         alert(`❌ Error: ${JSON.stringify(data, null, 2)}`);
//       }
//     } catch (error) {
//       console.error("❌ Request Error:", error);
//       alert("❌ Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full h-screen flex items-center justify-center bg-gray-100">
//       <Card className="w-full max-w-4xl p-8 shadow-lg">
//         <h2 className="text-3xl font-bold text-green-700 text-center mb-6">📚 Register a New Student</h2>

//         <form className="space-y-4" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-2 gap-4">
//             <Input type="text" name="username" placeholder="Username" value={studentData.username} onChange={handleChange} required />
//             <Input type="email" name="email" placeholder="Email" value={studentData.email} onChange={handleChange} required />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Input type="text" name="university" placeholder="University" value={studentData.university} onChange={handleChange} />
//             <Input type="number" name="graduation_year" placeholder="Graduation Year" value={studentData.graduation_year} onChange={handleChange} />
//           </div>

//           <Input type="text" name="college" placeholder="College" value={studentData.college} onChange={handleChange} />
//           <Input type="url" name="leetcode_profile" placeholder="LeetCode Profile URL" value={studentData.leetcode_profile} onChange={handleChange} />
//           <Input type="url" name="github_profile" placeholder="GitHub Profile URL" value={studentData.github_profile} onChange={handleChange} />

//           {/* 🔹 Dropdown لاختيار التراك */}
//           <Select onValueChange={(value) => setStudentData({ ...studentData, track_name: value })}>
//             <SelectTrigger className="w-full">{studentData.track_name || "Select Track"}</SelectTrigger>
//             <SelectContent>
//               {tracks.map((track) => (
//                 <SelectItem key={track.id} value={track.name}>
//                   {track.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>


//           <Button type="submit" className="w-full bg-green-600 hover:bg-green-500" disabled={isSubmitting}>
//             {isSubmitting ? "Processing..." : "Register Student"}
//           </Button>
//         </form>
//       </Card>
//     </div>
//   );
// }
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
import { Upload, User, BookOpen, Calendar, Building, Code, Github } from "lucide-react"

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
            leetcode_profile: "",
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
    <div className="h-full w-full bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-800">Student Registration</h1>
          <p className="text-green-600">Add new students to the system</p>
        </div>

        <Card className="shadow-md border border-green-100">
          <Tabs defaultValue="single" className="w-full" onValueChange={setActiveTab}>
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-2 bg-green-50">
                <TabsTrigger
                  value="single"
                  className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <User className="h-4 w-4" />
                  <span>Single Student</span>
                </TabsTrigger>
                <TabsTrigger
                  value="bulk"
                  className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  <Upload className="h-4 w-4" />
                  <span>Bulk Upload</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="single">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2 text-green-700">
                        <User className="h-4 w-4 text-green-600" />
                        <span>Username</span>
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={studentData.username}
                        onChange={handleChange}
                        required
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="Enter username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-green-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
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
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="student@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="university" className="flex items-center gap-2 text-green-700">
                        <Building className="h-4 w-4 text-green-600" />
                        <span>University</span>
                      </Label>
                      <Input
                        id="university"
                        name="university"
                        value={studentData.university}
                        onChange={handleChange}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="University name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduation_year" className="flex items-center gap-2 text-green-700">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span>Graduation Year</span>
                      </Label>
                      <Input
                        id="graduation_year"
                        name="graduation_year"
                        type="number"
                        value={studentData.graduation_year}
                        onChange={handleChange}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college" className="flex items-center gap-2 text-green-700">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span>College</span>
                    </Label>
                    <Input
                      id="college"
                      name="college"
                      value={studentData.college}
                      onChange={handleChange}
                      className="border-green-200 focus:border-green-500 focus:ring-green-500"
                      placeholder="College or faculty name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="leetcode_profile" className="flex items-center gap-2 text-green-700">
                        <Code className="h-4 w-4 text-green-600" />
                        <span>LeetCode Profile</span>
                      </Label>
                      <Input
                        id="leetcode_profile"
                        name="leetcode_profile"
                        type="url"
                        value={studentData.leetcode_profile}
                        onChange={handleChange}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="https://leetcode.com/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github_profile" className="flex items-center gap-2 text-green-700">
                        <Github className="h-4 w-4 text-green-600" />
                        <span>GitHub Profile</span>
                      </Label>
                      <Input
                        id="github_profile"
                        name="github_profile"
                        type="url"
                        value={studentData.github_profile}
                        onChange={handleChange}
                        className="border-green-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="track" className="flex items-center gap-2 text-green-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Track</span>
                    </Label>
                    <Select onValueChange={(value) => setStudentData({ ...studentData, track_name: value })}>
                      <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500">
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

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
                  >
                    {isSubmitting ? "Processing..." : "Register Student"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="bulk">
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      CSV File Format
                    </h3>
                    <p className="text-green-700 text-sm mt-1">
                      Your CSV file should include the following columns: username, email, track_name
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="csv-upload" className="flex items-center gap-2 text-green-700">
                        <Upload className="h-4 w-4 text-green-600" />
                        <span>Upload CSV File</span>
                      </Label>
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                        <input
                          id="csv-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleCsvChange}
                          className="hidden"
                        />
                        <label htmlFor="csv-upload" className="cursor-pointer">
                          <Upload className="h-10 w-10 text-green-400 mx-auto" />
                          <p className="mt-2 text-sm font-medium text-green-700">
                            {csvFile ? csvFile.name : "Click to upload or drag and drop"}
                          </p>
                          <p className="mt-1 text-xs text-green-500">CSV files only</p>
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !csvFile}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5"
                    >
                      {isSubmitting ? "Processing..." : "Upload and Register Students"}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </CardContent>

            <CardFooter className="bg-green-50 p-4 text-center text-sm text-green-600 border-t border-green-100">
              All student information will be securely stored in our database
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
