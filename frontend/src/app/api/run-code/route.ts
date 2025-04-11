import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received run-code request:", data)

    // Get the access token
    let token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      const cookieHeader = request.headers.get("cookie")
      token = cookieHeader?.match(/token=([^;]+)/)?.[1]
    }

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" }, 
        { status: 401 }
      )
    }

    // Forward to Django backend
    const response = await fetch("http://127.0.0.1:8000/exam/run-code/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
        console.log("Response from Django backend:", response)
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      return NextResponse.json(
        { error: `Backend error: ${errorText || response.statusText}` },
        { status: response.status },
      )
    }

    const responseData = await response.json()
    
    // Process results for consistent format
    const processedResults = responseData.results?.map((result: any) => ({
      testCaseId: result.test_case_id,
      input: result.input,
      expectedOutput: result.expected_output,
      actualOutput: result.actual_output || "(No output)",
      isSuccess: result.is_success === true,
      score: result.score || 0,
      error: result.error || null,
    }))

    return NextResponse.json({
      results: processedResults || [],
      totalScore: responseData.total_score || 0,
      allPassed: responseData.all_passed === true,
    })

  } catch (error) {
    console.error("Error in run-code API route:", error)
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    )
  }
}