"use client";

import { useState } from "react";

export default function AddExamPage() {
  const [questions, setQuestions] = useState([
    { type: "mcq", question: "", options: ["", "", "", ""], correctAnswers: [], code: "" },
  ]);

  const handleTypeChange = (index: number, type: "mcq" | "code") => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = type;
    updatedQuestions[index].question = "";
    updatedQuestions[index].options = ["", "", "", ""];
    updatedQuestions[index].correctAnswers = [];
    updatedQuestions[index].code = "";
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex: number, oIndex: number, isChecked: boolean, isMultiple: boolean) => {
    const updatedQuestions = [...questions];
    if (isMultiple) {
      if (isChecked) {
        updatedQuestions[qIndex].correctAnswers.push(oIndex);
      } else {
        updatedQuestions[qIndex].correctAnswers = updatedQuestions[qIndex].correctAnswers.filter((idx) => idx !== oIndex);
      }
    } else {
      updatedQuestions[qIndex].correctAnswers = [oIndex];
    }
    setQuestions(updatedQuestions);
  };

  const handleCodeChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].code = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { type: "mcq", question: "", options: ["", "", "", ""], correctAnswers: [], code: "" }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Exam Data:", questions);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">📝 Add Exam Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-lg shadow-md bg-gray-50 space-y-4">
            <select
              className="select select-bordered w-full"
              value={q.type}
              onChange={(e) => handleTypeChange(qIndex, e.target.value as "mcq" | "code")}
            >
              <option value="mcq">Multiple Choice Question</option>
              <option value="code">Code Editor Question</option>
            </select>
            
            <input
              type="text"
              placeholder="Enter the question"
              className="input input-bordered w-full"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              required
            />
            
            {q.type === "mcq" && (
              <div className="space-y-2">
                <label className="block font-medium">Select correct answer type:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-type-${qIndex}`}
                      onChange={() => handleCorrectAnswerChange(qIndex, -1, true, false)}
                      checked={q.correctAnswers.length === 1}
                    />
                    One Correct Answer
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-type-${qIndex}`}
                      onChange={() => handleCorrectAnswerChange(qIndex, -1, true, true)}
                      checked={q.correctAnswers.length > 1}
                    />
                    Multiple Correct Answers
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type={q.correctAnswers.length > 1 ? "checkbox" : "radio"}
                        name={`correct-${qIndex}`}
                        checked={q.correctAnswers.includes(oIndex)}
                        onChange={(e) => handleCorrectAnswerChange(qIndex, oIndex, e.target.checked, q.correctAnswers.length > 1)}
                      />
                      <input
                        type="text"
                        placeholder={`Option ${oIndex + 1}`}
                        className="input input-bordered w-full"
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {q.type === "code" && (
              <textarea
                placeholder="Enter the code question"
                className="textarea textarea-bordered w-full h-28"
                value={q.code}
                onChange={(e) => handleCodeChange(qIndex, e.target.value)}
              />
            )}
          </div>
        ))}
        
        <button type="button" onClick={addQuestion} className="btn btn-outline btn-primary w-full">
          ➕ Add Another Question
        </button>

        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-500 transition-all duration-300 shadow-md">Submit Exam</button>
      </form>
    </div>
  );
}
