"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Play,
  Code,
  Terminal,
} from "lucide-react";
import { useTheme } from "next-themes";
import axios from "axios";

// Runtime support mapping for Piston
const PISTON_LANGUAGE_RUNTIME = {
  python: "python3",
  javascript: "javascript",
  typescript: "typescript",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  php: "php",
  ruby: "ruby",
  go: "go",
  rust: "rust",
  sql: "sqlite",
  r: "r",
  perl: "perl",
  swift: "swift",
  shell: "bash",
  powershell: "powershell",
  lua: "lua",
  objectivec: "objectivec",
  yaml: "python3",
  markdown: "python3",
  html: "python3",
  css: "python3",
  scss: "python3",
  less: "python3",
  xml: "python3",
  json: "python3",
  razor: "csharp",
};

// Default versions for languages
const LANGUAGE_VERSIONS = {
  python3: "3.10.0",
  javascript: "18.15.0",
  typescript: "5.0.3",
  java: "15.0.2",
  cpp: "10.2.0",
  csharp: "6.12.0",
  php: "8.2.0",
  ruby: "3.2.0",
  go: "1.18.0",
  rust: "1.68.0",
  r: "4.2.0",
  perl: "5.36.0",
  swift: "5.8.0",
  lua: "5.4.4",
};

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

interface TestCaseResult {
  input: string;
  output: string;
  expectedOutput: string;
  isSuccess: boolean;
}

interface CodingQuestionProps {
  question: {
    id: string;
    type: "coding";
    title: string;
    description: string;
    starterCode: string;
    language: string;
    testCases: Array<{
      id: number;
      input_data: string;
      expected_output: string;
      function_name: string;
    }>;
  } | null;
  onAnswerChange: (code: string) => void;
  onTestResultsChange?: (questionId: string, results: TestCaseResult[]) => void;
  answer: string;
  questions: any[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  answers: Record<string, any>;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
}

export default function CodingQuestion({
  question,
  onAnswerChange,
  onTestResultsChange,
  answer,
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  answers,
  onNextQuestion,
  onPrevQuestion,
  isFirstQuestion,
  isLastQuestion,
}: CodingQuestionProps) {
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [activeTestTab, setActiveTestTab] = useState<string>("case1");
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
  const [editorTheme, setEditorTheme] = useState(
    theme === "dark" ? "vs-dark" : "light"
  );

  useEffect(() => {
    setEditorTheme(theme === "dark" ? "vs-dark" : "light");
  }, [theme]);

  useEffect(() => {
    setTestResults({});
    setRunningStatus({});
    setActiveTestTab("case1");
    setOutput(null);
    setIsError(false);
  }, [question?.id]);

  useEffect(() => {
    if (question?.testCases && question.testCases.length > 0) {
      setActiveTestTab(`case1`);
    }
  }, [question?.testCases]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onAnswerChange(value);
    }
  };

  // Helper function to format input for language-specific syntax
  const formatInputForLanguage = (input: string, language: string): string => {
    switch (language.toLowerCase()) {
      case "javascript":
      case "typescript":
        return input.includes(",") ? `${input}` : input;
      case "python":
        return input; // We'll handle Python input formatting in getCodeWithInputHandling
      case "java":
      case "cpp":
      case "c":
      case "csharp":
        return input;
      case "php":
      case "ruby":
      case "go":
      case "rust":
      case "swift":
      case "perl":
      case "lua":
      case "objectivec":
        return input;
      case "r":
        return input.includes(",") ? `c(${input})` : input;
      case "shell":
      case "powershell":
        return input;
      default:
        return input;
    }
  };

