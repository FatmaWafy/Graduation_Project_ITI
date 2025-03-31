// Helper functions for authentication

// Check if the user is authenticated
export function isAuthenticated(): boolean {
    if (typeof window === "undefined") {
      return false // Always return false on server-side
    }
  
    try {
      const token = localStorage.getItem("token")
      return !!token // Return true if token exists
    } catch (error) {
      console.error("Error checking authentication:", error)
      return false
    }
  }
  
  // Get the user's role
  export function getUserRole(): string | null {
    if (typeof window === "undefined") {
      return null
    }
  
    try {
      return localStorage.getItem("role")
    } catch (error) {
      console.error("Error getting user role:", error)
      return null
    }
  }
  
  // Get the user's data
  export function getUserData(): any {
    if (typeof window === "undefined") {
      return null
    }
  
    try {
      const userData = localStorage.getItem("user")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error getting user data:", error)
      return null
    }
  }
  
  // Log out the user
  export function logout(): void {
    if (typeof window === "undefined") {
      return
    }
  
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("refresh")
      localStorage.removeItem("role")
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }
  
  