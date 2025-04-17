// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Editor from "@monaco-editor/react";
// import { Button } from "@/components/ui/button";
// import { Play, CheckCircle2, XCircle } from "lucide-react";
// import { useTheme } from "next-themes";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// const LANGUAGE_VERSIONS = {
//   javascript: "18.15.0",
//   python: "3.10.0",
//   java: "15.0.2",
//   cpp: "10.2.0",
//   csharp: "6.12.0",
//   php: "8.2.0",
//   ruby: "3.2.0",
//   go: "1.18.0",
//   rust: "1.68.0",
//   typescript: "5.0.3",
// };

// const API = axios.create({
//   baseURL: "https://emkc.org/api/v2/piston",
// });

// interface TestCaseResult {
//   input: string;
//   output: string;
//   expectedOutput: string;
//   isSuccess: boolean;
// }

// interface CodingQuestionProps {
//   question: {
//     id: string;
//     type: "coding";
//     title: string;
//     description: string;
//     starterCode: string;
//     language: string;
//     testCases: Array<{
//       id: number;
//       input_data: string;
//       expected_output: string;
//       function_name: string;
//     }>;
//   } | null;
//   onAnswerChange: (code: string) => void;
//   onTestResultsChange?: (questionId: string, results: TestCaseResult[]) => void;
//   answer: string;
//   questions: any[];
//   currentQuestionIndex: number;
//   onSelectQuestion: (index: number) => void;
//   answers: Record<string, any>;
//   onNextQuestion: () => void;
//   onPrevQuestion: () => void;
//   isFirstQuestion: boolean;
//   isLastQuestion: boolean;
// }

// export default function CodingQuestion({
//   question,
//   onAnswerChange,
//   onTestResultsChange,
//   answer,
//   questions,
//   currentQuestionIndex,
//   onSelectQuestion,
//   answers,
//   onNextQuestion,
//   onPrevQuestion,
//   isFirstQuestion,
//   isLastQuestion,
// }: CodingQuestionProps) {
//   const [activeTab, setActiveTab] = useState<string>("case1");
//   const [testResults, setTestResults] = useState<
//     Record<string, { status: string; output?: string; error?: string }>
//   >({});
//   const [runningStatus, setRunningStatus] = useState<Record<string, boolean>>(
//     {}
//   );
//   const [output, setOutput] = useState<string[] | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const { theme } = useTheme();
//   const [editorTheme, setEditorTheme] = useState("vs-dark");

//   useEffect(() => {
//     setTestResults({});
//     setRunningStatus({});
//     setActiveTab("case1");
//   }, [question?.id]);

//   useEffect(() => {
//     if (question?.testCases && question.testCases.length > 0) {
//       setActiveTab(`case1`);
//     }
//   }, [question?.testCases]);

//   const handleEditorChange = (value: string | undefined) => {
//     if (value !== undefined) {
//       onAnswerChange(value);
//     }
//   };

//   const executeCode = async (language: string, sourceCode: string) => {
//     try {
//       const response = await API.post("/execute", {
//         language: language,
//         version: LANGUAGE_VERSIONS[language],
//         files: [
//           {
//             content: sourceCode,
//           },
//         ],
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error executing code:", error);
//       throw error;
//     }
//   };

//   const runCode = async () => {
//     if (!question || !answer) return;
//     try {
//       setIsLoading(true);
//       const result = await executeCode(question.language.toLowerCase(), answer);
//       const output = result.run.output;
//       const error = result.run.stderr;

//       setOutput(output.split("\n"));
//       setIsError(error ? true : false);
//     } catch (error) {
//       setIsError(true);
//       setOutput(["An error occurred while executing the code"]);
//       console.error("Error executing code:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const runTestCase = async (testCaseIndex: number) => {
//     if (!question) return;
//     const tabKey = `case${testCaseIndex + 1}`;
//     setRunningStatus((prev) => ({ ...prev, [tabKey]: true }));

//     try {
//       const testCase = question.testCases[testCaseIndex];

//       const codeWithInput = getCodeWithInputHandling(
//         answer,
//         question.language.toLowerCase(),
//         testCase.input_data,
//         testCase.function_name
//       );

