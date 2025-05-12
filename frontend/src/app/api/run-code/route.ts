import { type NextRequest, NextResponse } from "next/server"
const origin = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // console.log("Received run-code request:", data)

    // Get the access token
    let token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      const cookieHeader = request.headers.get("cookie")
      token = cookieHeader?.match(/token=([^;]+)/)?.[1]
    }

    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 })
    }

    // Forward to Django backend
    const response = await fetch(`${origin}/exam/run-code/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question_id: data.questionId,
        code: data.code,
        language: data.language,
        output: data.output,
        error: data.error,
        test_case_id: data.testCaseId,
        input: data.input,
        expected_output: data.expectedOutput,
        is_success: data.isSuccess,
        points: data.points || 0, // Ensure points is included
      }),
    })

    // console.log("Points being sent:", data.points)

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
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}