"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "1",
        name: "Alex Johnson",
        email: email,
        avatar: "/placeholder.svg?height=40&width=40",
        role: "student",
      }

      setUser(userData)

      // If rememberMe is true, store in localStorage, otherwise in sessionStorage
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(userData))
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData))
        // Remove from localStorage if it exists
        localStorage.removeItem("user")
      }
    } catch (error) {
      console.error("Login failed", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would register the user here
      console.log("Registered user:", { name, email, password })

      // Don't automatically log in the user after registration
      // They should verify their email first
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send a password reset email
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would reset the password
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