//       const result = await executeCode(
//         question.language.toLowerCase(),
//         codeWithInput
//       );

//       const rawOutput = result.run.output;
//       let output = rawOutput.trim();
//       const outputLines = output.split("\n");
//       if (outputLines.length > 1) {
//         output = outputLines[outputLines.length - 1].trim();
//       }

//       const expectedOutput = testCase.expected_output.trim();
//       const isSuccess = output === expectedOutput;

//       const newTestResult = {
//         [tabKey]: {
//           status: isSuccess ? "success" : "error",
//           output: output,
//           error: isSuccess
//             ? undefined
//             : `Expected: ${expectedOutput}\nGot: ${output}\nInput: ${testCase.input_data}`,
//         },
//       };

//       setTestResults((prev) => ({
//         ...prev,
//         ...newTestResult,
//       }));

//       const testResult: TestCaseResult = {
//         input: testCase.input_data,
//         output: output,
//         expectedOutput: testCase.expected_output,
//         isSuccess,
//       };

//       if (onTestResultsChange) {
//         const allResults = question.testCases.map((_, idx) => {
//           if (idx === testCaseIndex) {
//             return testResult;
//           }
//           const tabKey = `case${idx + 1}`;
//           const res = testResults[tabKey] || { status: "pending" };
//           return {
//             input: question.testCases[idx].input_data,
//             output: res.output || "",
//             expectedOutput: question.testCases[idx].expected_output,
//             isSuccess: res.status === "success",
//           };
//         });
//         onTestResultsChange(question.id, allResults);
//       }

//       return testResult;
//     } catch (error) {
//       console.error("Error running test case:", error);
//       const newTestResult = {
//         [tabKey]: {
//           status: "error",
//           error: "An error occurred while running the test case.",
//         },
//       };
//       setTestResults((prev) => ({
//         ...prev,
//         ...newTestResult,
//       }));

//       throw error;
//     } finally {
//       setRunningStatus((prev) => ({ ...prev, [tabKey]: false }));
//     }
//   };

//   const runAllTestCases = async () => {
//     if (!question || !question.testCases || question.testCases.length === 0) return;

//     try {
//       setIsLoading(true);
//       const results: TestCaseResult[] = [];

//       for (let index = 0; index < question.testCases.length; index++) {
//         const result = await runTestCase(index);
//         if (result) {
//           results.push(result);
//         }
//       }

//       if (onTestResultsChange) {
//         onTestResultsChange(question.id, results);
//       }

