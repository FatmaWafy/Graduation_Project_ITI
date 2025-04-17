// // "use client"

// // import { Button } from "@/components/ui/button"
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog"
// // import { Clock } from "lucide-react"

// // interface ExamHeaderProps {
// //   title: string
// //   timeLeft: string
// //   onSubmit: () => void
// //   isSubmitted?: boolean
// // }

// // export default function ExamHeader({ title, timeLeft, onSubmit, isSubmitted = false }: ExamHeaderProps) {
// //   const isTimeRunningOut = timeLeft.startsWith("00") && Number.parseInt(timeLeft.split(":")[1]) < 30

// //   return (
// //     <div className="bg-background p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center border border-border">
// //       <h1 className="text-2xl font-bold mb-4 md:mb-0 text-foreground">{title}</h1>

// //       <div className="flex items-center gap-4">
// //         <div className={`flex items-center gap-2 ${isTimeRunningOut ? "text-red-500" : "text-foreground"}`}>
// //           <Clock className="h-5 w-5" />
// //           <span className="text-lg font-mono">{timeLeft}</span>
// //         </div>

// //         <AlertDialog>
// //           <AlertDialogTrigger asChild>
// //             <Button variant="default" disabled={isSubmitted}>
// //               {isSubmitted ? "Submitted" : "Submit Exam"}
// //             </Button>
// //           </AlertDialogTrigger>
// //           <AlertDialogContent>
// //             <AlertDialogHeader>
// //               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
// //               <AlertDialogDescription>
// //                 Once submitted, you cannot return to the exam. Make sure you have answered all questions.
// //               </AlertDialogDescription>
// //             </AlertDialogHeader>
// //             <AlertDialogFooter>
// //               <AlertDialogCancel>Cancel</AlertDialogCancel>
// //               <AlertDialogAction onClick={onSubmit}>Submit</AlertDialogAction>
// //             </AlertDialogFooter>
// //           </AlertDialogContent>
// //         </AlertDialog>
// //       </div>
// //     </div>
// //   )
// // }

// "use client"

// import { Button } from "@/components/ui/button"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Clock } from "lucide-react"

// interface ExamHeaderProps {
//   title: string
//   timeLeft: string
//   onSubmit: () => void
//   isSubmitted?: boolean
// }

// export default function ExamHeader({ title, timeLeft, onSubmit, isSubmitted = false }: ExamHeaderProps) {
//   const isTimeRunningOut = timeLeft.startsWith("00") && Number.parseInt(timeLeft.split(":")[1]) < 30

//   return (
//     <div className="bg-background ps-4      rounded-lg mt-[-10px] flex flex-col md:flex-row justify-between items-center">
//       <h1 className="text-xl font-bold text-foreground">{title}</h1>

//       <div className="flex items-center gap-2">
//         <div className={`flex items-center gap-1 ${isTimeRunningOut ? "text-red-500" : "text-foreground"}`}>
//           <Clock className="h-4 w-4" />
//           <span className="text-base font-mono">{timeLeft}</span>
//         </div>

//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <Button variant="default" disabled={isSubmitted}>
//               {isSubmitted ? "Submitted" : "Submit Exam"}
//             </Button>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 Once submitted, you cannot return to the exam. Make sure you have answered all questions.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction onClick={onSubmit}>Submit</AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </div>
//   )
// }
"use client";

import { Button } from "@/components/ui/button";
import { FileCheck } from "lucide-react";
import TimeRemainingBadge from "./time-remaining-badge";

interface ExamHeaderProps {
  title: string;
  timeLeft: string;
  onSubmit: () => void;
  isSubmitted: boolean;
}

export default function ExamHeader({
  title,
  timeLeft,
  onSubmit,
  isSubmitted,
}: ExamHeaderProps) {
  return (
    <div className="bg-background border border-border shadow-sm rounded-xl p-4 flex flex-col md:flex-row items-center justify-between">
      <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-0">{title}</h1>
      
      <div className="flex items-center gap-4">
        <TimeRemainingBadge timeLeft={timeLeft} />
        
        <Button 
          onClick={onSubmit}
          disabled={isSubmitted}
          variant={isSubmitted ? "outline" : "default"}
          className={isSubmitted ? "border-green-500 text-green-600" : ""}
        >
          <FileCheck className="mr-2 h-4 w-4" />
          {isSubmitted ? "Submitted" : "Submit Exam"}
        </Button>
      </div>
    </div>
  );
}