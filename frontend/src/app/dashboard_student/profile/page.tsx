"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
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
import {
  Upload,
  Mail,
  Phone,
  MapPin,
  School,
  Building,
  Calendar,
  GraduationCap,
  Github,
  Code,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
interface StudentData {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    enrollment_date?: string;
    status?: string;
    notes?: string;
    profile_image?: string;
  };
  // track?: number;
  track_name?: string;
  university?: string | null;
  graduation_year?: string | null;
  college?: string | null;
  leetcode_profile?: string | null;
  github_profile?: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth(); // get the logged-in user data from context
  const { toast } = useToast();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    university: "",
    college: "",
    graduation_year: "",
    github_profile: "",
    leetcode_profile: "",
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
  const fetchStudentData = async () => {
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
        `http://127.0.0.1:8000/users/students/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch student profile");
      }

      const student = await res.json();
      setStudentData(student);
      updateFormStateFromStudentData(student);
      setProfileImage(student.user?.profile_image || null);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("User data from context:", user);

    fetchStudentData();
  }, [user]); // Add the user context as a dependency to trigger when user data changes

  const updateFormStateFromStudentData = (data: StudentData) => {
    setFormState({
      name: data.user.username || "",
      email: data.user.email || "",
      phone: data.user.phone || "",
      address: data.user.address || "",
      bio: data.user.notes || "",
      university: data.university || "",
      college: data.college || "",
      graduation_year: data.graduation_year || "",
      github_profile: data.github_profile || "",
      leetcode_profile: data.leetcode_profile || "",
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate passwords
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Simulate password change
    setTimeout(() => {
      alert("Password changed successfully!");
      setPasswordValues({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 500);
  };

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview URL for the image
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentData) return;

    setIsSubmitting(true);

    try {
      const token = getClientSideToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      console.log("Updating profile for student:", studentData);

      // Create the payload with the nested structure that matches your API
      const updatePayload = {
        id: studentData.id,
        user: {
          username: formState.name,
          email: formState.email,
          role: "student",
          phone: formState.phone || "",
          address: formState.address || "",
          notes: formState.bio || "",
        },
        university: formState.university || null,
        college: formState.college || null,
        graduation_year: formState.graduation_year || null,
        github_profile: formState.github_profile || null,
        leetcode_profile: formState.leetcode_profile || null,
      };

      console.log("Update payload:", updatePayload);

      const decoded = jwtDecode(token) as { user_id?: string };
      const userId = Number(decoded.user_id);

      // Use the same endpoint structure as in your instructor dashboard
      const response = await fetch(
        `http://127.0.0.1:8000/users/students/${userId}/update/`,
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
        console.error("Update error response:", errorText);
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      // If there's a new profile image, upload it separately
      if (imageFile) {
        const formData = new FormData();
        formData.append("profile_image", imageFile);

        console.log(
          "Uploading profile image for user ID:",
          studentData.user.id
        );
        const imageResponse = await fetch(
          `http://127.0.0.1:8000/users/upload-profile-image/${studentData.user.id}/`,
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
          console.error("Image upload error response:", errorText);
        }
      }

      await fetchStudentData(); // Refresh student data after updating

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
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
    return <Skeleton />; // يمكنك إضافة Skeleton أو Loader هنا أثناء تحميل البيانات
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!studentData) {
    return <div>No student data available</div>; // يمكن إضافة رسالة في حالة عدم وجود بيانات
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
          <p className='text-muted-foreground'>
            Manage your personal information and preferences
          </p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <Tabs defaultValue='info'>
        <TabsList>
          <TabsTrigger value='info'>Personal Info</TabsTrigger>
          <TabsTrigger value='academic'>Academic</TabsTrigger>
          <TabsTrigger value='preferences'>Preferences</TabsTrigger>
          <TabsTrigger value='account'>Password</TabsTrigger>
        </TabsList>

        <TabsContent value='info' className='space-y-4 pt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className='space-y-4'>
                <div className='flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0'>
                  <div className='relative'>
                    <Avatar className='h-24 w-24'>
                      <AvatarImage
                        src={profileImage || user?.avatar}
                        alt={studentData?.user.username}
                      />
                      <AvatarFallback>
                        {studentData?.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div
                        className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer'
                        onClick={triggerFileInput}
                      >
                        <Upload className='h-6 w-6 text-white' />
                        <input
                          type='file'
                          ref={fileInputRef}
                          className='hidden'
                          accept='image/*'
                          onChange={handleImageChange}
                        />
                      </div>
                    )}
                  </div>
                  <div className='flex-1'>
                    {isEditing && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={triggerFileInput}
                      >
                        Change Avatar
                      </Button>
                    )}
                  </div>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name</Label>
                    {isEditing ? (
                      <Input
                        id='name'
                        name='name'
                        value={formState.name}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.name}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    {isEditing ? (
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        value={formState.email}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.email}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone</Label>
                    {isEditing ? (
                      <Input
                        id='phone'
                        name='phone'
                        value={formState.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.phone || "Not provided"}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='address'>Address</Label>
                    {isEditing ? (
                      <Input
                        id='address'
                        name='address'
                        value={formState.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.address || "Not provided"}
                      </div>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='bio'>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id='bio'
                      name='bio'
                      value={formState.bio}
                      onChange={handleChange}
                      rows={4}
                    />
                  ) : (
                    <div className='p-2 border rounded-md bg-muted/20 min-h-[100px]'>
                      {formState.bio || "No bio provided"}
                    </div>
                  )}
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Mail className='h-5 w-5 text-muted-foreground' />
                  <span>{formState.email}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Phone className='h-5 w-5 text-muted-foreground' />
                  <span>{formState.phone || "Not provided"}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <MapPin className='h-5 w-5 text-muted-foreground' />
                  <span>{formState.address || "Not provided"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='academic' className='space-y-4 pt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>
                Your academic details and achievements
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='university'>University</Label>
                    {isEditing ? (
                      <Input
                        id='university'
                        name='university'
                        value={formState.university || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.university || "Not provided"}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='college'>College</Label>
                    {isEditing ? (
                      <Input
                        id='college'
                        name='college'
                        value={formState.college || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.college || "Not provided"}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='graduation_year'>Graduation Year</Label>
                    {isEditing ? (
                      <Input
                        id='graduation_year'
                        name='graduation_year'
                        value={formState.graduation_year || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.graduation_year || "Not provided"}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='track'>Track</Label>
                    <div className='p-2 border rounded-md bg-muted/20'>
                      {studentData?.track_name ||
                        `Track ${studentData?.track}` ||
                        "Not assigned"}
                    </div>
                  </div>
                </div>

                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='github_profile'>GitHub Profile</Label>
                    {isEditing ? (
                      <Input
                        id='github_profile'
                        name='github_profile'
                        value={formState.github_profile || ""}
                        onChange={handleChange}
                        placeholder='https://github.com/username'
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.github_profile ? (
                          <a
                            href={formState.github_profile}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary hover:underline flex items-center'
                          >
                            <Github className='h-4 w-4 mr-2' />
                            {formState.github_profile}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='leetcode_profile'>LeetCode Profile</Label>
                    {isEditing ? (
                      <Input
                        id='leetcode_profile'
                        name='leetcode_profile'
                        value={formState.leetcode_profile || ""}
                        onChange={handleChange}
                        placeholder='https://leetcode.com/username'
                      />
                    ) : (
                      <div className='p-2 border rounded-md bg-muted/20'>
                        {formState.leetcode_profile ? (
                          <a
                            href={formState.leetcode_profile}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary hover:underline flex items-center'
                          >
                            <Code className='h-4 w-4 mr-2' />
                            {formState.leetcode_profile}
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              {isEditing && (
                <CardFooter>
                  <Button type='submit' disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Summary</CardTitle>
              <CardDescription>
                Your academic status and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <School className='h-5 w-5 text-muted-foreground' />
                  <span>
                    University: {formState.university || "Not provided"}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <Building className='h-5 w-5 text-muted-foreground' />
                  <span>College: {formState.college || "Not provided"}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <Calendar className='h-5 w-5 text-muted-foreground' />
                  <span>
                    Graduation Year:{" "}
                    {formState.graduation_year || "Not provided"}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <GraduationCap className='h-5 w-5 text-muted-foreground' />
                  <span>
                    Track:{" "}
                    {studentData?.track_name ||
                      `Track ${studentData?.track}` ||
                      "Not assigned"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='preferences' className='space-y-4 pt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='email-notifications'
                    className='h-4 w-4 rounded border-gray-300'
                    defaultChecked
                  />
                  <Label htmlFor='email-notifications'>
                    Email Notifications
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='sms-notifications'
                    className='h-4 w-4 rounded border-gray-300'
                    defaultChecked
                  />
                  <Label htmlFor='sms-notifications'>SMS Notifications</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='assignment-reminders'
                    className='h-4 w-4 rounded border-gray-300'
                    defaultChecked
                  />
                  <Label htmlFor='assignment-reminders'>
                    Assignment Reminders
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='grade-updates'
                    className='h-4 w-4 rounded border-gray-300'
                    defaultChecked
                  />
                  <Label htmlFor='grade-updates'>Grade Updates</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='account' className='space-y-4 pt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='currentPassword'>Current Password</Label>
                  <div className='relative'>
                    <Input
                      id='currentPassword'
                      name='currentPassword'
                      type={showPassword ? "text" : "password"}
                      value={passwordValues.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full px-3'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                      <span className='sr-only'>
                        Toggle password visibility
                      </span>
                    </Button>
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='newPassword'>New Password</Label>
                  <div className='relative'>
                    <Input
                      id='newPassword'
                      name='newPassword'
                      type={showPassword ? "text" : "password"}
                      value={passwordValues.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                  <div className='relative'>
                    <Input
                      id='confirmPassword'
                      name='confirmPassword'
                      type={showPassword ? "text" : "password"}
                      value={passwordValues.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type='submit'>Change Password</Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Lock className='h-4 w-4 text-muted-foreground' />
                  <span>Two-factor authentication</span>
                </div>
                <Switch />
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Lock className='h-4 w-4 text-muted-foreground' />
                  <span>Login notifications</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className='space-y-6'>
      <div>
        <Skeleton className='h-10 w-64 mb-2' />
        <Skeleton className='h-4 w-48' />
      </div>

      <div className='flex space-x-2'>
        <Skeleton className='h-10 w-24' />
        <Skeleton className='h-10 w-24' />
        <Skeleton className='h-10 w-24' />
      </div>

      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-48 mb-2' />
            <Skeleton className='h-4 w-32' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-24 w-24 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-48' />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-10 w-full' />
              </div>
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-24 w-full' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}