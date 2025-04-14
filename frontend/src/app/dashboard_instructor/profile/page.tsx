"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientSideToken } from "@/lib/cookies";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Mail, Phone, MapPin, Lock, Eye, EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InstructorData {
  address: string;
  phone_number: string;
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    phone_number?: string;
    address?: string;
    profile_image?: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [instructorData, setInstructorData] = useState<InstructorData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (instructorData?.user?.profile_image) {
      setProfileImage(null);

      const imageUrl = instructorData.user.profile_image.startsWith("http")
        ? `${instructorData.user.profile_image}?t=${Date.now()}`
        : `http://127.0.0.1:8000${
            instructorData.user.profile_image
          }?t=${Date.now()}`;
      setProfileImage(imageUrl);
    }
  }, [instructorData]);

  const fetchInstructorData = async () => {
    setLoading(true);
    try {
      const token = getClientSideToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const decoded = jwtDecode(token) as { user_id?: string };
      if (!decoded.user_id) {
        throw new Error("User ID not found in token");
      }

      const userId = Number(decoded.user_id);
      const res = await fetch(
        `http://127.0.0.1:8000/users/instructors/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch instructor profile");
      }

      const instructor = await res.json();
      setInstructorData(instructor);
      setFormState({
        name: instructor.user.username || "",
        email: instructor.user.email || "",
        phone: instructor.user.phone_number || "",
        address: instructor.user.address || "",
      });
    } catch (err) {
      console.error("Error fetching instructor data:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, [user]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    try {
      if (!instructorData) {
        alert("Instructor data not loaded");
        return;
      }

      const res = await axios.post(
        "http://localhost:8000/users/change-password/",
        {
          instructor_id: instructorData.id,
          currentPassword: passwordValues.currentPassword,
          newPassword: passwordValues.newPassword,
        }
      );

      alert("Password changed successfully!");
      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!instructorData) return;

    setIsSubmitting(true);

    try {
      const token = getClientSideToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const updatePayload = {
        id: instructorData.id,
        user: {
          username: formState.name,
          email: formState.email,
          role: "instructor",
          phone_number: formState.phone || "",
          address: formState.address || "",
        },
      };

      const decoded = jwtDecode(token) as { user_id?: string };
      const userId = Number(decoded.user_id);

      const response = await fetch(
        `http://127.0.0.1:8000/users/instructors/${userId}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("profile_image", imageFile);

        const imageResponse = await fetch(
          `http://127.0.0.1:8000/users/upload-profile-image/${instructorData.id}/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          throw new Error("Failed to upload profile image");
        }

        const updatedImageResponse = await fetch(
          `http://127.0.0.1:8000/users/students/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updatedImageResponse.ok) {
          const updatedData = await updatedImageResponse.json();
          const newImageUrl = updatedData.user?.profile_image?.startsWith(
            "http"
          )
            ? updatedData.user.profile_image
            : `http://127.0.0.1:8000${updatedData.user.profile_image}`;
          setProfileImage(newImageUrl);
        }
      }

      await fetchInstructorData();

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      setIsEditing(false);
    } catch (err) {
      toast({
        title: "Update failed",
        description:
          err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!instructorData) {
    return <div>No instructor data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="account">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profileImage || instructorData.user.profile_image}
                        alt={instructorData?.user.username}
                        onError={(e) => {
                          e.currentTarget.src = "";
                        }}
                      />
                      <AvatarFallback>
                        {instructorData?.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <Upload className="h-6 w-6 text-white" />
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={triggerFileInput}
                      >
                        Change Avatar
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/20">
                        {formState.name}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/20">
                        {formState.email}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/20">
                        {formState.phone || "Not provided"}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={formState.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="p-2 border rounded-md bg-muted/20">
                        {formState.address || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{formState.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{formState.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{formState.address || "Not provided"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordValues.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        Toggle password visibility
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordValues.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordValues.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Change Password</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
