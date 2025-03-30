"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

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
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      fetchUserData(accessToken);
    } else {
      setLoading(false);
    }
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

      // Store tokens
      if (rememberMe) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
      }

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    router.push("/login");
  };

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
