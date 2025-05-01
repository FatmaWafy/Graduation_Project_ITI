"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications-context";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let pageTitle = "ITI Examination System"; //default title
  if (pathname && pathname.includes("dashboard_instructor")) {
    pageTitle = "Instructor Dashboard";
  } else if (pathname && pathname.includes("dashboard_student")) {
    pageTitle = "Student Dashboard";
  } else if (pathname && pathname.includes("signin")) {
    pageTitle = "Login ITI";
  } else if (pathname && pathname.includes("signup")) {
    pageTitle = "Signup ITI";
  }

 
  useEffect(() => {
    document.title = pageTitle;
    console.log("Current pathname:", pathname);  
  }, [pathname, pageTitle]);

  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("👍 المستخدم وافق على الإشعارات");
        } else if (permission === "denied") {
          console.log("👎 المستخدم رفض الإشعارات");
        }
      });
    }
  
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("✅ Service Worker مسجل بنجاح", reg);
        })
        .catch((err) => {
          console.error("❌ فشل تسجيل Service Worker", err);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7777" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo2.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </Head>

      <GoogleOAuthProvider clientId="447648497550-vnin1f0m7e9t39aem07cfmhjb5gtbtu9.apps.googleusercontent.com">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}