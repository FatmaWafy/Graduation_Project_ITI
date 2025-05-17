"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
const origin = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSigning, seIsSigning] = useState(false);

  // دالة تسجيل الدخول باستخدام Google
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(`${origin}/users/google/login/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: tokenResponse.access_token,
            is_signup: false,
          }),
        });
        // console.log("Google token:", tokenResponse.access_token);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Google login failed");

        if (data.access) {
          Cookies.set("token", data.access, {
            expires: 7,
            secure: true,
            sameSite: "Lax",
          });
        } else {
          throw new Error("Token is missing");
        }

        if (data.role) {
          Cookies.set("role", data.role, {
            expires: 7,
            secure: true,
            sameSite: "Lax",
          });
          let dashboardPath;

          if (data.role === "instructor") {
            dashboardPath = "/dashboard_instructor";
          } else if (data.role === "student") {
            dashboardPath = "/dashboard_student";
          } else if (data.role === "admin") {
            dashboardPath = "/dashboard_admin";
          } else {
            dashboardPath = "/login"; // default or error route
          }
          router.push(dashboardPath);
        } else {
          throw new Error("Role is missing");
        }
      } catch (err: any) {
        setError(err.message);
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    seIsSigning(true);
    e.preventDefault();
    setError("");
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "light");
    }

    try {
      const res = await fetch(`${origin}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // أضيفي ده لو الـ backend بيستخدم cookies
      });

      // console.log("Login response status:", res.status);
      const data = await res.json();
      // console.log("Login response data:", data);

      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.access) {
        Cookies.set("token", data.access, {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });
      } else {
        throw new Error("Token is missing");
      }

      if (data.role) {
        Cookies.set("role", data.role, {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });
        let dashboardPath;

        if (data.role === "instructor") {
          dashboardPath = "/dashboard_instructor";
        } else if (data.role === "student") {
          dashboardPath = "/dashboard_student";
        } else if (data.role === "admin") {
          dashboardPath = "/dashboard_admin/Instructors";
        } else {
          dashboardPath = "/login"; // default or error route
        }
        router.push(dashboardPath);
      } else {
        throw new Error("Role is missing");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      seIsSigning(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Column - Visual Elements */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        <img
          src='/landing.jpg'
          alt='Background'
          className='absolute inset-0 w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'>
          <div className='flex flex-col items-center justify-center h-full p-8 text-white'>
            <h1 className='text-4xl text-primary font-bold mb-4'>
              Continue Your Progress
            </h1>
            <p className='text-lg text-gray-300 max-w-md text-center mb-8'>
              Sign in to manage exams, track grades, and grow with
              professionalism.
            </p>
            <div className='grid grid-cols-2 gap-4 max-w-md'>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Loyal Commitment</h3>
                <p className='text-sm text-gray-300'>
                  Stay connected to learning
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Professional Tools</h3>
                <p className='text-sm text-gray-300'>
                  Manage exams efficiently
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Joyful Growth</h3>
                <p className='text-sm text-gray-300'>
                  Celebrate your achievements
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Track Success</h3>
                <p className='text-sm text-gray-300'>
                  Monitor grades and feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-6'>
        <Card className='w-full max-w-md mx-auto shadow-xl   rounded-lg px-6 py-6'>
          <CardHeader className='text-center space-y-2'>
            <CardTitle className='text-2xl font-bold'>Welcome Back</CardTitle>
            <p className='text-gray-500 text-sm'>
              Sign in and get started on your projects.
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-4'>
              {error && (
                <Alert
                  variant='destructive'
                  className='bg-red-100 text-red-700'
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className='space-y-2'>
                <Label className='text-sm font-medium'>Email</Label>
                <Input
                  type='email'
                  placeholder='Example@email.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='h-11'
                  required
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label className='text-sm font-medium'>Password</Label>
                  <Link href='/forget_pass' className='text-xs text-primary'>
                    Forgot Password?
                  </Link>
                </div>
                <div className='relative'>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder='At least 8 characters'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='h-11'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
                    aria-label='Toggle password visibility'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='remember'
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className='border-gray-300 data-[state=checked]:bg-primary'
                />
                <Label htmlFor='remember' className='text-sm text-gray-500'>
                  Remember me for 30 days
                </Label>
              </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <Button
                type='submit'
                className='w-full h-11 bg-primary hover:bg-primary/90 text-white'
                disabled={isSigning}
              >
                {isSigning ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    Signing in...
                  </>
                ) : (
                  <>Sign in</>
                )}
              </Button>

              <div className='relative w-full'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>
                    Or sign in with
                  </span>
                </div>
              </div>

              <Button
                variant='outline'
                className='w-full h-11'
                onClick={(e) => {
                  e.preventDefault();
                  googleLogin();
                }}
                aria-label='Sign in with Google'
              >
                <img src='/google.png' alt='Google' className='w-5 h-5 mr-2' />
                Google
              </Button>

              {/* <p className='text-center text-sm text-gray-500'>
                Don't have an account?{" "}
                <Link
                  href='/signup'
                  className='text-primary hover:text-primary/90 font-medium'
                >
                  Sign up
                </Link>
              </p> */}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
