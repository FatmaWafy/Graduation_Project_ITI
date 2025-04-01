"use client";

<<<<<<< HEAD:frontend/lib/auth-context.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
=======
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Cookies from "js-cookie";
>>>>>>> a90086caad0bf4df4b6fbd3fd31f452a7381fd7f:frontend/src/lib/auth-context.tsx

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "student";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data & validate token on first load
  useEffect(() => {
<<<<<<< HEAD:frontend/lib/auth-context.tsx
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserData(accessToken);
    } else {
      setLoading(false);
    }
=======
    // Check if user is logged in via cookies
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      setUser({
        id: "1",
        name: "User",
        email: "user@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: role as "student",
      });
    }
    setLoading(false);
>>>>>>> a90086caad0bf4df4b6fbd3fd31f452a7381fd7f:frontend/src/lib/auth-context.tsx
  }, []);

  // Fetch user details from API
  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Invalid token");

      const data: User = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout(); // Clear token if invalid
    } finally {
      setLoading(false);
    }
  };

  // Login function with API call
  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");

      const { accessToken, refreshToken, user } = await res.json();

      setUser(user);

<<<<<<< HEAD:frontend/lib/auth-context.tsx
      // Store tokens
      if (rememberMe) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
      }
=======
      // Store token and role in cookies
      Cookies.set("token", "mockToken", { expires: 7, secure: true, sameSite: "Lax" });
      Cookies.set("role", userData.role, { expires: 7, secure: true, sameSite: "Lax" });
    } catch (error) {
      console.error("Login failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }
>>>>>>> a90086caad0bf4df4b6fbd3fd31f452a7381fd7f:frontend/src/lib/auth-context.tsx

      router.push("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
<<<<<<< HEAD:frontend/lib/auth-context.tsx
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    router.push("/login");
  };
=======
    Cookies.remove("token");
    Cookies.remove("role");
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Registered user:", { name, email, password })
    } catch (error) {
      console.error("Registration failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const requestPasswordReset = async (email: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password reset requested for:", email)
    } catch (error) {
      console.error("Password reset request failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Password reset with token:", token, "New password:", newPassword)
    } catch (error) {
      console.error("Password reset failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }
>>>>>>> a90086caad0bf4df4b6fbd3fd31f452a7381fd7f:frontend/src/lib/auth-context.tsx

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
