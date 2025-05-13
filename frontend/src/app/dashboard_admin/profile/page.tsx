"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-toastify"
import {
  User,
  Mail,
  Phone,
  Upload,
  Save,
  Home,
  Shield,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Bell,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState<any>({})
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      const decoded: any = jwtDecode(token)
      const userId = decoded.user_id

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/users/current-admin/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAdminData(res.data)
        })
        .catch((err) => console.error(err))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const token = Cookies.get("token")
    if (!token) return

    const decoded: any = jwtDecode(token)
    const userId = decoded.user_id

    const formData = new FormData()
    formData.append("username", adminData.username)
    formData.append("email", adminData.email)
    formData.append("phone_number", adminData.phone_number || "")
    formData.append("address", adminData.address || "")

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/users/update-admin-profile/${userId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      )

      if (profileImage) {
        const imageFormData = new FormData()
        imageFormData.append("profile_image", profileImage)

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/users/upload-profile-image/${userId}/`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        )
      }

      toast.success("Profile updated successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update profile.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (passwordError) {
      setPasswordError("")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPasswordLoading(true)
    setPasswordError("")

    // Validate passwords match
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordError("New passwords do not match")
      setIsPasswordLoading(false)
      return
    }

    // Validate password strength
    if (passwordValues.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      setIsPasswordLoading(false)
      return
    }

    const token = Cookies.get("token")
    if (!token) return

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/admin/change-password/`,
        {
          current_password: passwordValues.currentPassword,
          new_password: passwordValues.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      toast.success("Password changed successfully!")

      // Reset form
      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err: any) {
      console.error(err)
      if (err.response?.data?.detail) {
        setPasswordError(err.response.data.detail)
      } else {
        setPasswordError("Failed to change password. Please try again.")
      }
      toast.error("Failed to change password")
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "AD"
    return name.substring(0, 2).toUpperCase()
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="w-full space-y-6 max-w-none">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1 border-gray-100 shadow-sm">
          <CardHeader className="pb-4 text-center border-b border-gray-100">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                <AvatarImage
                  src={profileImage ? URL.createObjectURL(profileImage) : adminData.profile_image || "/placeholder.svg"}
                  alt={adminData.username || "Admin"}
                />
                <AvatarFallback className="bg-[#A61B1B]/10 text-[#A61B1B] text-xl">
                  {getInitials(adminData.username)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl font-semibold">{adminData.username || "Admin User"}</CardTitle>
            <CardDescription className="text-sm flex items-center justify-center gap-1">
              <Shield size={14} className="text-[#A61B1B]" />
              System Administrator
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-[#A61B1B]" />
                <span className="text-gray-600">{adminData.email || "admin@example.com"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-[#A61B1B]" />
                <span className="text-gray-600">{adminData.phone_number || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Home size={16} className="text-[#A61B1B]" />
                <span className="text-gray-600">{adminData.address || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-[#A61B1B]" />
                <span className="text-gray-600">Joined: {formatDate(adminData.date_joined || "")}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-[#A61B1B]">
              <CheckCircle size={16} />
              <span>Active Account</span>
            </div>
          </CardFooter>
        </Card>

        {/* Profile Edit Form */}
        <Card className="md:col-span-2 border-gray-100 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold">Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-[#A61B1B] data-[state=active]:text-white"
                >
                  Profile Information
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-[#A61B1B] data-[state=active]:text-white"
                >
                  Account Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                        <User size={16} className="text-[#A61B1B]" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={adminData.username || ""}
                        onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                        className="border-gray-200 focus:border-[#A61B1B] focus:ring-[#A61B1B]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                        <Mail size={16} className="text-[#A61B1B]" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={adminData.email || ""}
                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                        className="border-gray-200 focus:border-[#A61B1B] focus:ring-[#A61B1B]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                        <Phone size={16} className="text-[#A61B1B]" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="text"
                        value={adminData.phone_number || ""}
                        onChange={(e) => setAdminData({ ...adminData, phone_number: e.target.value })}
                        className="border-gray-200 focus:border-[#A61B1B] focus:ring-[#A61B1B]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                        <Home size={16} className="text-[#A61B1B]" />
                        Address
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        value={adminData.address || ""}
                        onChange={(e) => setAdminData({ ...adminData, address: e.target.value })}
                        className="border-gray-200 focus:border-[#A61B1B] focus:ring-[#A61B1B]"
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label htmlFor="profile_image" className="text-sm font-medium flex items-center gap-2">
                      <Upload size={16} className="text-[#A61B1B]" />
                      Update Profile Image
                    </Label>
                    <Input
                      id="profile_image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files && setProfileImage(e.target.files[0])}
                      className="border-gray-200 focus:border-[#A61B1B] file:bg-[#A61B1B]/10 file:text-[#A61B1B] file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 hover:file:bg-[#A61B1B]/20"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#A61B1B] hover:bg-[#8A1717] text-white"
                      disabled={isLoading}
                    >
                      <Save size={16} className="mr-2" />
                      {isLoading ? "Updating..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="account" className="space-y-6 pt-2">
                <Card className="border-gray-100 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#A61B1B] to-[#8A1717] text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Lock size={18} />
                      Password
                    </CardTitle>
                    <CardDescription className="text-white/80">Change your account password</CardDescription>
                  </CardHeader>
                  <form onSubmit={handlePasswordSubmit}>
                    <CardContent className="space-y-4 pt-6">
                      {passwordError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2">
                          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{passwordError}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-sm font-medium flex items-center gap-2">
                          <Lock size={16} className="text-[#A61B1B]" />
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwordValues.currentPassword}
                            onChange={handlePasswordChange}
                            className="border-gray-200 pr-10 focus:border-[#A61B1B] focus:ring-[#A61B1B]"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-[#A61B1B]"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">Toggle password visibility</span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-sm font-medium flex items-center gap-2">
                          <Lock size={16} className="text-[#A61B1B]" />
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwordValues.newPassword}
                            onChange={handlePasswordChange}
                            className="border-gray-200 pr-10 focus:border-[#A61B1B] focus:ring-[#A61B1B]"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                          <Lock size={16} className="text-[#A61B1B]" />
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={passwordValues.confirmPassword}
                            onChange={handlePasswordChange}
                            className="border-gray-200 pr-10 focus:border-[#A61B1B] focus:ring-[#A61B1B]"
                            required
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1 mt-2">
                        <p className="flex items-center gap-1">
                          <CheckCircle
                            size={12}
                            className={passwordValues.newPassword.length >= 8 ? "text-green-500" : "text-gray-400"}
                          />
                          At least 8 characters long
                        </p>
                        <p className="flex items-center gap-1">
                          <CheckCircle
                            size={12}
                            className={/[A-Z]/.test(passwordValues.newPassword) ? "text-green-500" : "text-gray-400"}
                          />
                          Contains at least one uppercase letter
                        </p>
                        <p className="flex items-center gap-1">
                          <CheckCircle
                            size={12}
                            className={/[0-9]/.test(passwordValues.newPassword) ? "text-green-500" : "text-gray-400"}
                          />
                          Contains at least one number
                        </p>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPasswordValues({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          })
                          setPasswordError("")
                        }}
                        className="border-gray-200"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#A61B1B] hover:bg-[#8A1717] text-white"
                        disabled={isPasswordLoading}
                      >
                        {isPasswordLoading ? "Changing..." : "Change Password"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>

                <Card className="border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield size={18} className="text-[#A61B1B]" />
                      Account Security
                    </CardTitle>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#A61B1B]/10 p-2 rounded-full">
                          <Lock className="h-5 w-5 text-[#A61B1B]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Two-factor authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <Switch className="data-[state=checked]:bg-[#A61B1B]" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#A61B1B]/10 p-2 rounded-full">
                          <Bell className="h-5 w-5 text-[#A61B1B]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Login notifications</p>
                          <p className="text-sm text-gray-500">Receive alerts when someone logs into your account</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-[#A61B1B]" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminProfilePage
