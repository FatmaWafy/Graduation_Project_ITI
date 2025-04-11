import { type NextRequest, NextResponse } from "next/server"

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  python: "3.10.0",
  java: "15.0.2",
  cpp: "10.2.0",
  csharp: "6.12.0",
  php: "8.2.0",
  ruby: "3.2.0",
  go: "1.18.0",
  rust: "1.68.0",
  typescript: "5.0.3",
}

// This is a proxy to the Piston API for code execution
// In production, you might want to use a more secure solution
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { language, code, testCases } = body

    if (!language || !code || !testCases) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process each test case
    const results = await Promise.all(
      testCases.map(async (testCase: any) => {
        const { id, input_data, expected_output } = testCase

        // Prepare code with input handling based on language
        const codeWithInput = getCodeWithInputHandling(code, language.toLowerCase(), input_data)

        // Execute code using Piston API
        const executionResult = await executeCode(language.toLowerCase(), codeWithInput)

        const output = executionResult.run.output.trim()
        const expectedOutput = expected_output.trim()
        const isSuccess = output === expectedOutput

        return {
          testCaseId: id,
          output,
          expected: expectedOutput,
          isSuccess,
          error: executionResult.run.stderr || null,
        }
      }),
    )

    // Calculate score based on test results
    const totalTests = results.length
    const passedTests = results.filter((r) => r.isSuccess).length
    const score = Math.round((passedTests / totalTests) * 100)

    return NextResponse.json({
      results,
      score,
      allPassed: passedTests === totalTests,
    })
  } catch (error) {
    console.error("Error executing code:", error)
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 })
  }
}

async function executeCode(language: string, sourceCode: string) {
  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        version: LANGUAGE_VERSIONS[language as keyof typeof LANGUAGE_VERSIONS],
        files: [
          {
            content: sourceCode,
          },
        ],
      }),
    })
    console.log("Response from Piston API:", response)

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error executing code:", error)
    throw error
  }
}

function getCodeWithInputHandling(code: string, language: string, input: string) {
  switch (language) {
    case "python":
      return `${code}\n\n# Test input\nprint(${input})`
    case "javascript":
      return `${code}\n\n// Test input\nconsole.log(${input});`
    case "java":
      return `${code}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(${input});\n    }\n}`
    case "cpp":
      return `${code}\n\nint main() {\n    std::cout << ${input} << std::endl;\n    return 0;\n}`
    default:
      return code
  }
}
