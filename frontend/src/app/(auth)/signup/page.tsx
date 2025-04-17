"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Eye, EyeOff, GraduationCap, BookOpenCheck, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    track_name: "",
    branch_name: "",
  })
  const [branches, setBranches] = useState([])
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tracks, setTracks] = useState([])

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/branches/")
        const data = await res.json()
        if (Array.isArray(data)) {
          setBranches(data)
        } else {
          setBranches([])
          console.error("Unexpected response for branches:", data)
        }
      } catch (error) {
        console.error("Error fetching branches:", error)
      }
    }
    fetchBranches()
  }, [])

  // Fetch tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/get-tracks/")
        const data = await res.json()
        if (Array.isArray(data)) {
          setTracks(data)
        } else {
          setTracks([])
          console.error("Unexpected response for tracks:", data)
        }
      } catch (error) {
        console.error("Error fetching tracks:", error)
      }
    }

    fetchTracks()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const { name, email, password, confirmPassword, track_name, branch_name } = formData

    if (!name || !email || !password || !confirmPassword || !track_name || !branch_name) {
      setError("All fields are required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    const payload = {
      username: name,
      email,
      password,
      track_name,
      branch: branch_name,
    }

    console.log("Sending payload:", payload) // Debug the payload

    try {
      setIsSubmitting(true)
      const response = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create account")
      }

      router.push("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Image Column - Now using a div with icons instead of an image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-50 flex-col items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 gap-8">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-12 h-12 text-blue-600" />
            </div>
            <div className="flex gap-12">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <BookOpenCheck className="w-8 h-8 text-blue-500" />
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="max-w-md text-center space-y-4">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">Empower Your Learning Journey</h2>
              <p className="text-blue-700 text-lg">
                Join our examination system to track your progress and excel in your studies
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-blue-700">Track Progress</h3>
                <p className="text-sm text-blue-600">Monitor your learning achievements</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-blue-700">Expert Guidance</h3>
                <p className="text-sm text-blue-600">Learn from industry professionals</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-blue-700">Flexible Learning</h3>
                <p className="text-sm text-blue-600">Study at your own pace</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg shadow">
                <h3 className="font-semibold text-blue-700">Certification</h3>
                <p className="text-sm text-blue-600">Earn recognized credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <BookOpen className="h-10 w-10 text-blue-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && <div className="bg-red-100 text-red-600 p-2 rounded-md text-sm">{error}</div>}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="instructor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="track_name">Select Track</Label>
                <select
                  id="track_name"
                  name="track_name"
                  value={formData.track_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select your track
                  </option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.name}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="branch_name">Select Branch</Label>
                <select
                  id="branch_name"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select your branch
                  </option>
                  {branches.map((branch, idx) => (
                    <option key={branch.id} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/" className="text-blue-500 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
