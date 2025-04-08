"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  PieChart,
  Settings,
  User,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NotificationsDropdown } from "@/components/notifications-dropdown"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard_student", icon: Home },
  { title: "Exams", href: "/dashboard_student/exams", icon: BookOpen },
  { title: "Grades", href: "/dashboard_student/grades", icon: PieChart },
  { title: "Calendar", href: "/dashboard_student/calendar", icon: Calendar },
  { title: "Profile", href: "/dashboard_student/profile", icon: User },
  { title: "Settings", href: "/dashboard_student/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 z-50 flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out md:static ${
          isSidebarOpen ? "left-0 w-64" : "-left-64 md:left-0 md:w-20"
        }`}
      >
        <div className="flex h-14 items-center border-b px-4">
          {isSidebarOpen ? (
            <h1 className="text-xl font-bold text-sidebar-foreground">Student Portal</h1>
          ) : (
            <span className="mx-auto text-xl font-bold text-sidebar-foreground">SP</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden md:flex text-sidebar-foreground"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${isSidebarOpen ? "" : "rotate-180"}`} />
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                  pathname === item.href ? "bg-primary text-primary-foreground" : "text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {isSidebarOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="text-sm font-medium leading-none text-sidebar-foreground">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-sidebar">
            <div className="flex h-14 items-center border-b px-4">
              <h1 className="text-xl font-bold text-sidebar-foreground">Student Portal</h1>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                      pathname === item.href ? "bg-primary text-primary-foreground" : "text-sidebar-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="text-sm font-medium leading-none text-sidebar-foreground">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} className="text-sidebar-foreground">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
          <div className="ml-auto flex items-center gap-2">
            <NotificationsDropdown />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-7">{children}</div>
      </main>
    </div>
  )
}

