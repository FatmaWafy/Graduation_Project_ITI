// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { FileUp, Upload, File, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { useToast } from "@/components/ui/use-toast"
// import Cookies from "js-cookie"

// interface Lab {
//   id: number
//   name: string
//   url: string
//   track: string
//   created_at: string
//   size: string
// }

// export default function LabsPage() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const [file, setFile] = useState<File | null>(null)
//   const [track, setTrack] = useState<string>("")
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [uploadSuccess, setUploadSuccess] = useState(false)
//   const [uploadError, setUploadError] = useState<string | null>(null)
//   const [labs, setLabs] = useState<Lab[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isDragging, setIsDragging] = useState(false)

//   // Replace the hardcoded tracks array with a state variable
//   const [tracks, setTracks] = useState<{ id: number; name: string }[]>([])

//   // Add a function to fetch tracks from the API
//   const fetchTracks = async () => {
//     try {
//       const token = Cookies.get("token")
//       if (!token) {
//         throw new Error("No authentication token found")
//       }

//       const response = await fetch("http://127.0.0.1:8000/users/get-tracks/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to fetch tracks: ${response.status}`)
//       }

//       const data = await response.json()
//       console.log("Tracks data:", data)

//       // The API returns an array of tracks directly
//       setTracks(data || [])
//     } catch (error) {
//       console.error("Error fetching tracks:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load tracks. Please refresh the page.",
//         variant: "destructive",
//       })
//     }
//   }

//   const fetchLabs = async () => {
//     setIsLoading(true)
//     try {
//       const token = Cookies.get("token")
//       if (!token) {
//         throw new Error("No authentication token found")
//       }

//       const response = await fetch("http://127.0.0.1:8000/labs/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to fetch labs: ${response.status}`)
//       }

//       const data = await response.json()
//       setLabs(data)
//     } catch (error) {
//       console.error("Error fetching labs:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load labs. Please refresh the page.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchLabs()
//     fetchTracks()
//   }, [])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedFile = e.target.files[0]
//       if (selectedFile.type !== "application/pdf") {
//         toast({
//           title: "Invalid file type",
//           description: "Please select a PDF file",
//           variant: "destructive",
//         })
//         return
//       }
//       setFile(selectedFile)
//       setUploadSuccess(false)
//       setUploadError(null)
//     }
//   }

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     setIsDragging(true)
//   }

//   const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     setIsDragging(false)
//   }

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     setIsDragging(false)

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const droppedFile = e.dataTransfer.files[0]
//       if (droppedFile.type !== "application/pdf") {
//         toast({
//           title: "Invalid file type",
//           description: "Please select a PDF file",
//           variant: "destructive",
//         })
//         return
//       }
//       setFile(droppedFile)
//       setUploadSuccess(false)
//       setUploadError(null)
//     }
//   }

