/**
 * Helper function to construct proper image URLs that work in both development and production
 */
export function getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return ""
  
    // If the image path already starts with http(s), it's already a full URL
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath
    }
  
    const origin = process.env.NEXT_PUBLIC_API_URL || ""
  
    // Remove any duplicate slashes between origin and path
    let fullPath = ""
  
    // If the path starts with /media, ensure we don't duplicate the slash
    if (imagePath.startsWith("/")) {
      fullPath = `${origin}${imagePath}`
    } else {
      fullPath = `${origin}/${imagePath}`
    }
  
    // Log the constructed URL for debugging
    // console.log("Constructed image URL:", fullPath)
  
    return fullPath
  }
  