// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { ArrowLeft, Mail, Loader2, School, ShieldQuestion, KeyRound } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Label } from "@/components/ui/label"

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("")
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setMessage(null)

//     try {
//       const res = await fetch("http://127.0.0.1:8000/users/reset-password-request/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       })
//       const data = await res.json()
//       if (res.ok) {
//         setMessage({
//           type: "success",
//           text: "Check your email for the password reset link.",
//         })
//       } else {
//         setMessage({
//           type: "error",
//           text: data.error || "Something went wrong.",
//         })
//       }
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: "Failed to send request. Try again.",
//       })
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-red-50 to-red-100">
//       {/* Left Column - Visual Elements */}
//       <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-red-900 to-red-950 flex-col items-center justify-center">
//         <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
//           <div className="w-32 h-32 rounded-full bg-red-800/30 flex items-center justify-center mb-8">
//             <ShieldQuestion className="w-16 h-16 text-white" />
//           </div>

//           <div className="max-w-md text-center space-y-6">
//             <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
//               <h2 className="text-3xl font-bold text-white mb-4">Password Recovery</h2>
//               <p className="text-red-100 text-lg">
//                 Don't worry, we've got you covered. Follow these simple steps to regain access to your account.
//               </p>
//             </div>

//             <div className="space-y-4 mt-8">
//               <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
//                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-800/50 flex items-center justify-center">
//                   <Mail className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="font-semibold text-white">Enter Your Email</h3>
//                   <p className="text-sm text-red-100">Provide the email address associated with your account</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
//                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-800/50 flex items-center justify-center">
//                   <Mail className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="font-semibold text-white">Check Your Inbox</h3>
//                   <p className="text-sm text-red-100">We'll send you a secure link to reset your password</p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm">
//                 <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-800/50 flex items-center justify-center">
//                   <KeyRound className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="text-left">
//                   <h3 className="font-semibold text-white">Create New Password</h3>
//                   <p className="text-sm text-red-100">Set a strong, secure password for your account</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Column - Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
//         <div className="w-full max-w-md">
//           <div className="mb-8 text-center lg:hidden">
//             <div className="flex justify-center mb-4">
//               <div className="rounded-full bg-red-900 p-4 shadow-lg">
//                 <School className="h-10 w-10 text-white" />
//               </div>
//             </div>
//             <h1 className="text-3xl font-bold text-red-900">Information Technology Institute</h1>
//             <p className="text-red-700 mt-2">Egypt's Premier Technology Education Center</p>
//           </div>

//           <Card className="w-full border-0 shadow-xl bg-white rounded-xl overflow-hidden">
//             <div className="h-2 bg-gradient-to-r from-red-700 via-red-900 to-red-800"></div>
//             <CardHeader className="space-y-1 text-center pb-6 pt-8">
//               <div className="flex justify-center">
//                 <div className="rounded-full bg-red-50 p-3 border border-red-100">
//                   <ShieldQuestion className="h-8 w-8 text-red-800" />
//                 </div>
//               </div>
//               <CardTitle className="text-2xl font-bold text-gray-800 mt-4">Forgot Password</CardTitle>
//               <p className="text-gray-600">Enter your email to receive a password reset link</p>
//             </CardHeader>

//             <CardContent className="space-y-5">
//               {message && (
//                 <Alert
//                   variant={message.type === "error" ? "destructive" : "default"}
//                   className={
//                     message.type === "error"
//                       ? "bg-red-50 text-red-700 border-red-200"
//                       : "bg-green-50 text-green-700 border-green-200"
//                   }
//                 >
//                   <AlertDescription>{message.text}</AlertDescription>
//                 </Alert>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-gray-700 font-medium">
//                     Email Address
//                   </Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="Enter your email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="border-gray-200 focus-visible:ring-red-800 pl-10"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full bg-red-900 hover:bg-red-950 text-white font-medium py-6"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <Mail className="mr-2 h-5 w-5" />
//                       Send Reset Link
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>

//             <CardFooter className="flex justify-center pt-2 pb-8">
//               <Link
//                 href="/"
//                 className="text-red-800 hover:text-red-900 hover:underline inline-flex items-center font-medium"
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back to Sign In
//               </Link>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
const origin = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(
        `${origin}/users/reset-password-request/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: "Check your email for the password reset link.",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Something went wrong.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to send request. Try again.",
      });
    }
    setLoading(false);
  };

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Column - Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md shadow-xl rounded-lg px-6 py-6'>
          <CardHeader className='text-center space-y-2 pt-4'>
            <CardTitle className='text-2xl font-bold'>
              Forgot Password
            </CardTitle>
            <p className='text-gray-500 text-sm'>
              Enter your email to receive a password reset link
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-3'>
              {message && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                  className="bg-red-100 text-red-700"
                >
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
                
              )}

              <div className='space-y-1'>
                <Label className='text-sm font-medium'>Email Address</Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    id='email'
                    type='email'
                    placeholder='Example@email.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='h-10 pl-10'
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-3 pt-2'>
              <Button
                type='submit'
                className='w-full h-10 bg-primary hover:bg-primary/90 text-white'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className='mr-2 h-4 w-4' />
                    Send Reset Link
                  </>
                )}
              </Button>

              <p className='text-center text-sm text-gray-500'>
                Back to{" "}
                <Link
                  href='/signin'
                  className='text-primary hover:text-primary/90 font-medium'
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right Column - Visual Elements with Image and Cards */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        <img
          src='/landing.jpg'
          alt='Background'
          className='absolute inset-0 w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'>
          <div className='flex flex-col items-center justify-center h-full p-8 text-white'>
            <h1 className='text-4xl text-primary font-bold mb-4'>
              Recover Your Account
            </h1>
            <p className='text-lg text-gray-300 max-w-md text-center mb-8'>
              Regain access to your exams and materials with our professional
              support.
            </p>
            <div className='grid grid-cols-2 gap-4 max-w-md'>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Open Support</h3>
                <p className='text-sm text-gray-300'>We’re here to help</p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Extra Effort</h3>
                <p className='text-sm text-gray-300'>Swift account recovery</p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Secure Process</h3>
                <p className='text-sm text-gray-300'>Safe and reliable</p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Resume Learning</h3>
                <p className='text-sm text-gray-300'>Get back to your exams</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
