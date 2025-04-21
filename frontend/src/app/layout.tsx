import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationsProvider } from "@/lib/notifications-context"; // ✅ استدعاء مزود الإشعارات
import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Dashboard",
  description:
    "A comprehensive dashboard for students to manage their academic life",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={inter.className}
      >
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
      </body>
    </html>
  );
}
