
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { api } from "@/lib/api";


type User = {
  id: string
  name: string
  email: string
  avatar: string
  role: "student"
}
type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = Cookies.get("token")

    if (token) {
      try {
        const decoded: any = jwtDecode(token)

        setUser({
          id: decoded.user_id?.toString(),
          name: decoded.name || "User",
          email: decoded.email,
          avatar: "/placeholder.svg?height=40&width=40",
          role: decoded.role,
        })
      } catch (error) {
        console.error("Failed to decode token:", error)
        setUser(null)
      }
    }

    setLoading(false)
  }, [])


interface JWTTokenPayload {
  user_id: number
  exp: number
  iat: number
  jti: string
}

const login = async (email: string, password: string, rememberMe = false) => {
  setLoading(true)
  try {
    // 1. Send login request to backend
    const response = await axios.post(api.token, {
      email,
      password,
    })

    const token = response.data.access
    console.log("Token received:", token)

    // 2. Decode the token to get user_id
    const decoded: JWTTokenPayload = jwtDecode(token)
    const userId = decoded.user_id
    console.log("Decoded user_id:", userId)

    // 3. Fetch user data using user_id
    const userRes = await axios.get(api.getStudentByIdUrlW(userId))
    console.log("User data received:", userRes.data)

    const userData: User = {
      id: userRes.data.id,
      name: userRes.data.name,
      email: userRes.data.email,
      avatar: userRes.data.avatar || "/placeholder.svg?height=40&width=40",
      role: userRes.data.role || "student",
    }

    setUser(userData)

    // 4. Store token and role in cookies
    Cookies.set("token", token, {
      expires: rememberMe ? 7 : undefined,
      secure: true,
      sameSite: "Lax",
    })
    Cookies.set("role", userData.role, {
      expires: rememberMe ? 7 : undefined,
      secure: true,
      sameSite: "Lax",
    })

  } catch (error: any) {
    console.error("Login failed:", error)
    throw new Error(error.response?.data?.detail || "Login failed")
  } finally {
    setLoading(false)
  }
}


  const logout = () => {
    setUser(null);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