  const executeCode = async (
    language: string,
    sourceCode: string,
    input = ""
  ) => {
    try {
      // Special handling for SQLite
      if (language.toLowerCase() === "sql") {
        return await executeSQLite(sourceCode, input);
      }

      // For non-SQL languages, use the standard execution approach
      const runtime =
        PISTON_LANGUAGE_RUNTIME[language.toLowerCase()] ||
        language.toLowerCase();
      const version = LANGUAGE_VERSIONS[runtime] || "latest";

      if (!runtime) {
        throw new Error(`Unsupported language: ${language}`);
      }

      const payload = {
        language: runtime,
        version: version,
        files: [
          {
            content: sourceCode,
          },
        ],
      };

      // Log payload for debugging
      console.log("Executing payload:", payload);

      const response = await API.post("/execute", payload);
      return response.data;
    } catch (error: any) {
      console.error("Piston API error:", error.response?.data || error.message);
      throw error;
    }
  };

  // Special handler for SQLite execution
  const executeSQLite = async (sourceCode: string, input = "") => {
    try {
      // Create a wrapper script to execute SQLite commands
      const pythonWrapper = `
import sqlite3
import sys

# Create in-memory database
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# Execute the schema creation code
schema_sql = """${sourceCode}"""
try:
    cursor.executescript(schema_sql)
    conn.commit()
except sqlite3.Error as e:
    print(f"Schema error: {e}", file=sys.stderr)
    sys.exit(1)

# If input is provided (for non-test case scenarios), execute it
if """${input}""":
    try:
        cursor.executescript("""${input}""")
        conn.commit()
    except sqlite3.Error as e:
        print(f"Input error: {e}", file=sys.stderr)
        sys.exit(1)

# For SELECT statements in the schema, fetch and print all results
if "SELECT" in schema_sql.upper():
    try:
        # Split schema into statements and process all SELECT statements
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        output_lines = []
        for stmt in statements:
            if 'SELECT' in stmt.upper():
                rows = cursor.execute(stmt).fetchall()
                # Format each row as pipe-separated values
                for row in rows:
                    output_lines.append("|".join(str(col) for col in row))
        # Print each line with a newline separator
        if output_lines:
            for line in output_lines:
                print(line)
    except sqlite3.Error as e:
        print(f"Query error: {e}", file=sys.stderr)

conn.close()
`.trim();

      // Execute the Python wrapper with Piston
      const response = await API.post("/execute", {
        language: "python3",
        version: "3.10.0",
        files: [{ content: pythonWrapper }],
      });

      return response.data;
    } catch (error) {
      console.error("Error executing SQLite:", error);
      throw error;
    }
  };

