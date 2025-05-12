// "use client";
// import React, { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";
// import axios from "axios";

// const AdminProfilePage = () => {
//   const [adminData, setAdminData] = useState<any>({});
//   const [profileImage, setProfileImage] = useState<File | null>(null);

//   useEffect(() => {
//     const token = Cookies.get("token");
//     if (token) {
//       const decoded: any = jwtDecode(token);
//       const userId = decoded.user_id;

//       axios
//         .get("http://127.0.0.1:8000/users/current-admin/", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           setAdminData(res.data);
//         })
//         .catch((err) => console.error(err));
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const token = Cookies.get("token");
//     if (!token) return;

//     const decoded: any = jwtDecode(token);
//     const userId = decoded.user_id;

//     const formData = new FormData();
//     formData.append("username", adminData.username);
//     formData.append("email", adminData.email);
//     formData.append("phone_number", adminData.phone_number || "");
//     if (profileImage) {
//       formData.append("profile_image", profileImage);
//     }

//     try {
//       await axios.patch(
//         `http://127.0.0.1:8000/users/update-admin-profile/${userId}/`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert("✅ تم تحديث البيانات بنجاح");
//     } catch (err) {
//       console.error(err);
//       alert("❌ فشل التحديث");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border">
//       <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">👩‍💼 ملف الأدمن</h2>
//       <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">اسم المستخدم</label>
//           <input
//             type="text"
//             value={adminData.username || ""}
//             onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
//             className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
//           <input
//             type="email"
//             value={adminData.email || ""}
//             onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
//             className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
//           <input
//             type="text"
//             value={adminData.phone_number || ""}
//             onChange={(e) => setAdminData({ ...adminData, phone_number: e.target.value })}
//             className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">تحديث الصورة</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => e.target.files && setProfileImage(e.target.files[0])}
//             className="mt-1 block w-full"
//           />
//         </div>

//         {adminData.profile_image && (
//           <div className="flex justify-center">
//             <img
//               src={adminData.profile_image}
//               alt="صورة الأدمن"
//               className="w-24 h-24 rounded-full object-cover shadow-md"
//             />
//           </div>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200"
//         >
//           💾 تحديث البيانات
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminProfilePage;

"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Phone, Upload, Save, Home } from "lucide-react"

const AdminProfilePage = () => {
    const [adminData, setAdminData] = useState<any>({})
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const token = Cookies.get("token")
        if (token) {
            const decoded: any = jwtDecode(token)
            const userId = decoded.user_id

            axios
                .get("http://127.0.0.1:8000/users/current-admin/", {
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
        formData.append("address", adminData.address || "")  // إضافة حقل العنوان



        try {
            await axios.patch(
                `http://127.0.0.1:8000/users/update-admin-profile/${userId}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            if (profileImage) {
                const imageFormData = new FormData()
                imageFormData.append("profile_image", profileImage)

                await axios.post(
                    `http://127.0.0.1:8000/users/upload-profile-image/${userId}/`,
                    imageFormData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                )
            }

            toast.success("Profile updated successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (err) {
            console.error(err)
            toast.error("Failed to update profile.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setIsLoading(false)
        }
    }

    const getInitials = (name: string) => {
        if (!name) return "AD"
        return name.substring(0, 2).toUpperCase()
    }

    return (
    <div className="min-h-screen bg-white py-12 px-6">
    <Card className="max-w-3xl mx-auto shadow-lg border-blue-200 mt-10">
        <CardHeader className="space-y-1 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Admin Profile</CardTitle>
            <CardDescription className="text-slate-100">Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 bg-blue-50 text-black"> {/* تم تغيير الخلفية الى bg-blue-50 */}
            <div className="flex justify-center mb-6">
                <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                    <AvatarImage
                        src={
                            profileImage
                                ? URL.createObjectURL(profileImage)
                                : adminData.profile_image || "/placeholder.svg"
                        }
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                        {getInitials(adminData.username)}
                    </AvatarFallback>
                </Avatar>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                            <User size={16} className="text-blue-500" />
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            value={adminData.username || ""}
                            onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                            className="border-slate-200 bg-white focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail size={16} className="text-blue-500" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={adminData.email || ""}
                            onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                            className="border-slate-200 bg-white focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                            <Home size={16} className="text-blue-500" />
                            Address
                        </Label>
                        <Input
                            id="address"
                            type="text"
                            value={adminData.address || ""}
                            onChange={(e) => setAdminData({ ...adminData, address: e.target.value })}
                            className="border-slate-200 bg-white focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                            <Phone size={16} className="text-blue-500" />
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            type="text"
                            value={adminData.phone_number || ""}
                            onChange={(e) => setAdminData({ ...adminData, phone_number: e.target.value })}
                            className="border-slate-200 bg-white focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="profile_image" className="text-sm font-medium flex items-center gap-2">
                            <Upload size={16} className="text-blue-500" />
                            Update Profile Image
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input
                                id="profile_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && setProfileImage(e.target.files[0])}
                                className="border-slate-200 bg-white focus:border-blue-500 file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2 hover:file:bg-blue-100"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                    disabled={isLoading}
                >
                    <Save size={16} className="mr-2" />
                    {isLoading ? "Updating..." : "Save Changes"}
                </Button>
            </form>
        </CardContent>
    </Card>
</div>

    )
}

export default AdminProfilePage
