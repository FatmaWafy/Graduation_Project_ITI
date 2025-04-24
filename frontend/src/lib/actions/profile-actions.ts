"use server"

import { getClientSideToken } from "@/lib/cookies"
const origin = process.env.NEXT_PUBLIC_API_URL;

export async function uploadProfileImage(userId: number, imageFile: File) {
  try {
    const token = getClientSideToken()
    if (!token) {
      throw new Error("Authentication token not found")
    }

    const formData = new FormData()
    formData.append("profile_image", imageFile)

    console.log(`Uploading profile image for user ID: ${userId}`)

    const response = await fetch(`${origin}/users/upload-profile-image/${userId}/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Don't set Content-Type header when using FormData
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Image upload error response:", errorText)
      throw new Error(`Failed to upload profile image: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error uploading profile image:", error)
    throw error
  }
}
