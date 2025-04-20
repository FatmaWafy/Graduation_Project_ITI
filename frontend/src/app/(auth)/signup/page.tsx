"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, BookOpen } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    track_name: "",
    branch_name: "",
  });
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tracks, setTracks] = useState([]);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/branches/");
        const data = await res.json();
        if (Array.isArray(data)) {
          setBranches(data);
        } else {
          setBranches([]);
          console.error("Unexpected response for branches:", data);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch tracks
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/get-tracks/");
        const data = await res.json();
        if (Array.isArray(data)) {
          setTracks(data);
        } else {
          setTracks([]);
          console.error("Unexpected response for tracks:", data);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };
    fetchTracks();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword, track_name, branch_name } =
      formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !track_name ||
      !branch_name
    ) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const payload = {
      username: name,
      email,
      password,
      track_name,
      branch: branch_name,
    };

    console.log("Sending payload:", payload);

    try {
      setIsSubmitting(true);
      const response = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create account");
      }

      router.push("/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left Column - Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-4'>
        <Card className='w-full max-w-md shadow-none border-0'>
          <CardHeader className='text-center space-y-2 pt-4'>
            <CardTitle className='text-2xl font-bold'>Create Account</CardTitle>
            <p className='text-gray-500 text-sm'>
              Fill in your details to get started
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-3'>
              {error && (
                <Alert
                  variant='destructive'
                  className="bg-red-100 text-red-700"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <Label className='text-sm font-medium'>Name</Label>
                  <Input
                    name='name'
                    placeholder='Your full name'
                    value={formData.name}
                    onChange={handleChange}
                    className='h-10'
                    required
                  />
                </div>

                <div className='space-y-1'>
                  <Label className='text-sm font-medium'>Email</Label>
                  <Input
                    name='email'
                    type='email'
                    placeholder='Example@email.com'
                    value={formData.email}
                    onChange={handleChange}
                    className='h-10'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <Label className='text-sm font-medium'>Password</Label>
                  <div className='relative'>
                    <Input
                      name='password'
                      type={showPassword ? "text" : "password"}
                      placeholder='At least 8 characters'
                      value={formData.password}
                      onChange={handleChange}
                      className='h-10'
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
                </div>

                <div className='space-y-1'>
                  <Label className='text-sm font-medium'>
                    Confirm Password
                  </Label>
                  <Input
                    name='confirmPassword'
                    type={showPassword ? "text" : "password"}
                    placeholder='Repeat password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className='h-10'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='space-y-1'>
                  <Label className='text-sm font-medium'>Track</Label>
                  <select
                    name='track_name'
                    value={formData.track_name}
                    onChange={handleChange}
                    className='w-full h-10 rounded-md border border-input bg-background px-3'
                    required
                  >
                    <option value='' disabled>
                      Select your track
                    </option>
                    {tracks.map((track) => (
                      <option key={track.id} value={track.name}>
                        {track.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='space-y-1'>
                  <Label className='text-sm font-medium'>Branch</Label>
                  <select
                    name='branch_name'
                    value={formData.branch_name}
                    onChange={handleChange}
                    className='w-full h-10 rounded-md border border-input bg-background px-3'
                    required
                  >
                    <option value='' disabled>
                      Select your branch
                    </option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>

            <CardFooter className='flex flex-col space-y-3 pt-2'>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='w-full h-10 bg-primary hover:bg-primary/90 text-white'
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>

              <div className='relative w-full'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white text-gray-500'>
                    Or sign up with
                  </span>
                </div>
              </div>

              <Button
                variant='outline'
                className='w-full h-10'
                aria-label='Sign up with Google'
              >
                <img src='/google.png' alt='Google' className='w-4 h-4 mr-2' />
                Google
              </Button>

              <p className='text-center text-sm text-gray-500'>
                Already have an account?{" "}
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
              Start Your Learning Journey
            </h1>
            <p className='text-lg text-gray-300 max-w-md text-center mb-8'>
              Join our examination system to unlock your ICT potential and excel
              with passion.
            </p>
            <div className='grid grid-cols-2 gap-4 max-w-md'>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>
                  Passionate Learning
                </h3>
                <p className='text-sm text-gray-300'>
                  Engage with dynamic exams
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Open Community</h3>
                <p className='text-sm text-gray-300'>
                  Collaborate with peers
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>Go Extra Mile</h3>
                <p className='text-sm text-gray-300'>
                  Achieve beyond expectations
                </p>
              </div>
              <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm'>
                <h3 className='font-semibold text-white'>ICT Excellence</h3>
                <p className='text-sm text-gray-300'>
                  Master professional skills
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
