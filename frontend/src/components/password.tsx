"use client";
import type React from "react";
import { useState } from "react";
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
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
const origin = process.env.NEXT_PUBLIC_API_URL;


export default function PasswordChangeSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

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
      const res = await axios.post(
        `${origin}/users/change-password/`,
        student_id: studentData.id,
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

  return (
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
                <span className="sr-only">Toggle password visibility</span>
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
  );
}
