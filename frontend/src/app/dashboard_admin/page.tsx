// app/dashboard_admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard_admin/instructors");
  }, []);

  return <p>Redirecting...</p>;
}
