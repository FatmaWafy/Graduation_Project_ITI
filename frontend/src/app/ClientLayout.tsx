"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications-context";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

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

  // useEffect(() => {
  //   if ("serviceWorker" in navigator && "Notification" in window) {
  //     const registerServiceWorker = async () => {
  //       try {
  //         const registration = await navigator.serviceWorker.register("/sw.js", {
  //           scope: "/",
  //         });
  //         console.log("Service Worker registered:", registration);

  //         // طلب إذن الإشعارات
  //         const permission = await Notification.requestPermission();
  //         if (permission === "granted") {
  //           console.log("👍 المستخدم وافق على الإشعارات");

  //           // تهيئة Firebase
  //           const firebaseConfig = {
  //             apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  //             authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  //             projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  //             storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  //             messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  //             appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  //             measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
  //           };

  //           const app = initializeApp(firebaseConfig);
  //           const messaging = getMessaging(app);

  //           // الحصول على FCM Token
  //           // const token = await getToken(messaging, {
  //           //   vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  //           //   serviceWorkerRegistration: registration,
  //           // });

  //           if (token) {
  //             console.log("FCM Token:", token);

  //             // إرسال التوكن للـ Backend
  //             const authToken = Cookies.get("token");
  //             if (!authToken) {
  //               console.error("No token found, user might not be logged in");
  //               return;
  //             }

  //             const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe/`, {
  //               method: "POST",
  //               headers: {
  //                 "Content-Type": "application/json",
  //                 Authorization: `Bearer ${authToken}`,
  //               },
  //               body: JSON.stringify({ token }), // إرسال التوكن كـ string
  //             });

  //             const responseData = await response.json();
  //             if (response.ok) {
  //               console.log("FCM token sent to backend:", token);
  //             } else {
  //               // console.error("Failed to send FCM token to backend:", responseData);
  //             }
  //           } else {
  //             console.error("No FCM token available");
  //           }
  //         } else {
  //           console.log("👎 المستخدم رفض الإشعارات");
  //         }
  //       } catch (error) {
  //         console.error("Service Worker registration or FCM setup failed:", error);
  //       }
  //     };

  //     // التحقق من التوكن وتشغيل الـ Service Worker
  //     const token = Cookies.get("token");
  //     if (token) {
  //       registerServiceWorker();
  //     } else {
  //       console.log("Waiting for user to log in before registering service worker");
  //     }
  //   } else {
  //     console.log("Service Worker or Notifications not supported in this browser");
  //   }
  // }, []);


  return (
    <>
      <Head>
        <title>{pageTitle}</title>

        <link
          rel='preload'
          href='/_next/static/chunks/main-app-f2ab8f5a96aa974a9.js'
          as='script'
        />
        <link
          rel='preload'
          href='/_next/static/chunks/main-5488f16c6226a992.js'
          as='script'
        />

        <link rel='manifest' href='/manifest.json' />
        <meta name='theme-color' content='#000000' />
        <link rel='icon' href='/favicon.ico' type='image/x-icon' />
        <link rel='apple-touch-icon' href='/logo2.png' type='image/png' />
        <link rel='apple-touch-icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      </Head>

      <GoogleOAuthProvider clientId='447648497550-vnin1f0m7e9t39aem07cfmhjb5gtbtu9.apps.googleusercontent.com'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
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
