"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface CodingQuestionProps {
  question: {
    id: string
    title: string
    description: string
    starterCode: string
    testCases: Array<{
      input: string
      expected: string
    }>
    language: string
  }
  onAnswerChange: (code: string) => void
  answer: string
}

export default function CodingQuestion({ question, onAnswerChange, answer }: CodingQuestionProps) {
  const [activeTab, setActiveTab] = useState<string>("case1")
  const [testResults, setTestResults] = useState<Record<string, { status: string; output?: string; error?: string }>>(
    {},
  )
  const [isRunning, setIsRunning] = useState(false)

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onAnswerChange(value)
    }
  }

  const runTestCase = (testCaseIndex: number) => {
    setIsRunning(true)

    // In a real app, you would send the code to your Django backend for execution
    // This is a mock implementation
    setTimeout(() => {
      const testCase = question.testCases[testCaseIndex]
      const tabKey = `case${testCaseIndex + 1}`

      // Mock test execution - in reality, this would be done on the server
      try {
        // Simulate a successful test for demo purposes
        const success = Math.random() > 0.3 // 70% chance of success

        if (success) {
          setTestResults((prev) => ({
            ...prev,
            [tabKey]: {
              status: "success",
              output: testCase.expected,
            },
          }))
        } else {
          setTestResults((prev) => ({
            ...prev,
            [tabKey]: {
              status: "error",
              error: "Your solution produced an incorrect result.",
            },
          }))
        }
      } catch (error) {
        setTestResults((prev) => ({
          ...prev,
          [tabKey]: {
            status: "error",
            error: error instanceof Error ? error.message : "An unknown error occurred",
          },
        }))
      }

      setIsRunning(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-250px)]">
      {/* Question description panel */}
      <div className="w-full md:w-1/2 p-4 overflow-y-auto border-b md:border-b-0 md:border-r">
        <h2 className="text-xl font-bold mb-4">{question.title}</h2>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: question.description }} />
      </div>

      {/* Code editor panel */}
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{question.language}</span>
          </div>
          <Button
            size="sm"
            onClick={() => runTestCase(Number.parseInt(activeTab.replace("case", "")) - 1)}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>

        <div className="flex-grow">
          <Editor
            height="100%"
            defaultLanguage={question.language}
            value={answer}
            onChange={handleEditorChange}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              tabSize: 2,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="border-t">
          <Tabs defaultValue="case1" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between p-2 border-b">
              <TabsList>
                {question.testCases.map((_, index) => (
                  <TabsTrigger
                    key={`case${index + 1}`}
                    value={`case${index + 1}`}
                    className={`
                      ${testResults[`case${index + 1}`]?.status === "success" ? "text-green-500" : ""}
                      ${testResults[`case${index + 1}`]?.status === "error" ? "text-red-500" : ""}
                    `}
                  >
                    Case {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              <span className="text-xs text-gray-500">Test Result</span>
            </div>

            {question.testCases.map((testCase, index) => (
              <TabsContent key={`case${index + 1}`} value={`case${index + 1}`} className="p-4">
                <div className="mb-2">
                  <div className="text-sm font-medium mb-1">Input:</div>
                  <pre className="bg-gray-50 p-2 rounded text-sm">{testCase.input}</pre>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Expected Output:</div>
                  <pre className="bg-gray-50 p-2 rounded text-sm">{testCase.expected}</pre>
                </div>

                {testResults[`case${index + 1}`] && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1">Your Output:</div>
                    {testResults[`case${index + 1}`].status === "success" ? (
                      <pre className="bg-green-50 text-green-700 p-2 rounded text-sm">
                        {testResults[`case${index + 1}`].output}
                      </pre>
                    ) : (
                      <pre className="bg-red-50 text-red-700 p-2 rounded text-sm">
                        {testResults[`case${index + 1}`].error}
                      </pre>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

