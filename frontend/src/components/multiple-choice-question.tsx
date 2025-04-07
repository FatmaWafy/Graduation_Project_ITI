// "use client"

// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"

// interface MultipleChoiceQuestionProps {
//   question: {
//     id: string
//     title: string
//     question: string
//     code?: string
//     options: Array<{
//       id: string
//       text: string
//     }>
//   }
//   onAnswerChange: (optionId: string) => void
//   selectedOption?: string
// }

// export default function MultipleChoiceQuestion({
//   question,
//   onAnswerChange,
//   selectedOption,
// }: MultipleChoiceQuestionProps) {
//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">{question.title}</h2>
//       <p className="mb-4">{question.question}</p>

//       {question.code && (
//         <pre className="bg-gray-50 p-4 rounded-md mb-6 overflow-x-auto">
//           <code>{question.code}</code>
//         </pre>
//       )}

//       <RadioGroup value={selectedOption} onValueChange={onAnswerChange} className="space-y-3">
//         {question.options.map((option) => (
//           <div key={option.id} className="flex items-center space-x-2 p-3 rounded-md border hover:bg-gray-50">
//             <RadioGroupItem value={option.id} id={`option-${option.id}`} />
//             <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
//               {option.text}
//             </Label>
//           </div>
//         ))}
//       </RadioGroup>
//     </div>
//   )
// }

"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface MultipleChoiceQuestionProps {
  question: {
    id: string
    title: string
    question: string
    code?: string
    options: Array<{
      id: string
      text: string
    }>
  }
  onAnswerChange: (optionId: string) => void
  selectedOption?: string
}

export default function MultipleChoiceQuestion({
  question,
  onAnswerChange,
  selectedOption,
}: MultipleChoiceQuestionProps) {
  return (
    <div className="p-6 bg-background text-foreground">
      <h2 className="text-xl font-bold mb-4">{question.title}</h2>
      <p className="mb-4">{question.question}</p>

      {question.code && (
        <pre className="bg-muted p-4 rounded-md mb-6 overflow-x-auto text-muted-foreground">
          <code>{question.code}</code>
        </pre>
      )}

      <RadioGroup value={selectedOption} onValueChange={onAnswerChange} className="space-y-3">
        {question.options.map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-2 p-3 rounded-md border border-border hover:bg-muted"
          >
            <RadioGroupItem value={option.id} id={`option-${option.id}`} />
            <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

