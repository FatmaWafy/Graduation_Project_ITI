"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function AddExamPage() {
  const [questions, setQuestions] = useState([
    { type: "mcq", question: "", options: ["", "", "", ""], correctAnswers: [], code: "" },
  ]);
  const [duration, setDuration] = useState(60);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null); // التراك المحدد

  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/users/get-tracks/");
        const data = await response.json();
        console.log("Fetched data:", data); // عرض البيانات المستلمة من API
  
        // تحقق إذا كانت 'tracks' موجودة
        if (Array.isArray(data.tracks)) {
          setTracks(data.tracks); // إذا كانت tracks مصفوفة
        } else {
          console.error("Data is not in the expected format:", data);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
      }
    };
  
    fetchTracks();
  }, []);
  


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

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTrack) {
      alert("Please select a track for the exam.");
      return;
    }

    const examData = {
      title: "Sample Exam",
      duration: duration,
      track: selectedTrack,
      questions: questions.map((q) => ({
        type: q.type,
        question: q.question,
        options: q.options,
        correctAnswers: q.correctAnswers,
        code: q.code
      })),
    };

    const token = Cookies.get('token');

    try {
      const response = await fetch("http://127.0.0.1:8000/exam/create-exam/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(examData),
      });

      if (response.ok) {
        alert("Exam submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to submit exam: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">📝 Add Exam Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* إدخال المدة */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Exam Duration (in minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={1}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* إضافة Dropdown لاختيار التراك */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Select Track</label>
          <select
            value={selectedTrack || ""}
            onChange={(e) => setSelectedTrack(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            <option value="">Select Track</option>
            {tracks.map((track, index) => (
              <option key={index} value={track}>
                {track}
              </option>
            ))}
          </select>

        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 border rounded-lg shadow-md bg-gray-50 space-y-4">
            <div className="flex justify-between">
              <select
                className="select select-bordered w-full"
                value={q.type}
                onChange={(e) => handleTypeChange(qIndex, e.target.value as "mcq" | "code")}
              >
                <option value="mcq">Multiple Choice Question</option>
                <option value="code">Code Editor Question</option>
              </select>

              {/* زر الحذف */}
              <button
                type="button"
                onClick={() => handleDeleteQuestion(qIndex)}
                className="text-red-600 hover:text-red-800"
              >
                ❌
              </button>
            </div>

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
