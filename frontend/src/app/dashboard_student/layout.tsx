"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie" // ✅ استيراد مكتبة الكوكيز
import { useAuth } from "@/lib/auth-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      const token = Cookies.get("token") // ✅ قراءة التوكن من الكوكيز
      if (!token) {
        router.push("/")
      }
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
