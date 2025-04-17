"use client";

interface QuestionProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export default function QuestionProgressBar({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: QuestionProgressBarProps) {
  const progressPercentage = Math.floor((answeredQuestions / totalQuestions) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>Progress</span>
        <span>{progressPercentage}% Complete</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{answeredQuestions} of {totalQuestions} answered</span>
        <span>Question {currentQuestion + 1} of {totalQuestions}</span>
      </div>
    </div>
  );
}