//   // Replace the handleSubmit function with this improved version
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!file || !track) {
//       toast({
//         title: "Missing information",
//         description: "Please select a file and track",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsUploading(true)
//     setUploadProgress(0)
//     setUploadSuccess(false)
//     setUploadError(null)

//     // Create a FormData object to send the file
//     const formData = new FormData()
//     formData.append("file", file)
//     formData.append("track", track)
//     formData.append("name", file.name)
//     // Update the description in the FormData to use the track name
//     // In the handleSubmit function, modify the description line:
//     const selectedTrack = tracks.find((t) => t.id.toString() === track)
//     formData.append("description", `Lab material for ${selectedTrack ? selectedTrack.name : track}`)

//     try {
//       const token = Cookies.get("token")
//       if (!token) {
//         throw new Error("No authentication token found")
//       }

//       // Log the token for debugging (remove in production)
//       console.log("Using token for upload:", token.substring(0, 15) + "...")

//       // Simulate upload progress
//       const progressInterval = setInterval(() => {
//         setUploadProgress((prev) => {
//           if (prev >= 95) {
//             clearInterval(progressInterval)
//             return prev
//           }
//           return prev + 5
//         })
//       }, 200)

//       const response = await fetch("http://127.0.0.1:8000/labs/", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       clearInterval(progressInterval)

//       if (!response.ok) {
//         // Improved error handling
//         let errorMessage = "Upload failed"
//         try {
//           const errorData = await response.json()
//           console.error("Server error response:", errorData)
//           errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData)
//         } catch (parseError) {
//           // If the response isn't JSON
//           const errorText = await response.text()
//           console.error("Server error text:", errorText)
//           errorMessage = errorText || `HTTP error: ${response.status}`
//         }
//         throw new Error(errorMessage)
//       }

//       const responseData = await response.json()
//       console.log("Upload response:", responseData)

//       setUploadProgress(100)
//       setUploadSuccess(true)

//       toast({
//         title: "Upload successful",
//         description: "The lab has been uploaded and sent to students",
//       })

//       // Refresh the labs list
//       fetchLabs()

//       // Reset form after successful upload
//       setTimeout(() => {
//         setFile(null)
//         setUploadProgress(0)
//         setIsUploading(false)
//       }, 1000)
//     } catch (error) {
//       console.error("Upload error:", error)
//       setUploadError(error instanceof Error ? error.message : String(error))
//       setIsUploading(false)
//     }
//   }

//   // Replace the handleDeleteLab function with this improved version
//   const handleDeleteLab = async (labId: number) => {
//     try {
//       const token = Cookies.get("token")
//       if (!token) {
//         throw new Error("No authentication token found")
//       }

//       const response = await fetch(`http://127.0.0.1:8000/labs/${labId}/`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         let errorMessage = "Delete failed"
//         try {
//           const errorData = await response.json()
//           errorMessage = errorData.detail || errorData.message || errorMessage
//         } catch (e) {
//           // If we can't parse JSON, try to get text
//           const errorText = await response.text()
//           console.error("Delete error text:", errorText)
//         }
//         throw new Error(errorMessage)
//       }

//       // Remove the lab from the list
//       setLabs((prev) => prev.filter((lab) => lab.id !== labId))

//       toast({
//         title: "Lab deleted",
//         description: "The lab has been deleted successfully",
//       })
//     } catch (error) {
//       console.error("Delete error:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to delete lab",
//         variant: "destructive",
//       })
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Lab Management</h1>
//         <p className="text-muted-foreground">Upload and manage lab materials for students</p>
//       </div>

//       <Tabs defaultValue="upload" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="upload">Upload Lab</TabsTrigger>
//           <TabsTrigger value="manage">Manage Labs</TabsTrigger>
//         </TabsList>

//         <TabsContent value="upload" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Upload New Lab</CardTitle>
//               <CardDescription>Upload PDF lab materials to share with students in a specific track</CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="track">Select Track</Label>
//                   {/* Update the Select component to use the dynamic tracks */}
//                   <Select value={track} onValueChange={setTrack}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a track" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {tracks.length > 0 ? (
//                         tracks.map((t) => (
//                           <SelectItem key={t.id} value={t.id.toString()}>
//                             {t.name}
//                           </SelectItem>
//                         ))
//                       ) : (
//                         <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
//                           Loading tracks...
//                         </div>
//                       )}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="file">Upload PDF File</Label>
//                   <div
//                     className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
//                       isDragging
//                         ? "border-primary bg-primary/5"
//                         : file
//                           ? "border-green-500 bg-green-50"
//                           : "border-border hover:border-primary/50"
//                     }`}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                   >
//                     <div className="flex flex-col items-center justify-center space-y-3 text-center">
//                       {file ? (
//                         <>
//                           <div className="p-3 rounded-full bg-green-100">
//                             <File className="h-6 w-6 text-green-600" />
//                           </div>
//                           <div>
//                             <p className="font-medium">{file.name}</p>
//                             <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//                           </div>
//                           <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
//                             Change File
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <div className="p-3 rounded-full bg-primary/10">
//                             <Upload className="h-6 w-6 text-primary" />
//                           </div>
//                           <div>
//                             <p className="font-medium">Click to upload or drag and drop</p>
//                             <p className="text-sm text-muted-foreground">PDF files only (max 10MB)</p>
//                           </div>
//                           <Input id="file" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => document.getElementById("file")?.click()}
//                           >
//                             Select File
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {uploadProgress > 0 && (
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span>Uploading...</span>
//                       <span>{uploadProgress}%</span>
//                     </div>
//                     <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                       <div
//                         className={`h-full ${uploadSuccess ? "bg-green-500" : "bg-primary"}`}
//                         style={{ width: `${uploadProgress}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 )}

//                 {uploadSuccess && (
//                   <Alert className="bg-green-50 border-green-200">
//                     <CheckCircle2 className="h-4 w-4 text-green-600" />
//                     <AlertTitle className="text-green-800">Upload Successful</AlertTitle>
//                     <AlertDescription className="text-green-700">
//                       The lab has been uploaded and sent to students in the selected track.
//                     </AlertDescription>
//                   </Alert>
//                 )}

//                 {uploadError && (
//                   <Alert variant="destructive">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertTitle>Upload Failed</AlertTitle>
//                     <AlertDescription>{uploadError}</AlertDescription>
//                   </Alert>
//                 )}
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" className="w-full" disabled={!file || !track || isUploading}>
//                   {isUploading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <FileUp className="mr-2 h-4 w-4" />
//                       Upload and Send to Students
//                     </>
//                   )}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </TabsContent>

//         <TabsContent value="manage">
//           <Card>
//             <CardHeader>
//               <CardTitle>Manage Labs</CardTitle>
//               <CardDescription>View and manage all uploaded lab materials</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center py-8">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 </div>
//               ) : labs.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-muted-foreground">No labs have been uploaded yet</p>
//                   <Button
//                     variant="outline"
//                     className="mt-4"
//                     onClick={() => document.querySelector('[data-value="upload"]')?.click()}
//                   >
//                     Upload Your First Lab
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Track</TableHead>
//                         <TableHead>Size</TableHead>
//                         <TableHead>Upload Date</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {labs.map((lab) => (
//                         <TableRow key={lab.id}>
//                           <TableCell className="font-medium">
//                             <div className="flex items-center">
//                               <File className="h-4 w-4 mr-2 text-muted-foreground" />
//                               {lab.name}
//                             </div>
//                           </TableCell>
//                           <TableCell>{lab.track}</TableCell>
//                           <TableCell>{lab.size}</TableCell>
//                           <TableCell>{formatDate(lab.created_at)}</TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex justify-end gap-2">
//                               <Button variant="outline" size="sm">
//                                 Download
//                               </Button>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="text-destructive hover:text-destructive"
//                                 onClick={() => handleDeleteLab(lab.id)}
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Upload, File, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import Cookies from "js-cookie"

interface Lab {
  id: number
  name: string
  url: string
  track: string
  created_at: string
  size: string
}

export default function LabsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [track, setTrack] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [labs, setLabs] = useState<Lab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  // Replace the hardcoded tracks array with a state variable
  const [tracks, setTracks] = useState<{ id: number; name: string }[]>([])

  // Add a function to fetch tracks from the API
  const fetchTracks = async () => {
    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://127.0.0.1:8000/users/get-tracks/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch tracks: ${response.status}`)
      }

      const data = await response.json()
      console.log("Tracks data:", data)

      // The API returns an array of tracks directly
      setTracks(data || [])
    } catch (error) {
      console.error("Error fetching tracks:", error)
      toast({
        title: "Error",
        description: "Failed to load tracks. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

  const fetchLabs = async () => {
    setIsLoading(true)
    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://127.0.0.1:8000/labs/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch labs: ${response.status}`)
      }

      const data = await response.json()
      setLabs(data)
    } catch (error) {
      console.error("Error fetching labs:", error)
      toast({
        title: "Error",
        description: "Failed to load labs. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLabs()
    fetchTracks()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        })
        return
      }
      setFile(selectedFile)
      setUploadSuccess(false)
      setUploadError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please select a PDF file",
          variant: "destructive",
        })
        return
      }
      setFile(droppedFile)
      setUploadSuccess(false)
      setUploadError(null)
    }
  }

  // Replace the handleSubmit function with this improved version
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !track) {
      toast({
        title: "Missing information",
        description: "Please select a file and track",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadSuccess(false)
    setUploadError(null)

    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("file", file)
    formData.append("track", track)
    formData.append("name", file.name)
    // Update the description in the FormData to use the track name
    // In the handleSubmit function, modify the description line:
    const selectedTrack = tracks.find((t) => t.id.toString() === track)
    formData.append("description", `Lab material for ${selectedTrack ? selectedTrack.name : track}`)

    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Log the token for debugging (remove in production)
      console.log("Using token for upload:", token.substring(0, 15) + "...")

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 200)

      const response = await fetch("http://127.0.0.1:8000/labs/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        // Improved error handling
        let errorMessage = "Upload failed"
        try {
          const errorData = await response.json()
          console.error("Server error response:", errorData)
          errorMessage = errorData.detail || errorData.error || JSON.stringify(errorData)
        } catch (parseError) {
          // If the response isn't JSON
          const errorText = await response.text()
          console.error("Server error text:", errorText)
          errorMessage = errorText || `HTTP error: ${response.status}`
        }
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      console.log("Upload response:", responseData)

      setUploadProgress(100)
      setUploadSuccess(true)

      toast({
        title: "Upload successful",
        description: "The lab has been uploaded and sent to students",
      })

      // Refresh the labs list
      fetchLabs()

      // Reset form after successful upload
      setTimeout(() => {
        setFile(null)
        setUploadProgress(0)
        setIsUploading(false)
      }, 1000)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError(error instanceof Error ? error.message : String(error))
      setIsUploading(false)
    }
  }

  // Replace the handleDeleteLab function with this improved version
  const handleDeleteLab = async (labId: number) => {
    try {
      const token = Cookies.get("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`http://127.0.0.1:8000/labs/${labId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        let errorMessage = "Delete failed"
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
        } catch (e) {
          // If we can't parse JSON, try to get text
          const errorText = await response.text()
          console.error("Delete error text:", errorText)
        }
        throw new Error(errorMessage)
      }

      // Remove the lab from the list
      setLabs((prev) => prev.filter((lab) => lab.id !== labId))

      toast({
        title: "Lab deleted",
        description: "The lab has been deleted successfully",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete lab",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lab Management</h1>
        <p className="text-muted-foreground">Upload and manage lab materials for students</p>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Lab</TabsTrigger>
          <TabsTrigger value="manage">Manage Labs</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Lab</CardTitle>
              <CardDescription>Upload PDF lab materials to share with students in a specific track</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="track">Select Track</Label>
                  {/* Update the Select component to use the dynamic tracks */}
                  <Select value={track} onValueChange={setTrack}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a track" />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks.length > 0 ? (
                        tracks.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                          Loading tracks...
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload PDF File</Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : file
                          ? "border-green-500 bg-green-50"
                          : "border-border hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                      {file ? (
                        <>
                          <div className="p-3 rounded-full bg-green-100">
                            <File className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>
                            Change File
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="p-3 rounded-full bg-primary/10">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">PDF files only (max 10MB)</p>
                          </div>
                          <Input id="file" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById("file")?.click()}
                          >
                            Select File
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${uploadSuccess ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {uploadSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Upload Successful</AlertTitle>
                    <AlertDescription className="text-green-700">
                      The lab has been uploaded and sent to students in the selected track.
                    </AlertDescription>
                  </Alert>
                )}

                {uploadError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Upload Failed</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!file || !track || isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload and Send to Students
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Labs</CardTitle>
              <CardDescription>View and manage all uploaded lab materials</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : labs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No labs have been uploaded yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.querySelector('[data-value="upload"]')?.click()}
                  >
                    Upload Your First Lab
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labs.map((lab) => (
                        <TableRow key={lab.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <File className="h-4 w-4 mr-2 text-muted-foreground" />
                              {lab.name}
                            </div>
                          </TableCell>
                          <TableCell>{lab.track}</TableCell>
                          <TableCell>{lab.size}</TableCell>
                          <TableCell>{formatDate(lab.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteLab(lab.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
