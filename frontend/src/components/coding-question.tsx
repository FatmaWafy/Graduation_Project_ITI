"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Editor, { loader } from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, XCircle } from "lucide-react";
import { useTheme } from "next-themes";

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
};

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

interface CodingQuestionProps {
  question: {
    id: string;
    title: string;
    description: string;
    starterCode: string;
    language: string;
    testCases: Array<{
      id: number;
      input_data: string;
      expected_output: string;
    }>;
  };
  onAnswerChange: (code: string) => void;
  answer: string;
}

export default function CodingQuestion({
  question,
  onAnswerChange,
  answer,
}: CodingQuestionProps) {
  const [activeTab, setActiveTab] = useState<string>("case1");
  const [testResults, setTestResults] = useState<
    Record<string, { status: string; output?: string; error?: string }>
  >({});
  const [runningStatus, setRunningStatus] = useState<Record<string, boolean>>(
    {}
  );
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [testScores, setTestScores] = useState<Record<string, number>>({});

  useEffect(() => {
    if (question.testCases && question.testCases.length > 0) {
      setActiveTab(`case1`);
    }
  }, [question.testCases]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onAnswerChange(value);
    }
  };

  const executeCode = async (language: string, sourceCode: string) => {
    try {
      const response = await API.post("/execute", {
        language: language,
        version: LANGUAGE_VERSIONS[language],
        files: [
          {
            content: sourceCode,
          },
        ],
      });
      return response.data;
    } catch (error) {
      console.error("Error executing code:", error);
      throw error;
    }
  };

  const submitToRunCodeAPI = async (data: {
    questionId: string;
    code: string;
    language: string;
    output?: string;
    error?: string;
    testCaseId?: number;
    input?: string;
    expectedOutput?: string;
    isSuccess?: boolean;
  }) => {
    try {
      const response = await axios.post("/api/run-code", {
        questionId: data.questionId,
        code: data.code,
        language: data.language,
        output: data.output,
        error: data.error,
        testCaseId: data.testCaseId,
        input: data.input,
        expectedOutput: data.expectedOutput,
        isSuccess: data.isSuccess,
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting to run-code API:", error);
      throw error;
    }
  };

  const runCode = async () => {
    if (!answer) return;
    try {
      setIsLoading(true);
      const result = await executeCode(question.language.toLowerCase(), answer);
      const output = result.run.output;
      const error = result.run.stderr;

      setOutput(output.split("\n"));
      setIsError(error ? true : false);

      // Submit to our API
      await submitToRunCodeAPI({
        questionId: question.id,
        code: answer,
        language: question.language,
        output: output,
        error: error,
      });
    } catch (error) {
      setIsError(true);
      setOutput(["An error occurred while executing the code"]);
      console.error("Error executing code:", error);

      // Submit error to our API
      await submitToRunCodeAPI({
        questionId: question.id,
        code: answer,
        language: question.language,
        error: "An error occurred while executing the code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runTestCase = async (testCaseIndex: number) => {
    const tabKey = `case${testCaseIndex + 1}`;
    setRunningStatus((prev) => ({ ...prev, [tabKey]: true }));

    try {
      const testCase = question.testCases[testCaseIndex];

      const codeWithInput = getCodeWithInputHandling(
        answer,
        question.language.toLowerCase(),
        testCase.input_data
      );

      const result = await executeCode(
        question.language.toLowerCase(),
        codeWithInput
      );

      // Clean the output by:
      // 1. Trimming whitespace
      // 2. Removing any input echo if present
      // 3. Normalizing the format
      const rawOutput = result.run.output;
      let output = rawOutput.trim();

      // If output contains both input and result (common in some executions)
      // Split by newlines and take the last line
      const outputLines = output.split("\n");
      if (outputLines.length > 1) {
        output = outputLines[outputLines.length - 1].trim();
      }

      // Clean expected output
      const expectedOutput = testCase.expected_output.trim();

      // Compare the cleaned outputs
      const isSuccess = output === expectedOutput;

      const newTestResult = {
        [tabKey]: {
          status: isSuccess ? "success" : "error",
          output: output,
          error: isSuccess
            ? undefined
            : `Expected: ${expectedOutput}\nGot: ${output}\nInput: ${testCase.input_data}`,
        },
      };

      setTestResults((prev) => ({
        ...prev,
        ...newTestResult,
      }));

      // Submit test case results to our API
      await submitToRunCodeAPI({
        questionId: question.id,
        code: answer,
        language: question.language,
        testCaseId: testCase.id,
        input: testCase.input_data,
        expectedOutput: testCase.expected_output,
        output: output,
        error: isSuccess
          ? undefined
          : `Expected: ${expectedOutput}\nGot: ${output}`,
        isSuccess,
      });

      return newTestResult;
    } catch (error) {
      console.error("Error running test case:", error);
      const newTestResult = {
        [tabKey]: {
          status: "error",
          error: "An error occurred while running the test case.",
        },
      };
      setTestResults((prev) => ({
        ...prev,
        ...newTestResult,
      }));

      await submitToRunCodeAPI({
        questionId: question.id,
        code: answer,
        language: question.language,
        testCaseId: question.testCases[testCaseIndex].id,
        input: question.testCases[testCaseIndex].input_data,
        expectedOutput: question.testCases[testCaseIndex].expected_output,
        error: "An error occurred while running the test case.",
        isSuccess: false,
      });

      throw error;
    } finally {
      setRunningStatus((prev) => ({ ...prev, [tabKey]: false }));
    }
  };

  const runAllTestCases = async () => {
    if (!question.testCases || question.testCases.length === 0) return;

    try {
      setIsLoading(true);
      const results = await Promise.all(
        question.testCases.map((_, index) => runTestCase(index))
      );
      return results;
    } catch (error) {
      console.error("Error running all test cases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the code remains the same ...
  const getCodeWithInputHandling = (
    code: string,
    language: string,
    input: string,
    functionName: string = "flatten_list" // Add this parameter to know which function to test
  ) => {
    switch (
      language.toLowerCase() // Use lowercase for case-insensitive comparison
    ) {
      case "python":
        return `${code}\n\n# Test the function\nprint(${functionName}(${input}))`;
      case "javascript":
        return `${code}\n\n// Test the function\nconsole.log(${functionName}(${input}));`;
      case "java":
        // For Java, this would need more complex handling depending on the class structure
        return `${code}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(${functionName}(${input})));\n    }\n}`;
      case "cpp":
        return `${code}\n\nint main() {\n    auto result = ${functionName}(${input});\n    for (auto item : result) {\n        std::cout << item << " ";\n    }\n    return 0;\n}`;
      default:
        return code;
    }
  };
  const getLanguage = () => {
    const lang = question.language?.toLowerCase() || "python";
    const languageMap: Record<string, string> = {
      js: "javascript",
      py: "python",
      ts: "typescript",
      "c++": "cpp",
      "c#": "csharp",
    };
    return languageMap[lang] || lang;
  };

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
  };

  if (!Array.isArray(question.testCases)) {
    return <div>No test cases available</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-250px)] bg-background">
      <div className="w-full md:w-1/2 p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-border bg-background">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          {question.title}
        </h2>
        <div
          className="prose max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground"
          dangerouslySetInnerHTML={{ __html: question.description }}
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col bg-background">
        <div className="flex items-center justify-between p-2 border-b border-border bg-background">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2 text-foreground lowercase">
              {getLanguage()}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={runAllTestCases}
              disabled={isLoading}
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? "Running..." : "Run All Tests"}
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={runCode}
              disabled={isLoading}
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? "Running..." : "Run Code"}
            </Button>
          </div>
        </div>

        <div className="flex-grow">
          <Editor
            height="100%"
            defaultLanguage={getLanguage()}
            defaultValue={question.starterCode}
            value={answer}
            onChange={handleEditorChange}
            theme={editorTheme}
            options={editorOptions}
            loading={
              <div className="flex items-center justify-center h-full text-foreground">
                Loading editor...
              </div>
            }
          />
        </div>

        <div className="border-t border-border bg-background">
          <Tabs
            defaultValue="case1"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-muted">
              <TabsTrigger value="output">Output</TabsTrigger>
              {question.testCases.map((_, index) => {
                const tabKey = `case${index + 1}`;
                const result = testResults[tabKey];
                const score = testScores[tabKey];

                return (
                  <TabsTrigger
                    key={tabKey}
                    value={tabKey}
                    className={`
                      ${result?.status === "success" ? "text-green-500" : ""}
                      ${result?.status === "error" ? "text-red-500" : ""}
                    `}
                  >
                    Case {index + 1}
                    {score !== undefined && (
                      <span className="ml-1 text-xs">({score} pts)</span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="output">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2 text-foreground">
                  Output
                </h3>
                <div
                  className={`p-2 rounded-md font-mono text-sm min-h-[100px] ${
                    isError ? "bg-red-100 text-red-600" : "bg-muted"
                  }`}
                >
                  {output ? (
                    output.map((line, i) => (
                      <div key={i} className="whitespace-pre-wrap">
                        {line}
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground">
                      Click "Run Code" to see the output here
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {question.testCases.map((testCase, index) => {
              const tabKey = `case${index + 1}`;
              const result = testResults[tabKey];
              const score = testScores[tabKey];

              return (
                <TabsContent key={tabKey} value={tabKey}>
                  <div className="flex flex-col p-4 border-t border-border bg-background">
                    <div>
                      <h3 className="text-lg text-foreground">Test Input</h3>
                      <div
                        className="p-2 bg-muted rounded-md text-foreground font-mono"
                        dangerouslySetInnerHTML={{
                          __html: testCase.input_data,
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg text-foreground mt-2">
                        Expected Output
                      </h3>
                      <div
                        className="p-2 bg-muted rounded-md text-foreground font-mono"
                        dangerouslySetInnerHTML={{
                          __html: testCase.expected_output,
                        }}
                      />
                    </div>

                    <div className="mt-4">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => runTestCase(index)}
                        disabled={runningStatus[tabKey]}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {runningStatus[tabKey] ? "Running..." : "Run Test"}
                      </Button>
                      {score !== undefined && (
                        <div className="mt-2 text-sm text-foreground">
                          Score: {score} points
                        </div>
                      )}
                      {result?.status === "success" && (
                        <div className="flex items-center text-green-500 mt-2">
                          <CheckCircle2 className="mr-2" />
                          Passed
                        </div>
                      )}
                      {result?.status === "error" && (
                        <div className="flex items-center text-red-500 mt-2">
                          <XCircle className="mr-2" />
                          Failed
                        </div>
                      )}
                      {result?.error && (
                        <div className="mt-2 text-red-500 font-mono whitespace-pre-wrap">
                          {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
