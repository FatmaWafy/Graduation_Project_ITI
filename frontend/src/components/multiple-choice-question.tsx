"use client";

import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MultipleChoiceQuestionProps {
  question: {
    id: string;
    title: string;
    question: string;
    code?: string;
    options: Array<{
      id: string;
      text: string;
    }>;
  };
  onAnswerChange: (optionId: string) => void;
  selectedOption?: string;
  isFirstQuestion?: boolean;
  isLastQuestion?: boolean;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
}

export default function MultipleChoiceQuestion({
  question,
  onAnswerChange,
  selectedOption,
  isFirstQuestion,
  isLastQuestion,
  onNextQuestion,
  onPrevQuestion,
}: MultipleChoiceQuestionProps) {
  useEffect(() => {
    console.log("Question ID:", question.id, "Selected option:", selectedOption);
  }, [question.id, selectedOption]);

  return (
    <div className='p-6 bg-background text-foreground'>
      <h2 className='text-xl font-bold mb-4'>{question.title}</h2>
      <p className='mb-4'>{question.question}</p>

      {question.code && (
        <pre className='bg-muted p-4 rounded-md mb-6 overflow-x-auto text-muted-foreground'>
          <code>{question.code}</code>
        </pre>
      )}

      <RadioGroup
        key={question.id} // Force remount on question change
        value={selectedOption || ""} // Fallback to empty string
        onValueChange={onAnswerChange}
        className='space-y-3'
      >
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`
              flex items-center space-x-2 p-3 rounded-md border border-border 
              transition-all duration-200 
              ${
                selectedOption === option.id
                  ? "bg-gray-100 dark:bg-gray-800 border-primary/50"
                  : "hover:bg-muted"
              }
            `}
          >
            <RadioGroupItem
              value={option.id}
              id={`option-${option.id}`}
              className={selectedOption === option.id ? "border-primary" : ""}
            />
            <Label
              htmlFor={`option-${option.id}`}
              className={`
                flex-grow cursor-pointer 
                ${
                  selectedOption === option.id ? "text-primary font-medium" : ""
                }
              `}
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {(onNextQuestion || onPrevQuestion) && (
        <div className='flex justify-between pt-4 mt-6 border-t border-border'>
          <Button
            variant='outline'
            onClick={onPrevQuestion}
            disabled={isFirstQuestion || !onPrevQuestion}
            className='gap-1'
          >
            Previous
          </Button>
          <Button
            onClick={onNextQuestion}
            disabled={isLastQuestion || !onNextQuestion}
            className='gap-1'
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}