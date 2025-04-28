// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useParams } from "next/navigation"
// import Link from "next/link"
// import { ArrowLeft, KeyRound, Loader2, Eye, EyeOff, School, Lock, CheckCircle, ShieldCheck } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Label } from "@/components/ui/label"

// export default function ResetPasswordPage() {
//   const router = useRouter()
//   const params = useParams()

//   const [newPassword, setNewPassword] = useState("")
//   const [confirmPassword, setConfirmPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (newPassword !== confirmPassword) {
//       setMessage({ type: "error", text: "Passwords do not match." })
//       return
//     }

//     setLoading(true)
//     setMessage(null)

//     try {
//       const response = await fetch("http://127.0.0.1:8000/users/reset-password/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           uid: params.uid,
//           token: params.token,
//           new_password: newPassword,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to reset password.")
//       }

//       setMessage({ type: "success", text: "Password reset successful! Redirecting..." })
//       setTimeout(() => {
//         router.push("/signin")
//       }, 2000)
//     } catch (err: any) {
//       setMessage({ type: "error", text: err.message })
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Password strength checker
//   const getPasswordStrength = (password: string): { strength: string; color: string } => {
//     if (!password) return { strength: "Empty", color: "bg-gray-200" }
//     if (password.length < 6) return { strength: "Weak", color: "bg-red-500" }
//     if (password.length < 10) return { strength: "Medium", color: "bg-yellow-500" }
//     return { strength: "Strong", color: "bg-green-500" }
//   }

//   const passwordStrength = getPasswordStrength(newPassword)

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-red-50 to-red-100">
//       {/* Left Column - Visual Elements */}
//       <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-red-900 to-red-950 flex-col items-center justify-center">
//         <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
//           <div className="w-32 h-32 rounded-full bg-red-800/30 flex items-center justify-center mb-8">
//             <ShieldCheck className="w-16 h-16 text-white" />
//           </div>

//           <div className="max-w-md text-center space-y-6">
//             <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg">
//               <h2 className="text-3xl font-bold text-white mb-4">Create a New Password</h2>
//               <p className="text-red-100 text-lg">
//                 Set a strong password to keep your ITI account secure and protected.
//               </p>
//             </div>

//             <div className="space-y-6 mt-8">
//               <div className="bg-white/10 p-6 rounded-lg shadow backdrop-blur-sm">
//                 <h3 className="font-semibold text-white text-xl mb-4">Password Tips</h3>

//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <CheckCircle className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
//                     <p className="text-sm text-red-100 text-left">
//                       Use at least 10 characters with a mix of letters, numbers, and symbols
//                     </p>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <CheckCircle className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
//                     <p className="text-sm text-red-100 text-left">
//                       Avoid using personal information like your name or birthdate
//                     </p>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <CheckCircle className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
//                     <p className="text-sm text-red-100 text-left">
//                       Don't reuse passwords from other websites or applications
//                     </p>
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <CheckCircle className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
//                     <p className="text-sm text-red-100 text-left">
//                       Consider using a password manager to generate and store strong passwords
//                     </p>
//                   </div>
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
//                   <Lock className="h-8 w-8 text-red-800" />
//                 </div>
//               </div>
//               <CardTitle className="text-2xl font-bold text-gray-800 mt-4">Reset Password</CardTitle>
//               <p className="text-gray-600">Create a new secure password for your account</p>
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
//                   <Label htmlFor="newPassword" className="text-gray-700 font-medium">
//                     New Password
//                   </Label>
//                   <div className="relative">
//                     <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                     <Input
//                       id="newPassword"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter new password"
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       className="border-gray-200 focus-visible:ring-red-800 pl-10 pr-10"
//                       required
//                     />
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                     </Button>
//                   </div>