//       return results;
//     } catch (error) {
//       console.error("Error running all test cases:", error);
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getCodeWithInputHandling = (
//     code: string,
//     language: string,
//     input: string,
//     functionName: string
//   ) => {
//     switch (language.toLowerCase()) {
//       case "python":
//         return `${code}\n\n# Test the function\nprint(${functionName}(${input}))`;
//       case "javascript":
//         return `${code}\n\n// Test the function\nconsole.log(${functionName}(${input}));`;
//       case "java":
//         return `${code}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(${functionName}(${input}));\n    }\n}`;
//       case "cpp":
//         return `${code}\n\nint main() {\n    auto result = ${functionName}(${input});\n    std::cout << result;\n    return 0;\n}`;
//       default:
//         return code;
//     }
//   };

//   const getLanguage = () => {
//     const lang = question?.language?.toLowerCase() || "python";
//     const languageMap: Record<string, string> = {
//       js: "javascript",
//       py: "python",
//       ts: "typescript",
//       "c++": "cpp",
//       "c#": "csharp",
//     };
//     return languageMap[lang] || lang;
//   };

//   const editorOptions = {
//     minimap: { enabled: true },
//     scrollBeyondLastLine: false,
//     fontSize: 14,
//     fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
//     tabSize: 2,
//     automaticLayout: true,
//     lineNumbers: "on",
//     scrollbar: {
//       vertical: "visible",
//       horizontal: "visible",
//       useShadows: true,
//       verticalHasArrows: false,
//       horizontalHasArrows: false,
//     },
//     renderLineHighlight: "all",
//     cursorBlinking: "blink",
//     cursorSmoothCaretAnimation: "on",
//     bracketPairColorization: { enabled: true },
//     guides: {
//       bracketPairs: true,
//       indentation: true,
//     },
//     wordWrap: "on",
//     formatOnPaste: true,
//     formatOnType: true,
//     suggestOnTriggerCharacters: true,
//     acceptSuggestionOnEnter: "on",
//     quickSuggestions: true,
//     quickSuggestionsDelay: 100,
//   };

//   return (
//     <div className="w-full md:w-1/2 flex flex-col bg-background rounded-xl">
//       <div className="flex items-center justify-between p-2 border-b border-border bg-background  rounded-xl">
//         <div className="flex items-center">
//           <span className="text-sm font-medium mr-2 text-foreground lowercase">
//             {getLanguage()}
//           </span>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={runAllTestCases}
//             disabled={isLoading || !question}
//           >
//             <Play className="h-4 w-4 mr-1" />
//             {isLoading ? "Running..." : "Run All Tests"}
//           </Button>
//           <Button
//             size="sm"
//             className="bg-green-600 hover:bg-green-700 text-white"
//             onClick={runCode}
//             disabled={isLoading || !question}
//           >
//             <Play className="h-4 w-4 mr-1" />
//             {isLoading ? "Running..." : "Run Code"}
//           </Button>
//         </div>
//       </div>

//       <div className="flex flex-col flex-1">
//         <div className="flex-grow h-[65vh] min-h-[500px]">
//           <Editor
//             height="100%"
//             defaultLanguage={getLanguage()}
//             defaultValue={question?.starterCode || ""}
//             value={answer}
//             onChange={handleEditorChange}
//             theme={editorTheme}
//             options={editorOptions}
//             loading={
//               <div className="flex items-center justify-center h-full text-foreground">
//                 Loading editor...
//               </div>
//             }
//           />
//         </div>

//         {question && question.testCases && Array.isArray(question.testCases) && (
//           <div className="border-t border-border bg-background min-h-[200px] max-h-[300px] overflow-y-auto">
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <div className="flex justify-between items-center p-2">
//                 <TabsList className="bg-muted">
//                   {question.testCases.map((_, index) => {
//                     const tabKey = `case${index + 1}`;
//                     const result = testResults[tabKey];

//                     return (
//                       <TabsTrigger
//                         key={tabKey}
//                         value={tabKey}
//                         className={`
//                           px-4 py-2 rounded-md text-sm font-medium
//                           ${activeTab === tabKey ? "bg-white text-foreground" : "bg-muted text-foreground"}
//                           ${result?.status === "success" ? "text-green-500" : ""}
//                           ${result?.status === "error" ? "text-red-500" : ""}
//                           transition-all
//                         `}
//                       >
//                         Case {index + 1}
//                       </TabsTrigger>
//                     );
//                   })}
//                 </TabsList>
//                 <Button
//                   size="sm"
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                   onClick={() => {
//                     const index = parseInt(activeTab.replace("case", "")) - 1;
//                     runTestCase(index);
//                   }}
//                   disabled={runningStatus[activeTab] || !question}
//                 >
//                   <Play className="h-4 w-4 mr-1" />
//                   {runningStatus[activeTab] ? "Running..." : "Run"}
//                 </Button>
//               </div>

//               {question.testCases.map((testCase, index) => {
//                 const tabKey = `case${index + 1}`;
//                 const result = testResults[tabKey];

//                 return (
//                   <TabsContent
//                     key={tabKey}
//                     value={tabKey}
//                     className="p-4 border-t border-border bg-background"
//                   >
//                     <div className="flex">
//                       <div className="w-1/2 pr-4 border-r border-border">
//                         <div>
//                           <h3 className="text-lg text-foreground">Test Input</h3>
//                           <div
//                             className="p-2 bg-muted rounded-md text-foreground font-mono whitespace-pre-wrap"
//                             dangerouslySetInnerHTML={{
//                               __html: testCase.input_data,
//                             }}
//                           />
//                         </div>
//                         <div className="mt-4">
//                           <h3 className="text-lg text-foreground">Expected Output</h3>
//                           <div
//                             className="p-2 bg-muted rounded-md text-foreground font-mono whitespace-pre-wrap"
//                             dangerouslySetInnerHTML={{
//                               __html: testCase.expected_output,
//                             }}
//                           />
//                         </div>
//                       </div>

//                       <div className="w-1/2 pl-4 flex flex-col">
//                         {result?.status === "success" && (
//                           <div className="flex items-center text-green-500">
//                             <CheckCircle2 className="mr-2" />
//                             Passed
//                           </div>
//                         )}
//                         {result?.status === "error" && (
//                           <div className="flex items-center text-red-500">
//                             <XCircle className="mr-2" />
//                             Failed
//                           </div>
//                         )}
//                         {result?.error && (
//                           <div className="mt-2 text-red-500 font-mono whitespace-pre-wrap">
//                             {result.error}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </TabsContent>
//                 );
//               })}
//             </Tabs>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Play, Code, Terminal } from "lucide-react";
import { useTheme } from "next-themes";
import axios from "axios";

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
  const [runningStatus, setRunningStatus] = useState<Record<string, boolean>>({});
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState(theme === "dark" ? "vs-dark" : "light");

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

      const codeWithInput = getCodeWithInputHandling(
        answer,
        question.language.toLowerCase(),
        testCase.input_data,
        testCase.function_name
      );

      const result = await executeCode(
        question.language.toLowerCase(),
        codeWithInput
      );

      const rawOutput = result.run.output;
      let output = rawOutput.trim();
      const outputLines = output.split("\n");
      if (outputLines.length > 1) {
        output = outputLines[outputLines.length - 1].trim();
      }

      const expectedOutput = testCase.expected_output.trim();
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

      const testResult: TestCaseResult = {
        input: testCase.input_data,
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

      throw error;
    } finally {
      setRunningStatus((prev) => ({ ...prev, [tabKey]: false }));
    }
  };

  const runAllTestCases = async () => {
    if (!question || !question.testCases || question.testCases.length === 0) return;

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
    switch (language.toLowerCase()) {
      case "python":
        return `${code}\n\n# Test the function\nprint(${functionName}(${input}))`;
      case "javascript":
        return `${code}\n\n// Test the function\nconsole.log(${functionName}(${input}));`;
      case "java":
        return `${code}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(${functionName}(${input}));\n    }\n}`;
      case "cpp":
        return `${code}\n\nint main() {\n    auto result = ${functionName}(${input});\n    std::cout << result;\n    return 0;\n}`;
      default:
        return code;
    }
  };

  const getLanguage = () => {
    const lang = question?.language?.toLowerCase() || "python";
    const languageMap: Record<string, string> = {
      js: "javascript",
      py: "python",
      ts: "typescript",
      "c++": "cpp",
      "c#": "csharp",
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
      vertical: "visible" as "visible",
      horizontal: "visible" as "visible",
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
        <p className="text-muted-foreground">This question doesn't require coding</p>
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
                defaultLanguage={getLanguage()}
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
              <Tabs value={activeTestTab} onValueChange={setActiveTestTab} className="w-full">
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
                            ${result?.status === "success" ? "data-[state=active]:text-green-600 text-green-600" : ""}
                            ${result?.status === "error" ? "data-[state=active]:text-red-500 text-red-500" : ""}
                          `}
                        >
                          {result?.status === "success" && <CheckCircle2 className="h-3 w-3" />}
                          {result?.status === "error" && <XCircle className="h-3 w-3" />}
                          Case {index + 1}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      const index = parseInt(activeTestTab.replace("case", "")) - 1;
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
                            <div
                              className="p-3 bg-muted/30 rounded-md text-foreground font-mono whitespace-pre-wrap text-sm border border-border"
                            >
                              {testCase.input_data}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-foreground mb-2">
                              Expected Output
                            </h3>
                            <div
                              className="p-3 bg-muted/30 rounded-md text-foreground font-mono whitespace-pre-wrap text-sm border border-border"
                            >
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
                              <div className={`px-4 py-2 flex items-center text-sm font-medium ${
                                result.status === "success" 
                                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                  : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
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
                                    <span className="text-xs font-medium text-muted-foreground">Your Output:</span>
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
                <div className={`p-4 font-mono whitespace-pre-wrap rounded-md border ${
                  isError ? "border-red-300 bg-red-50 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300" : 
                  "border-border bg-muted/30 text-foreground"
                }`}>
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