// "use client"

// import { CheckCircle, Circle } from "lucide-react"

// interface Question {
//   id: string
//   title: string
//   type: string
// }

// interface QuestionListProps {
//   questions: Question[]
//   currentIndex: number
//   onSelectQuestion: (index: number) => void
//   answers: Record<string, any>
// }

// export default function QuestionList({ questions, currentIndex, onSelectQuestion, answers }: QuestionListProps) {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold mb-4">Questions</h2>
//       <ul className="space-y-2">
//         {questions.map((question, index) => {
//           const isAnswered = !!answers[question.id]
//           const isCurrent = index === currentIndex

//           return (
//             <li
//               key={question.id}
//               className={`
//                 flex items-center justify-between p-2 rounded-md cursor-pointer
//                 ${isCurrent ? "bg-gray-100 font-medium" : "hover:bg-gray-50"}
//               `}
//               onClick={() => onSelectQuestion(index)}
//             >
//               <div className="flex items-center">
//                 <span className="mr-2 text-sm text-gray-500">{index + 1}.</span>
//                 <span className="truncate">{question.title}</span>
//               </div>
//               <div>
//                 {isAnswered ? (
//                   <CheckCircle className="h-4 w-4 text-green-500" />
//                 ) : (
//                   <Circle className="h-4 w-4 text-gray-300" />
//                 )}
//               </div>
//             </li>
//           )
//         })}
//       </ul>
//     </div>
//   )
// }

"use client"

import { CheckCircle, Circle } from "lucide-react"

interface Question {
  id: string
  title: string
  type: string
}

interface QuestionListProps {
  questions: Question[]
  currentIndex: number
  onSelectQuestion: (index: number) => void
  answers: Record<string, any>
}

export default function QuestionList({ questions, currentIndex, onSelectQuestion, answers }: QuestionListProps) {
  return (
    <div className="p-6 bg-background text-foreground">
      <h2 className="text-lg font-semibold mb-4">Questions</h2>
      <ul className="space-y-2">
        {questions.map((question, index) => {
          const isAnswered = !!answers[question.id]
          const isCurrent = index === currentIndex

          return (
            <li
              key={question.id}
              className={`
                flex items-center justify-between p-2 rounded-md cursor-pointer
                ${isCurrent ? "bg-muted font-medium" : "hover:bg-muted/50"}
              `}
              onClick={() => onSelectQuestion(index)}
            >
              <div className="flex items-center">
                <span className="mr-2 text-sm text-muted-foreground">{index + 1}.</span>
                <span className="truncate">{question.title}</span>
              </div>
              <div>
                {isAnswered ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

