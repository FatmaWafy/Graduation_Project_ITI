import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionId, testCaseId, input, expectedOutput, actualOutput, isSuccess, code } = body

    if (!questionId || testCaseId === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Forward the results to your Django backend
    const response = await fetch("http://127.0.0.1:8000/exam/submit-code-results/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward authorization if needed
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization") as string }
          : {}),
      },
      body: JSON.stringify({
        question_id: questionId,
        test_case_id: testCaseId,
        input,
        expected_output: expectedOutput,
        actual_output: actualOutput,
        is_success: isSuccess,
        code,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Django API error: ${errorText}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error submitting code results:", error)
    return NextResponse.json({ error: "Failed to submit code results" }, { status: 500 })
  }
}
