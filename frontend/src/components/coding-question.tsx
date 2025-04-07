// "use client"

// import { useState } from "react"
// import Editor from "@monaco-editor/react"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Button } from "@/components/ui/button"
// import { Play } from "lucide-react"

// interface CodingQuestionProps {
//   question: {
//     id: string
//     title: string
//     description: string
//     starterCode: string
//     testCases: Array<{
//       input: string
//       expected: string
//     }>
//     language: string
//   }
//   onAnswerChange: (code: string) => void
//   answer: string
// }

// export default function CodingQuestion({ question, onAnswerChange, answer }: CodingQuestionProps) {
//   const [activeTab, setActiveTab] = useState<string>("case1")
//   const [testResults, setTestResults] = useState<Record<string, { status: string; output?: string; error?: string }>>(
//     {},
//   )
//   const [isRunning, setIsRunning] = useState(false)

//   const handleEditorChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       onAnswerChange(value)
//     }
//   }

//   const runTestCase = (testCaseIndex: number) => {
//     setIsRunning(true)

//     // In a real app, you would send the code to your Django backend for execution
//     // This is a mock implementation
//     setTimeout(() => {
//       const testCase = question.testCases[testCaseIndex]
//       const tabKey = `case${testCaseIndex + 1}`

//       // Mock test execution - in reality, this would be done on the server
//       try {
//         // Simulate a successful test for demo purposes
//         const success = Math.random() > 0.3 // 70% chance of success

//         if (success) {
//           setTestResults((prev) => ({
//             ...prev,
//             [tabKey]: {
//               status: "success",
//               output: testCase.expected,
//             },
//           }))
//         } else {
//           setTestResults((prev) => ({
//             ...prev,
//             [tabKey]: {
//               status: "error",
//               error: "Your solution produced an incorrect result.",
//             },
//           }))
//         }
//       } catch (error) {
//         setTestResults((prev) => ({
//           ...prev,
//           [tabKey]: {
//             status: "error",
//             error: error instanceof Error ? error.message : "An unknown error occurred",
//           },
//         }))
//       }

//       setIsRunning(false)
//     }, 1000)
//   }

//   return (
//     <div className="flex flex-col md:flex-row h-[calc(100vh-250px)]">
//       {/* Question description panel */}
//       <div className="w-full md:w-1/2 p-4 overflow-y-auto border-b md:border-b-0 md:border-r">
//         <h2 className="text-xl font-bold mb-4">{question.title}</h2>
//         <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: question.description }} />
//       </div>

//       {/* Code editor panel */}
//       <div className="w-full md:w-1/2 flex flex-col">
//         <div className="flex items-center justify-between p-2 border-b">
//           <div className="flex items-center">
//             <span className="text-sm font-medium mr-2">{question.language}</span>
//           </div>
//           <Button
//             size="sm"
//             onClick={() => runTestCase(Number.parseInt(activeTab.replace("case", "")) - 1)}
//             disabled={isRunning}
//           >
//             <Play className="h-4 w-4 mr-1" />
//             Run
//           </Button>
//         </div>

//         <div className="flex-grow">
//           <Editor
//             height="100%"
//             defaultLanguage={question.language}
//             value={answer}
//             onChange={handleEditorChange}
//             theme="vs-light"
//             options={{
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               fontSize: 14,
//               tabSize: 2,
//               automaticLayout: true,
//             }}
//           />
//         </div>

//         <div className="border-t">
//           <Tabs defaultValue="case1" value={activeTab} onValueChange={setActiveTab}>
//             <div className="flex items-center justify-between p-2 border-b">
//               <TabsList>
//                 {question.testCases.map((_, index) => (
//                   <TabsTrigger
//                     key={`case${index + 1}`}
//                     value={`case${index + 1}`}
//                     className={`
//                       ${testResults[`case${index + 1}`]?.status === "success" ? "text-green-500" : ""}
//                       ${testResults[`case${index + 1}`]?.status === "error" ? "text-red-500" : ""}
//                     `}
//                   >
//                     Case {index + 1}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>
//               <span className="text-xs text-gray-500">Test Result</span>
//             </div>

//             {question.testCases.map((testCase, index) => (
//               <TabsContent key={`case${index + 1}`} value={`case${index + 1}`} className="p-4">
//                 <div className="mb-2">
//                   <div className="text-sm font-medium mb-1">Input:</div>
//                   <pre className="bg-gray-50 p-2 rounded text-sm">{testCase.input}</pre>
//                 </div>

//                 <div>
//                   <div className="text-sm font-medium mb-1">Expected Output:</div>
//                   <pre className="bg-gray-50 p-2 rounded text-sm">{testCase.expected}</pre>
//                 </div>

//                 {testResults[`case${index + 1}`] && (
//                   <div className="mt-4">
//                     <div className="text-sm font-medium mb-1">Your Output:</div>
//                     {testResults[`case${index + 1}`].status === "success" ? (
//                       <pre className="bg-green-50 text-green-700 p-2 rounded text-sm">
//                         {testResults[`case${index + 1}`].output}
//                       </pre>
//                     ) : (
//                       <pre className="bg-red-50 text-red-700 p-2 rounded text-sm">
//                         {testResults[`case${index + 1}`].error}
//                       </pre>
//                     )}
//                   </div>
//                 )}
//               </TabsContent>
//             ))}
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   )
// }

 
"use client"

