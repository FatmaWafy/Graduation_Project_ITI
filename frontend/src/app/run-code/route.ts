import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received run-code request:", data)

    // Get the access token from the request headers or cookies
    let token = request.headers.get("Authorization")?.split(" ")[1]

    // If no token in headers, try to get it from cookies
    if (!token) {
      const cookieHeader = request.headers.get("cookie")
      if (cookieHeader) {
        const tokenMatch = cookieHeader.match(/token=([^;]+)/)
        if (tokenMatch) {
          token = tokenMatch[1]
        }
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 })
    }

    // Forward the request to your Django backend
    const response = await fetch("http://127.0.0.1:8000/exam/run-code/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    // If the response is not OK, throw an error
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      return NextResponse.json(
        { error: `Backend server error: ${errorText || response.statusText}` },
        { status: response.status },
      )
    }

    // Get the response from the backend
    const responseData = await response.json()
    console.log("Backend response:", responseData)

    // Process the response to ensure it has the expected format
    const processedResults = responseData.results?.map((result: any) => ({
      ...result,
      // Ensure these fields exist
      passed: result.passed === true,
      actual_output: result.actual_output || "(No output)",
      error: result.error || null,
    }))

    // Return the processed response to the client
    return NextResponse.json(
      {
        ...responseData,
        results: processedResults || responseData.results,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in run-code API route:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
