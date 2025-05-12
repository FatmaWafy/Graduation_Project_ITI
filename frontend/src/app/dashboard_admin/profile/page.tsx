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
import { toast } from "react-toastify"
import { User, Mail, Phone, Upload, Save, Home, Shield, Calendar, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState<any>({})
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

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
          console.log(res.data)
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
              {/* <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-[#A61B1B]" />
                <span className="text-gray-600">Joined: {formatDate(adminData.date_joined || "")}</span>
              </div> */}
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

              <TabsContent value="account">
                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-100 p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your account security settings and password</p>
                    <Button variant="outline" className="border-[#A61B1B]/20 text-[#A61B1B] hover:bg-[#A61B1B]/10">
                      Change Password
                    </Button>
                  </div>

                  <div className="rounded-lg border border-gray-100 p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline" className="border-[#A61B1B]/20 text-[#A61B1B] hover:bg-[#A61B1B]/10">
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="rounded-lg border border-gray-100 p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Account Preferences</h3>
                    <p className="text-sm text-gray-500 mb-4">Manage your notification and display preferences</p>
                    <Button variant="outline" className="border-[#A61B1B]/20 text-[#A61B1B] hover:bg-[#A61B1B]/10">
                      Manage Preferences
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminProfilePage
