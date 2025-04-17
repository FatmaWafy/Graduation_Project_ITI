"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Circle, Code, FileText } from "lucide-react";

interface QuestionNavigatorProps {
  questions: Array<{
    id: string;
    type: "multiple-choice" | "coding";
    title: string;
  }>;
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  answers: Record<string, string>;
}

export default function QuestionNavigator({
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  answers
}: QuestionNavigatorProps) {
  return (
    <div className="w-16 md:w-20 p-2 flex flex-col bg-muted/50 border border-border rounded-xl h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #bcbcbc;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
      <h3 className="text-center font-medium text-muted-foreground text-xs mb-4">Questions</h3>
      <div className="space-y-3">
        <TooltipProvider delayDuration={300}>
          {questions.map((question, index) => {
            const isAnswered = !!answers[question.id];
            const isCurrent = currentQuestionIndex === index;
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isCurrent ? "default" : "outline"}
                    size="icon"
                    className={`w-full h-12 rounded-xl relative ${
                      isCurrent 
                        ? "bg-primary text-primary-foreground" 
                        : isAnswered 
                          ? "bg-muted/80 border-green-400/50" 
                          : "bg-background"
                    }`}
                    onClick={() => onSelectQuestion(index)}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xs">{index + 1}</span>
                      {question.type === "coding" ? (
                        <Code className="h-3 w-3 mt-1" />
                      ) : (
                        <FileText className="h-3 w-3 mt-1" />
                      )}
                    </div>
                    {isAnswered && !isCurrent && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="h-3 w-3 text-green-500 fill-green-500" />
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                  <p className="font-medium">{question.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{question.type} Question</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
}
