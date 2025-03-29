// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import Link from "next/link"
// import { BookOpen, Eye, EyeOff } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export default function ResetPasswordPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const token = searchParams.get("token")

//   const [password, setPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     if (!token) {
//       setError("Invalid or expired reset token")
//       return
//     }

//     if (!password || !confirmPassword) {
//       setError("Both fields are required")
//       return
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match")
//       return
//     }

//     if (password.length < 8) {
//       setError("Password must be at least 8 characters long")
//       return
//     }

//     try {
//       setIsSubmitting(true)
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       // In a real app, you would reset the password here
//       // await resetPassword(token, password)

//       setSuccess(true)
//     } catch (err) {
//       setError("Failed to reset password. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   if (success) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
//         <Card className="mx-auto w-full max-w-md">
//           <CardHeader className="space-y-1 text-center">
//             <div className="flex justify-center">
//               <BookOpen className="h-10 w-10 text-primary" />
//             </div>
//             <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
//             <CardDescription>Your password has been reset successfully</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-center text-muted-foreground">You can now log in with your new password.</p>
//           </CardContent>
//           <CardFooter>
//             <Button asChild className="w-full">
//               <Link href="/login">Go to Login</Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
//       <Card className="mx-auto w-full max-w-md">
//         <CardHeader className="space-y-1 text-center">
//           <div className="flex justify-center">
//             <BookOpen className="h-10 w-10 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
//           <CardDescription>Create a new password for your account</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
//             {!token && (
//               <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
//                 Invalid or expired reset link. Please request a new password reset.
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="password">New Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={!token || isSubmitting}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute right-0 top-0 h-full px-3"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={!token || isSubmitting}
//                 >
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   <span className="sr-only">Toggle password visibility</span>
//                 </Button>
//               </div>
//               <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm New Password</Label>
//               <Input
//                 id="confirmPassword"
//                 type={showPassword ? "text" : "password"}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 disabled={!token || isSubmitting}
//               />
//             </div>
//           </CardContent>

//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full" disabled={!token || isSubmitting}>
//               {isSubmitting ? "Resetting Password..." : "Reset Password"}
//             </Button>
//             <div className="text-center text-sm">
//               Remember your password?{" "}
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
import { useRouter, useSearchParams,useParams } from "next/navigation"
import Link from "next/link"
import { BookOpen, Eye, EyeOff } from "lucide-react"



import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const router = useRouter()

const params = useParams()
const { uid, token } = params

  // const searchParams = useSearchParams()
  // const token = searchParams.get("token")
  // const uid = searchParams.get("uid")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token || !uid) {
      setError("Invalid or expired reset token")
      return
    }

    if (!password || !confirmPassword) {
      setError("Both fields are required")
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

    try {
      setIsSubmitting(true)
      const response = await fetch("http://127.0.0.1:8000/users/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, token, new_password: password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.")
      }

      setSuccess(true)
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
            <CardDescription>Your password has been reset successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">You can now log in with your new password.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
            {!token || !uid ? (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                Invalid or expired reset link. Please request a new password reset.
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={!token || !uid || isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!token || !uid || isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!token || !uid || isSubmitting}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={!token || !uid || isSubmitting}>
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </Button>
            <div className="text-center text-sm">
              Remember your password? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
