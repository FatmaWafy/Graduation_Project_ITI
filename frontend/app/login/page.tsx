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
// import { Checkbox } from "@/components/ui/checkbox"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function LoginPage() {
//   const router = useRouter()
//   const { login, loading } = useAuth()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [rememberMe, setRememberMe] = useState(false)
//   const [activeTab, setActiveTab] = useState<"login" | "forgot-password">("login")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")

//     if (!email) {
//       setError("Email is required")
//       return
//     }

//     if (!password && activeTab === "login") {
//       setError("Password is required")
//       return
//     }

//     try {
//       if (activeTab === "login") {
//         await login(email, password, rememberMe)
//         router.push("/dashboard_student")
//       } else {
//         // Simulate password reset request
//         await new Promise((resolve) => setTimeout(resolve, 1000))
//         alert(`Password reset link sent to ${email}`)
//         setActiveTab("login")
//       }
//     } catch (err) {
//       setError(activeTab === "login" ? "Invalid email or password" : "Failed to send reset link")
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
//       <Card className="mx-auto w-full max-w-md">
//         <CardHeader className="space-y-1 text-center">
//           <div className="flex justify-center">
//             <BookOpen className="h-10 w-10 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
//           <CardDescription>Access your academic dashboard</CardDescription>
//         </CardHeader>

//         <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "forgot-password")}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="login">Login</TabsTrigger>
//             <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
//           </TabsList>

//           <TabsContent value="login">
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-4">
//                 {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="student@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="password">Password</Label>
//                   </div>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-0 top-0 h-full px-3"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       <span className="sr-only">Toggle password visibility</span>
//                     </Button>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox
//                       id="remember"
//                       checked={rememberMe}
//                       onCheckedChange={(checked) => setRememberMe(checked as boolean)}
//                     />
//                     <Label htmlFor="remember" className="text-sm">
//                       Remember me
//                     </Label>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col space-y-4">
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? "Signing in..." : "Sign In"}
//                 </Button>
//                 <div className="text-center text-sm">
//                   Don't have an account?{" "}
//                   <Link href="/signup" className="text-primary hover:underline">
//                     Sign up
//                   </Link>
//                 </div>
//               </CardFooter>
//             </form>
//           </TabsContent>

//           <TabsContent value="forgot-password">
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-4">
//                 {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">
//                     Enter your email address and we'll send you a link to reset your password.
//                   </p>
//                   <Label htmlFor="reset-email">Email</Label>
//                   <Input
//                     id="reset-email"
//                     type="email"
//                     placeholder="student@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? "Sending..." : "Send Reset Link"}
//                 </Button>
//               </CardFooter>
//             </form>
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   )
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { BookOpen, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [activeTab, setActiveTab] = useState<"login" | "forgot-password">("login");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

  

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);
  
//     try {
//       if (activeTab === "login") {
//         const res = await fetch("http://127.0.0.1:8000/users/login/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//           credentials: "include",
//         });
  
//         const data = await res.json();
//         console.log("Server Response:", data);
  
//         if (!res.ok) throw new Error(data.error || "Invalid email or password");
  
//         // ✅ حفظ التوكن والدور
//         if (data.access) {
//           localStorage.setItem("token", data.access);
//           localStorage.setItem("refresh", data.refresh);
//           localStorage.setItem("role", data.role);
          
//           // تأكدي من تخزين البيانات قبل التوجيه
//           await new Promise((resolve) => setTimeout(resolve, 100));
        
//           if (data.role === "student") {
//             router.push("/dashboard_student");
//           } else if (data.role === "instructor") {
//             router.push("/dashboard_instructor");
//           } else {
//             router.push("/dashboard");
//           }
//         }
  
//       } else {
//         const res = await fetch("http://127.0.0.1:8000/users/reset-password-request/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email }),
//         });
  
//         const data = await res.json();
//         if (res.ok) {
//           setMessage("Check your email for the password reset link.");
//         } else {
//           setMessage(data.error || "Something went wrong.");
//         }
//       }
//     } catch (err: any) {
//       setError(activeTab === "login" ? "Invalid email or password" : "Failed to send request. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
//       <Card className="mx-auto w-full max-w-md">
//         <CardHeader className="space-y-1 text-center">
//           <div className="flex justify-center">
//             <BookOpen className="h-10 w-10 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
//           <CardDescription>Access your academic dashboard</CardDescription>
//         </CardHeader>

//         <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "forgot-password")}>
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="login">Login</TabsTrigger>
//             <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
//           </TabsList>

//           <TabsContent value="login">
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-4">
//                 {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="student@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="password">Password</Label>
//                   </div>
//                   <div className="relative">
//                     <Input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-0 top-0 h-full px-3"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       <span className="sr-only">Toggle password visibility</span>
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col space-y-4">
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? "Processing..." : "Login"}
//                 </Button>
//               </CardFooter>
//             </form>
//           </TabsContent>

//           <TabsContent value="forgot-password">
//             <form onSubmit={handleSubmit}>
//               <CardContent className="space-y-4">
//                 {message && <div className="rounded-md bg-green-100 p-3 text-sm text-green-700">{message}</div>}
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Enter your email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="student@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter className="flex flex-col space-y-4">
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? "Sending..." : "Send Reset Link"}
//                 </Button>
//               </CardFooter>
//             </form>
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   );
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "forgot-password">("login")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required")
      return
    }

    if (!password && activeTab === "login") {
      setError("Password is required")
      return
    }

    try {
      if (activeTab === "login") {
        await login(email, password, rememberMe)
        router.push("/dashboard_student")
      } else {
        // Simulate password reset request
        await new Promise((resolve) => setTimeout(resolve, 1000))
        alert(`Password reset link sent to ${email}`)
        setActiveTab("login")
      }
    } catch (err) {
      setError(activeTab === "login" ? "Invalid email or password" : "Failed to send reset link")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <BookOpen className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Student Portal</CardTitle>
          <CardDescription>Access your academic dashboard</CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "forgot-password")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="forgot-password">Forgot Password</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="forgot-password">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

