"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, EyeOff } from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

    try {
      setIsSubmitting(true);
      const response = await fetch("http://127.0.0.1:8000/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email,
          password,
          track_name,
          branch_name,
        }),
      });

      if (!response.ok) throw new Error("Failed to create account");

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <Card className='w-full max-w-md p-6 shadow-lg bg-white rounded-xl'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-2'>
            <BookOpen className='h-10 w-10 text-green-500' />
          </div>
          <CardTitle className='text-2xl font-bold'>
            Create an Account
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            {error && (
              <div className='bg-red-100 text-red-600 p-2 rounded-md text-sm'>
                {error}
              </div>
            )}
            <div>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Your Name'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='instructor@example.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor='track_name'>Select Track</Label>
              <select
                id='track_name'
                name='track_name'
                value={formData.track_name}
                onChange={handleChange}
                required
                className='w-full p-2 border rounded-md'
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

            <div>
              <Label htmlFor='branch_name'>Select Branch</Label>
              <select
                id='branch_name'
                name='branch_name'
                value={formData.branch_name}
                onChange={handleChange}
                required
                className='w-full p-2 border rounded-md'
              >
                <option value='' disabled>
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
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-2 top-2'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </Button>
              </div>
              <p className='text-xs text-gray-500'>
                Password must be at least 8 characters long
              </p>
            </div>
            <div>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button
              type='submit'
              className='w-full bg-green-500 hover:bg-green-600 text-white'
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            <div className='text-center text-sm'>
              Already have an account?{" "}
              <Link href='/' className='text-green-500 hover:underline'>
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
