"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://127.0.0.1:8000/users/login/", {
        method: "POST",
        credentials: "include", // ✅ يسمح بإرسال الكوكيز
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("🔹 API Response:", data);

      if (!res.ok) throw new Error(data.error || "Login failed");

      setSuccess("Login successful!");

      if (data.token) {
        Cookies.set("token", data.token, { expires: 7, secure: true, sameSite: "Lax" });
      } else {
        throw new Error("Token is missing");
      }

      if (data.role) {
        Cookies.set("role", data.role, { expires: 7, secure: true, sameSite: "Lax" });

        if (data.role === "instructor") {
          router.push("/dashboard/instructor");
        } else if (data.role === "student") {
          router.push("/dashboard/student");
        } else {
          throw new Error("Unauthorized role");
        }
      } else {
        throw new Error("Role is missing");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Sign In</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        <div className="space-y-4">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300" 
            required 
          />
        </div>
        
        <div className="text-right text-sm text-indigo-500 mt-2">
          <Link href="/forget_pass">Forgot Password?</Link>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-4 hover:bg-indigo-700 transition">
          Sign In
        </button>
      </form>
    </div>
  );
}