//                   {/* Password strength indicator */}
//                   {newPassword && (
//                     <div className="mt-2">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-xs text-gray-500">Password strength:</span>
//                         <span
//                           className={`text-xs font-medium ${
//                             passwordStrength.strength === "Strong"
//                               ? "text-green-600"
//                               : passwordStrength.strength === "Medium"
//                                 ? "text-yellow-600"
//                                 : "text-red-600"
//                           }`}
//                         >
//                           {passwordStrength.strength}
//                         </span>
//                       </div>
//                       <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                         <div
//                           className={`h-full ${passwordStrength.color}`}
//                           style={{
//                             width:
//                               passwordStrength.strength === "Strong"
//                                 ? "100%"
//                                 : passwordStrength.strength === "Medium"
//                                   ? "50%"
//                                   : "25%",
//                           }}
//                         ></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
//                     Confirm Password
//                   </Label>
//                   <div className="relative">
//                     <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                     <Input
//                       id="confirmPassword"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Confirm new password"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       className="border-gray-200 focus-visible:ring-red-800 pl-10"
//                       required
//                     />
//                   </div>
//                   {confirmPassword && newPassword !== confirmPassword && (
//                     <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
//                   )}
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full bg-red-900 hover:bg-red-950 text-white font-medium py-6 mt-4"
//                   disabled={loading || (confirmPassword && newPassword !== confirmPassword)}
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                       Resetting...
//                     </>
//                   ) : (
//                     <>
//                       <ShieldCheck className="mr-2 h-5 w-5" />
//                       Reset Password
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
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { KeyRound, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
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


export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${origin}/users/reset-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: params.uid,
            token: params.token,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setMessage({
        type: "success",
        text: "Password reset successful! Redirecting...",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (
    password: string
  ): { strength: string; color: string } => {
    if (!password) return { strength: "Empty", color: "bg-gray-200" };
    if (password.length < 6) return { strength: "Weak", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: "Medium", color: "bg-yellow-500" };
    return { strength: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Column - Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md shadow-xl border-primary   px-6 py-6 '>
          <CardHeader className='text-center space-y-2 pt-4'>
            <CardTitle className='text-2xl font-bold'>Reset Password</CardTitle>
            <p className='text-gray-500 text-sm'>
              Create a new secure password for your account
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
                <Label className='text-sm font-medium'>New Password</Label>
                <div className='relative'>
                  <KeyRound className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    id='newPassword'
                    type={showPassword ? "text" : "password"}
                    placeholder='At least 8 characters'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='h-10 pl-10 pr-10'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-500'
                    aria-label='Toggle password visibility'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
                {newPassword && (
                  <div className='mt-2'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='text-xs text-gray-500'>
                        Password strength:
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.strength === "Strong"
                            ? "text-green-600"
                            : passwordStrength.strength === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.strength}
                      </span>
                    </div>
                    <div className='w-full h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                      <div
                        className={`h-full ${passwordStrength.color}`}
                        style={{
                          width:
                            passwordStrength.strength === "Strong"
                              ? "100%"
                              : passwordStrength.strength === "Medium"
                              ? "50%"
                              : "25%",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className='space-y-1'>
                <Label className='text-sm font-medium'>Confirm Password</Label>
                <div className='relative'>
                  <KeyRound className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                  <Input
                    id='confirmPassword'
                    type={showPassword ? "text" : "password"}
                    placeholder='Repeat password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='h-10 pl-10'
                    required
                  />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className='text-xs text-red-600 mt-1'>
                    Passwords do not match
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-3 pt-2'>
              <Button
                type='submit'
                className='w-full h-10 bg-primary hover:bg-primary/90 text-white'
                disabled={
                  loading ||
                  (confirmPassword && newPassword !== confirmPassword)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Resetting...
                  </>
                ) : (
                  <>
                    <ShieldCheck className='mr-2 h-4 w-4' />
                    Reset Password
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
            <h1 className='text-4xl  text-primary font-bold mb-4'>Secure Your Learning</h1>
            <p className='text-lg text-gray-300 max-w-md text-center mb-8'>
              Set a strong password to protect your exams and progress with
              professionalism.
            </p>
            <div className='grid grid-cols-2 gap-4 max-w-md'>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>
                  Professional Security
                </h3>
                <p className='text-sm text-gray-300'>
                  Safeguard your account
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Loyal Protection</h3>
                <p className='text-sm text-gray-300'>Keep your data safe</p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>
                  Passionate Recovery
                </h3>
                <p className='text-sm text-gray-300'>
                  Resume with confidence
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Strong Foundation</h3>
                <p className='text-sm text-gray-300'>
                  Build a secure profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
