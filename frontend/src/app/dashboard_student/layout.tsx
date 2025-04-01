"use client";

<<<<<<< HEAD:frontend/app/dashboard_student/layout.tsx
import type React from "react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/dashboard-layout";
=======
import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie" // ✅ استيراد مكتبة الكوكيز
import { useAuth } from "@/src/lib/auth-context"
import DashboardLayout from "@/src/components/dashboard-layout"
>>>>>>> a90086caad0bf4df4b6fbd3fd31f452a7381fd7f:frontend/src/app/dashboard_student/layout.tsx

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isUnauthenticated = useMemo(() => !loading && !user, [user, loading]);

  useEffect(() => {
<<<<<<< HEAD:frontend/app/dashboard_student/layout.tsx
    if (isUnauthenticated) {
      router.replace("/login"); // `replace` prevents adding to browser history
=======
    if (!loading && !user) {
      const token = Cookies.get("token") // ✅ قراءة التوكن من الكوكيز
      if (!token) {
        router.push("/login")
      }
>>>>>>> a90086caad0bf4df4b6fbd3fd31f452a7381fd7f:frontend/src/app/dashboard_student/layout.tsx
    }
  }, [isUnauthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
