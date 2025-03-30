"use client";

import type React from "react";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/dashboard-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isUnauthenticated = useMemo(() => !loading && !user, [user, loading]);

  useEffect(() => {
    if (isUnauthenticated) {
      router.replace("/login"); // `replace` prevents adding to browser history
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
