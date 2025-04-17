"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { School, Eye, EyeOff, LockKeyhole, BookOpen, Award } from "lucide-react"

import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const res = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Login failed")

      if (data.access) {
        Cookies.set("token", data.access, { expires: 7, secure: true, sameSite: "Lax" })
      } else {
        throw new Error("Token is missing")
      }

      if (data.role) {
        Cookies.set("role", data.role, { expires: 7, secure: true, sameSite: "Lax" })
        const dashboardPath = data.role === "instructor" ? "/dashboard_instructor" : "/dashboard_student"
        router.push(dashboardPath)
      } else {
        throw new Error("Role is missing")
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Column - Visual Elements */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-red-900 to-red-950 flex-col items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 gap-8">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-red-800/30 flex items-center justify-center">
              <School className="w-12 h-12 text-white" />
            </div>
            <div className="flex gap-12">
              <div className="w-16 h-16 rounded-full bg-red-800/30 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 rounded-full bg-red-800/30 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="max-w-md text-center space-y-4">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-white mb-4">Information Technology Institute</h2>
              <p className="text-red-100 text-lg">
                Egypt's premier technology education center empowering the next generation of tech leaders
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
                <h3 className="font-semibold text-white">Expert Instructors</h3>
                <p className="text-sm text-red-100">Learn from industry professionals</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
                <h3 className="font-semibold text-white">Cutting-Edge Curriculum</h3>
                <p className="text-sm text-red-100">Stay ahead with modern tech</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
                <h3 className="font-semibold text-white">Career Support</h3>
                <p className="text-sm text-red-100">Job placement assistance</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
                <h3 className="font-semibold text-white">Recognized Certification</h3>
                <p className="text-sm text-red-100">Industry-valued credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md p-6 shadow-lg bg-white rounded-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-900 p-3">
                <LockKeyhole className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
            <p className="text-gray-600 mt-2">Sign in to access your ITI examination dashboard</p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@iti.eg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-gray-200 focus-visible:ring-red-800"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Link href="/forget_pass" className="text-sm text-red-800 hover:text-red-900 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-200 focus-visible:ring-red-800 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="text-red-800 border-gray-300 data-[state=checked]:bg-red-800"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me for 30 days
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full bg-red-900 hover:bg-red-950 text-white font-medium py-6">
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-red-800 hover:text-red-900 hover:underline font-medium">
                  Register
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
