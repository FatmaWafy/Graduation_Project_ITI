"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
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
        const dashboardPath =
          data.role === "instructor"
            ? "/dashboard_instructor"
            : "/dashboard_student";
        router.push(dashboardPath);
      } else {
        throw new Error("Role is missing");
      }
    } catch (err: any) {
      setError(err.message);
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
            <h1 className='text-4xl text-primary font-bold mb-4'>Continue Your Progress</h1>
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
        <Card className='w-full max-w-md mx-auto shadow-none border-0'>
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
                  className="bg-red-100 text-red-700"
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
              >
                Sign in
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

              <Button variant='outline' className='w-full h-11'>
                <img src='/google.png' alt='Google' className='w-5 h-5 mr-2' />
                Google
              </Button>

              <p className='text-center text-sm text-gray-500'>
                Don't have an account?{" "}
                <Link
                  href='/signup'
                  className='text-primary hover:text-primary/90 font-medium'
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