import { useState, useEffect } from "react"
import Editor, { loader } from "@monaco-editor/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useTheme } from "next-themes"

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
  const { theme } = useTheme()
  const [editorTheme, setEditorTheme] = useState("vs-dark")

  // Set up Monaco editor with custom themes
  useEffect(() => {
    loader.init().then((monaco) => {
      // Define custom VS Code dark theme
      monaco.editor.defineTheme("custom-vs-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "569cd6" }, // def, class
          { token: "type", foreground: "4ec9b0" }, // List, int
          { token: "string", foreground: "ce9178" }, // """
          { token: "comment", foreground: "6A9955" }, // comments
          { token: "number", foreground: "b5cea8" }, // numbers
          { token: "delimiter", foreground: "d4d4d4" }, // brackets, commas
          { token: "annotation", foreground: "dcdcaa" }, // :type, :rtype
          { token: "identifier", foreground: "9cdcfe" }, // variable names
          { token: "operator", foreground: "d4d4d4" }, // operators
        ],
        colors: {
          "editor.background": "#1e1e1e",
          "editor.foreground": "#d4d4d4",
          "editorLineNumber.foreground": "#858585",
          "editorCursor.foreground": "#d4d4d4",
          "editor.selectionBackground": "#264f78",
          "editor.inactiveSelectionBackground": "#3a3d41",
          "editorWhitespace.foreground": "#3B3B3B",
        },
      })

      // Define custom VS Code light theme
      monaco.editor.defineTheme("custom-vs-light", {
        base: "vs",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "0000ff" }, // def, class
          { token: "type", foreground: "267f99" }, // List, int
          { token: "string", foreground: "a31515" }, // """
          { token: "comment", foreground: "008000" }, // comments
          { token: "number", foreground: "098658" }, // numbers
          { token: "delimiter", foreground: "000000" }, // brackets, commas
          { token: "annotation", foreground: "795e26" }, // :type, :rtype
          { token: "identifier", foreground: "001080" }, // variable names
          { token: "operator", foreground: "000000" }, // operators
        ],
        colors: {
          "editor.background": "#ffffff",
          "editor.foreground": "#000000",
          "editorLineNumber.foreground": "#237893",
          "editorCursor.foreground": "#000000",
          "editor.selectionBackground": "#add6ff",
          "editor.inactiveSelectionBackground": "#e5ebf1",
          "editorWhitespace.foreground": "#d3d3d3",
        },
      })

      // Update theme based on system preference
      setEditorTheme(theme === "dark" ? "custom-vs-dark" : "custom-vs-light")
    })
  }, [theme])

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

  // Get language from backend and normalize it
  const getLanguage = () => {
    // Monaco editor expects lowercase language identifiers
    const lang = question.language?.toLowerCase() || "python"

    // Map some common language names to Monaco's expected identifiers
    const languageMap: Record<string, string> = {
      js: "javascript",
      py: "python",
      ts: "typescript",
      "c++": "cpp",
      "c#": "csharp",
    }

    return languageMap[lang] || lang
  }

  // VS Code-like editor options
  const editorOptions = {
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    tabSize: 2,
    automaticLayout: true,
    lineNumbers: "on",
    scrollbar: {
      vertical: "visible",
      horizontal: "visible",
      useShadows: true,
      verticalHasArrows: false,
      horizontalHasArrows: false,
    },
    renderLineHighlight: "all",
    cursorBlinking: "blink",
    cursorSmoothCaretAnimation: "on",
    bracketPairColorization: { enabled: true },
    guides: {
      bracketPairs: true,
      indentation: true,
    },
    wordWrap: "on",
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    quickSuggestions: true,
    quickSuggestionsDelay: 100,
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-250px)] bg-background ">
      {/* Question description panel */}
      <div className="w-full md:w-1/2 p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-background">
        <h2 className="text-xl font-bold mb-4 text-foreground">{question.title}</h2>
        <div
          className="prose max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground"
          dangerouslySetInnerHTML={{ __html: question.description }}
        />
      </div>

      {/* Code editor panel - VS Code style */}
      <div className="w-full md:w-1/2 flex flex-col bg-background">
        <div className="flex items-center justify-between p-2 border-b border-border bg-background">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2 text-foreground lowercase">{question.language}</span>
          </div>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
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
            defaultLanguage={getLanguage()}
            value={answer}
            onChange={handleEditorChange}
            theme={editorTheme}
            options={editorOptions}
            className="monaco-editor"
            loading={<div className="flex items-center justify-center h-full text-foreground">Loading editor...</div>}
          />
        </div>

        <div className="border-t border-border bg-background">
          <Tabs defaultValue="case1" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between p-2 border-b border-border bg-background">
              <TabsList className="bg-muted">
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
              <span className="text-xs text-muted-foreground">Test Result</span>
            </div>

            {question.testCases.map((testCase, index) => (
              <TabsContent key={`case${index + 1}`} value={`case${index + 1}`} className="p-4 bg-background">
                <div className="mb-2">
                  <div className="text-sm font-medium mb-1 text-foreground">Input:</div>
                  <pre className="bg-muted p-2 rounded text-sm text-muted-foreground">{testCase.input}</pre>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1 text-foreground">Expected Output:</div>
                  <pre className="bg-muted p-2 rounded text-sm text-muted-foreground">{testCase.expected}</pre>
                </div>

                {testResults[`case${index + 1}`] && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-1 text-foreground">Your Output:</div>
                    {testResults[`case${index + 1}`].status === "success" ? (
                      <pre className="bg-green-950/20 text-green-500 p-2 rounded text-sm border border-green-900/30">
                        {testResults[`case${index + 1}`].output}
                      </pre>
                    ) : (
                      <pre className="bg-red-950/20 text-red-500 p-2 rounded text-sm border border-red-900/30">
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