  const runCode = async () => {
    if (!question || !answer) return;
    try {
      setIsLoading(true);
      setActiveTab("output");
      const result = await executeCode(question.language.toLowerCase(), answer);
      const output = result.run.output;
      const error = result.run.stderr;

      setOutput(output.split("\n"));
      setIsError(error ? true : false);

      // Show errors in the output if any
      if (error) {
        setOutput(
          output.split("\n").concat(["", "Error:", ...error.split("\n")])
        );
      }
    } catch (error) {
      setIsError(true);
      setOutput(["An error occurred while executing the code"]);
      console.error("Error executing code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const runTestCase = async (testCaseIndex: number) => {
    if (!question) return;
    const tabKey = `case${testCaseIndex + 1}`;
    setRunningStatus((prev) => ({ ...prev, [tabKey]: true }));
    setActiveTab("tests");

    try {
      const testCase = question.testCases[testCaseIndex];
      const isSQL = question.language.toLowerCase() === "sql";

      let codeToExecute;
      let inputData = "";

      if (isSQL) {
        // For SQL, use the special SQL execution
        codeToExecute = answer;
        inputData = testCase.input_data;
      } else {
        // For non-SQL languages, use the function wrapper approach from the old file
        const formattedInput = formatInputForLanguage(
          testCase.input_data,
          question.language.toLowerCase()
        );

        codeToExecute = getCodeWithInputHandling(
          answer,
          question.language.toLowerCase(),
          formattedInput,
          testCase.function_name
        );

        // Log for debugging
        console.log("Executing code:", codeToExecute);
      }

      // Execute the code
      const result = await executeCode(
        question.language.toLowerCase(),
        codeToExecute,
        inputData
      );

      // Extract the output
      const rawOutput = result.run.output;
      const errorOutput = result.run.stderr;
      const outputLines = rawOutput.split("\n");
      let output = rawOutput.trim();

      // For non-SQL languages, extract the last non-empty line if needed
      if (outputLines.length > 0 && !isSQL) {
        // Find the last non-empty line
        for (let i = outputLines.length - 1; i >= 0; i--) {
          if (outputLines[i].trim()) {
            output = outputLines[i].trim();
            break;
          }
        }
      }

      // If there's an error, log it for debugging
      if (errorOutput) {
        console.error("Execution error:", errorOutput);
      }

      // Compare with expected output
      const expectedOutput = testCase.expected_output.trim();
      const isSuccess = output === expectedOutput;

      // Update the test results
      const newTestResult = {
        [tabKey]: {
          status: isSuccess ? "success" : "error",
          output: output,
          error: isSuccess
            ? undefined
            : `Expected: ${expectedOutput}\nGot: ${output}\nInput: ${
                isSQL ? "N/A (SQL)" : testCase.input_data
              }`,
        },
      };

      setTestResults((prev) => ({
        ...prev,
        ...newTestResult,
      }));

      const testResult: TestCaseResult = {
        input: isSQL ? "N/A (SQL)" : testCase.input_data,
        output: output,
        expectedOutput: testCase.expected_output,
        isSuccess,
      };

      if (onTestResultsChange) {
        const allResults = question.testCases.map((_, idx) => {
          if (idx === testCaseIndex) {
            return testResult;
          }
          const tabKey = `case${idx + 1}`;
          const res = testResults[tabKey] || { status: "pending" };
          return {
            input: question.testCases[idx].input_data,
            output: res.output || "",
            expectedOutput: question.testCases[idx].expected_output,
            isSuccess: res.status === "success",
          };
        });
        onTestResultsChange(question.id, allResults);
      }

      return testResult;
    } catch (error: any) {
      console.error("Error running test case:", error);
      const newTestResult = {
        [tabKey]: {
          status: "error",
          error:
            error.response?.data?.message ||
            "An error occurred while running the test case.",
        },
      };
      setTestResults((prev) => ({
        ...prev,
        ...newTestResult,
      }));

      throw error;
    } finally {
      setRunningStatus((prev) => ({ ...prev, [tabKey]: false }));
    }
  };

  const runAllTestCases = async () => {
    if (!question || !question.testCases || question.testCases.length === 0)
      return;

    try {
      setIsLoading(true);
      setActiveTab("tests");
      const results: TestCaseResult[] = [];

      for (let index = 0; index < question.testCases.length; index++) {
        const result = await runTestCase(index);
        if (result) {
          results.push(result);
        }
      }

      if (onTestResultsChange) {
        onTestResultsChange(question.id, results);
      }

      return results;
    } catch (error) {
      console.error("Error running all test cases:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getCodeWithInputHandling = (
    code: string,
    language: string,
    input: string,
    functionName: string
  ) => {
    // For SQL, return the code as-is (handled by executeSQLite)
    if (language.toLowerCase() === "sql") {
      return code;
    }

    // For languages that support function-based testing
    switch (language.toLowerCase()) {
      case "python":
        // For Python, handle comma-separated inputs properly
        if (input.includes(",")) {
          // Split the input by comma and trim whitespace
          const args = input
            .split(",")
            .map((arg) => arg.trim())
            .join(", ");
          return `${code}\n\n# Test the function\nprint(${functionName}(${args}))`;
        } else {
          return `${code}\n\n# Test the function\nprint(${functionName}(${input}))`;
        }
      case "javascript":
      case "typescript":
        return `${code}\n\n// Test the function\nconsole.log(${functionName}(${input}));`;
      case "java":
        return `${code}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(${functionName}(${input}));\n    }\n}`;
      case "cpp":
        return `${code}\n\nint main() {\n    auto result = ${functionName}(${input});\n    std::cout << result;\n    return 0;\n}`;
      case "c":
        return `${code}\n\nint main() {\n    printf("%d\\n", ${functionName}(${input}));\n    return 0;\n}`;
      case "csharp":
        return `${code}\n\npublic class Program {\n    public static void Main() {\n        Console.WriteLine(${functionName}(${input}));\n    }\n}`;
      case "php":
        return `<?php\n${code}\n\n// Test the function\necho ${functionName}(${input});\n?>`;
      case "ruby":
        return `${code}\n\n# Test the function\nputs ${functionName}(${input})`;
      case "go":
        return `${code}\n\nfunc main() {\n    fmt.Println(${functionName}(${input}))\n}`;
      case "rust":
        return `${code}\n\nfn main() {\n    println!("{}", ${functionName}(${input}));\n}`;
      case "r":
        return `${code}\n\n# Test the function\nprint(${functionName}(${input}))`;
      case "swift":
        return `${code}\n\n// Test the function\nprint(${functionName}(${input}))`;
      case "perl":
        return `${code}\n\n# Test the function\nprint ${functionName}(${input});`;
      case "lua":
        return `${code}\n\n-- Test the function\nprint(${functionName}(${input}))`;
      case "objectivec":
        return `${code}\n\nint main() {\n    NSLog(@"%@", ${functionName}(${input}));\n    return 0;\n}`;
      case "shell":
      case "powershell":
        return `${code}\n\n# Test with input\necho "${input}" | ${
          language.toLowerCase() === "shell" ? "bash" : "powershell"
        }`;
      default:
        return code;
    }
  };

  const getLanguage = () => {
    // Simply return the language from the question directly
    return question?.language?.toLowerCase() || "python";
  };

  // This function is only for editor language mapping
  const getEditorLanguage = () => {
    const lang = question?.language?.toLowerCase() || "python";
    const languageMap: Record<string, string> = {
      js: "javascript",
      py: "python",
      ts: "typescript",
      "c++": "cpp",
      "c#": "csharp",
      "objective-c": "objectivec",
      bash: "shell",
      sh: "shell",
      md: "markdown",
      yml: "yaml",
      less: "less",
      scss: "scss",
      markup: "xml",
      razor: "razor",
    };
    return languageMap[lang] || lang;
  };

  const editorOptions: any = {
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    fontSize: 14,
    fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
    tabSize: 2,
    automaticLayout: true,
    lineNumbers: true,
    scrollbar: {
      vertical: "visible" as const,
      horizontal: "visible" as const,
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

  if (!question) {
    return (
      <div className="w-full flex flex-col justify-center items-center p-12 bg-muted/20">
        <Code className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          This question doesn't require coding
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col rounded-lg border border-border bg-background overflow-hidden">
      <div className="border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-4 py-2">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="editor" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>Editor</span>
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Test Cases</span>
              </TabsTrigger>
              <TabsTrigger value="output" className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span>Output</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={runAllTestCases}
                disabled={isLoading}
                className="gap-1"
              >
                <Play className="h-3.5 w-3.5" />
                {isLoading ? "Running..." : "Run Tests"}
              </Button>

              <Button
                size="sm"
                onClick={runCode}
                disabled={isLoading}
                className="gap-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="h-3.5 w-3.5" />
                {isLoading ? "Running..." : "Run Code"}
              </Button>
            </div>
          </div>

          <TabsContent value="editor" className="p-0 m-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 border-t border-b border-border">
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs font-medium">
                {getLanguage()}
              </div>
            </div>

            <div className="h-[calc(100vh-330px)] min-h-[400px]">
              <Editor
                height="100%"
                defaultLanguage={getEditorLanguage()}
                defaultValue={question.starterCode || ""}
                value={answer}
                onChange={handleEditorChange}
                theme={editorTheme}
                options={editorOptions}
                loading={
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Loading editor...
                  </div>
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="tests" className="p-0 m-0">
            <div className="bg-background min-h-[calc(100vh-330px)] max-h-[calc(100vh-330px)] overflow-y-auto">
              <Tabs
                value={activeTestTab}
                onValueChange={setActiveTestTab}
                className="w-full"
              >
                <div className="sticky top-0 z-10 bg-background flex justify-between items-center p-2 border-t border-b border-border">
                  <TabsList className="bg-muted/50">
                    {question.testCases.map((_, index) => {
                      const tabKey = `case${index + 1}`;
                      const result = testResults[tabKey];

                      return (
                        <TabsTrigger
                          key={tabKey}
                          value={tabKey}
                          className={`
                            px-4 py-1.5 text-sm font-medium flex items-center gap-1.5
                            ${activeTestTab === tabKey ? "bg-background" : ""}
                            ${
                              result?.status === "success"
                                ? "data-[state=active]:text-green-600 text-green-600"
                                : ""
                            }
                            ${
                              result?.status === "error"
                                ? "data-[state=active]:text-red-500 text-red-500"
                                : ""
                            }
                          `}
                        >
                          {result?.status === "success" && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                          {result?.status === "error" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          Case {index + 1}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      const index =
                        Number.parseInt(activeTestTab.replace("case", "")) - 1;
                      runTestCase(index);
                    }}
                    disabled={runningStatus[activeTestTab] || !question}
                  >
                    <Play className="h-3.5 w-3.5 mr-1" />
                    {runningStatus[activeTestTab] ? "Running..." : "Run Test"}
                  </Button>
                </div>

                {question.testCases.map((testCase, index) => {
                  const tabKey = `case${index + 1}`;
                  const result = testResults[tabKey];

                  return (
                    <TabsContent
                      key={tabKey}
                      value={tabKey}
                      className="p-4 min-h-[calc(100vh-390px)]"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/2">
                          <div className="mb-6">
                            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                              Test Input
                            </h3>
                            <div className="p-3 bg-muted/30 rounded-md text-foreground font-mono whitespace-pre-wrap text-sm border border-border">
                              {testCase.input_data}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-foreground mb-2">
                              Expected Output
                            </h3>
                            <div className="p-3 bg-muted/30 rounded-md text-foreground font-mono whitespace-pre-wrap text-sm border border-border">
                              {testCase.expected_output}
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col">
                          <h3 className="text-sm font-medium text-foreground mb-2">
                            Result
                          </h3>

                          {!result ? (
                            <div className="flex-1 flex items-center justify-center p-8 border border-dashed border-border rounded-md">
                              <p className="text-muted-foreground text-sm">
                                Run the test to see results
                              </p>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col border border-border rounded-md overflow-hidden">
                              <div
                                className={`px-4 py-2 flex items-center text-sm font-medium ${
                                  result.status === "success"
                                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                              >
                                {result.status === "success" ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Test Passed
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Test Failed
                                  </>
                                )}
                              </div>

                              <div className="p-3 bg-muted/30 font-mono text-sm flex-1 whitespace-pre-wrap">
                                {result.output && (
                                  <div className="mb-2">
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Your Output:
                                    </span>
                                    <div className="mt-1">{result.output}</div>
                                  </div>
                                )}

                                {result.error && (
                                  <div className="text-red-500 whitespace-pre-wrap">
                                    {result.error}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="output" className="p-0 m-0">
            <div className="p-4 min-h-[calc(100vh-330px)] max-h-[calc(100vh-330px)] overflow-y-auto">
              {output === null ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Run your code to see the output here.</p>
                </div>
              ) : (
                <div
                  className={`p-4 font-mono whitespace-pre-wrap rounded-md border ${
                    isError
                      ? "border-red-300 bg-red-50 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300"
                      : "border-border bg-muted/30 text-foreground"
                  }`}
                >
                  {output.map((line, index) => (
                    <div key={index} className="mb-1">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-between p-3 border-t border-border bg-muted/20">
        <Button
          variant="outline"
          onClick={onPrevQuestion}
          disabled={isFirstQuestion}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          onClick={onNextQuestion}
          disabled={isLastQuestion}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
