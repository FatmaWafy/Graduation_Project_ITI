"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeRemainingBadgeProps {
  timeLeft: string;
  className?: string;
}

export default function TimeRemainingBadge({ 
  timeLeft, 
  className 
}: TimeRemainingBadgeProps) {
  const [minutes, seconds] = timeLeft.split(':').map(Number);
  const isWarning = minutes === 0 && seconds < 300; // Less than 5 minutes
  const isDanger = minutes === 0 && seconds < 60; // Less than 1 minute
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300",
      isDanger 
        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse" 
        : isWarning 
          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" 
          : "bg-muted text-muted-foreground",
      className
    )}>
      {isDanger ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span className="font-mono font-medium">
        {timeLeft}
      </span>
    </div>
  );
}