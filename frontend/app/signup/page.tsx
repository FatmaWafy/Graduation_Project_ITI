// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
// import { BookOpen, Eye, EyeOff } from "lucide-react"

// import { useAuth } from "@/lib/auth-context"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function SignupPage() {
//   const router = useRouter()
//   const { loading } = useAuth()
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   })
//   const [error, setError] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     // Validate form
//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//       setError("All fields are required")
//       return
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match")
//       return
//     }

//     if (formData.password.length < 8) {
//       setError("Password must be at least 8 characters long")
//       return
//     }

//     try {
//       setIsSubmitting(true)
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       // In a real app, you would register the user here
//       // await register(formData.name, formData.email, formData.password)

//       // Redirect to login page
//       router.push("/login?registered=true")
//     } catch (err) {
//       setError("Failed to create account. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
//       <Card className="mx-auto w-full max-w-md">
//         <CardHeader className="space-y-1 text-center">
//           <div className="flex justify-center">
//             <BookOpen className="h-10 w-10 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
//           <CardDescription>Enter your information to create an account</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="John Doe"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="student@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   <span className="sr-only">Toggle password visibility</span>
//                 </Button>
//               </div>
//               <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={showPassword ? "text" : "password"}
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </CardContent>

//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
//               {isSubmitting ? "Creating Account..." : "Create Account"}
//             </Button>
//             <div className="text-center text-sm">
//               Already have an account?{" "}
//               <Link href="/login" className="text-primary hover:underline">
//                 Sign in
//               </Link>
//             </div>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

 "use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Eye, EyeOff } from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const router = useRouter()
  const { loading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
     track_name: ""
  })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
  
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.track_name) {
      setError("All fields are required")
      return
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
  
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }
  
    try {
      setIsSubmitting(true)
  
      const response = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
          track_name: formData.track_name // ✅ تأكدنا إنه بيتبعت
        }),
      })
  
      const data = await response.json()
      console.log("Server Response:", data) // 🔍 فحص رد السيرفر
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to create account")
      }
  
      router.push("/login?registered=true")
  
    } catch (err: any) {
      console.error("Error:", err) // 🔍 فحص الخطأ في الكونسول
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  const trackOptions = ["Full-Stack Python", "Front-End", "Back-End", "AI/ML", "Mobile Development"]

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          {/* <CardDescription>Enter your information to create an account</CardDescription> */}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-3">
            {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
  
            <div className="space-y-0">
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
  
            <div className="space-y-2">
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
  
            <div className="space-y-2">
              <Label htmlFor="track_name">Select Track</Label>
              <select
                id="track_name"
                name="track_name"
                value={formData.track_name}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 p-2"
              >
                <option value="" disabled>Select your track</option>
                {trackOptions.map((track) => (
                  <option key={track} value={track}>
                    {track}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="space-y-2">
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
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>
  
            <div className="space-y-2">
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
            <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
  
}

 