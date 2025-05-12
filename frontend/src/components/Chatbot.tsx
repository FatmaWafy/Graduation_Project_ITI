"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface Question {
  id: number;
  question_text: string;
  answer_text: string;
  follow_ups?: Question[];
}

interface ChatbotData {
  role: string;
  questions: Question[];
  fallback_message: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatbotData, setChatbotData] = useState<ChatbotData | null>(null);
  const [messages, setMessages] = useState<
    { type: "bot" | "user"; text: string }[]
  >([]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [inputValue, setInputValue] = useState(""); // حالة جديدة لتخزين قيمة الـ input
  const origin = process.env.NEXT_PUBLIC_API_URL;

  // جلب بيانات الشات بوت بناءً على الدور
  useEffect(() => {
    const fetchChatbotData = async () => {
      try {
        const role = Cookies.get("role");
        const accessToken = Cookies.get("token");
        // console.log('Role from cookies:', role);
        // console.log('Access Token from cookies:', accessToken);

        if (!role || !accessToken) {
          console.error("Role or access token not found in cookies");
          return;
        }

        const response = await axios.get(`${origin}/chatbot/questions/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // console.log('Chatbot Data:', response.data);
        setChatbotData(response.data);
        setMessages([
          { type: "bot", text: "مرحبًا! اختر من القائمة أو اطرح سؤالك:" },
        ]);
      } catch (error) {
        console.error("Error fetching chatbot data:", error);
      }
    };
    fetchChatbotData();
  }, []);

  // التعامل مع اختيار سؤال من القائمة
  const handleQuestionClick = (question: Question) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: question.question_text },
      { type: "bot", text: question.answer_text },
    ]);
    setShowQuestions(false);
  };

  // التعامل مع إدخال المستخدم
  const handleInputSubmit = () => {
    if (!inputValue.trim()) return; // تجاهل الإدخال الفارغ

    const matchedQuestion = chatbotData?.questions.find((q) =>
      q.question_text.toLowerCase().includes(inputValue.toLowerCase())
    );

    setMessages((prev) => [
      ...prev,
      { type: "user", text: inputValue },
      matchedQuestion
        ? { type: "bot", text: matchedQuestion.answer_text }
        : {
            type: "bot",
            text:
              chatbotData?.fallback_message || "عذرًا، لم أفهم. اختر سؤالًا:",
          },
    ]);
    setInputValue(""); // تفريغ الـ input
    setShowQuestions(false);
  };

  // الأنماط الديناميكية بناءً على الدور
  const isStudent = Cookies.get("role") === "student";
  const chatbotStyles = isStudent
    ? {
        primary: "hsl(0, 75%, 40%)", // أحمر للطالب
        primaryForeground: "hsl(0, 0%, 98%)",
        secondary: "hsl(240, 4.8%, 95.9%)",
        secondaryForeground: "hsl(240, 5.9%, 10%)",
        muted: "hsl(240, 4.8%, 95.9%)",
        mutedForeground: "hsl(240, 3.8%, 46.1%)",
      }
    : {
        primary: "#007acc", // أزرق للمدرب
        primaryForeground: "#ffffff",
        secondary: "#e5e7eb",
        secondaryForeground: "#1f2937",
        muted: "#f3f4f6",
        mutedForeground: "#6b7280",
      };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* الزر العائم */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full p-4 shadow-lg transition-transform hover:scale-110"
          style={{
            backgroundColor: chatbotStyles.primary,
            color: chatbotStyles.primaryForeground,
          }}
        >
          💬
        </button>
      )}

      {/* نافذة الدردشة */}
      {isOpen && (
        <div
          className="w-80 sm:w-96 h-[500px] rounded-xl shadow-2xl flex flex-col border border-gray-200"
          style={{ backgroundColor: chatbotStyles.secondary }}
        >
          {/* الرأس */}
          <div
            className="p-4 rounded-t-xl flex justify-between items-center shadow-sm"
            style={{
              backgroundColor: chatbotStyles.primary,
              color: chatbotStyles.primaryForeground,
            }}
          >
            <h3 className="font-semibold text-lg">دعم الامتحانات</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* الرسائل */}
          <div
            className="flex-1 p-4 overflow-y-auto"
            style={{ backgroundColor: chatbotStyles.muted }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 ${
                  msg.type === "user" ? "text-right" : "text-left"
                } animate-fade-in`}
              >
                <span
                  className={`inline-block p-3 rounded-lg shadow-sm max-w-[80%] ${
                    msg.type === "user"
                      ? `text-white`
                      : "bg-white text-gray-800"
                  }`}
                  style={{
                    backgroundColor:
                      msg.type === "user" ? chatbotStyles.primary : undefined,
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {/* قائمة الأسئلة */}
            {chatbotData?.questions && showQuestions && (
              <div className="mt-4">
                <div
                  className="flex justify-between items-center p-3 rounded-t-lg cursor-pointer"
                  style={{
                    backgroundColor: chatbotStyles.primary,
                    color: chatbotStyles.primaryForeground,
                  }}
                  onClick={() => setShowQuestions(!showQuestions)}
                >
                  <span className="font-medium">اختر سؤالًا شائعًا</span>
                  {showQuestions ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
                {showQuestions && (
                  <div className="max-h-48 overflow-y-auto bg-white rounded-b-lg shadow-inner">
                    {chatbotData.questions.map((q) => (
                      <div
                        key={q.id}
                        className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => handleQuestionClick(q)}
                      >
                        <HelpCircle size={18} className="mr-2 text-gray-500" />
                        <span className="text-gray-800">{q.question_text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* زر لإعادة عرض الأسئلة */}
          {!showQuestions && (
            <div className="p-2 text-center">
              <button
                onClick={() => setShowQuestions(true)}
                className="text-sm underline"
                style={{ color: chatbotStyles.primary }}
              >
                عرض الأسئلة الشائعة مرة أخرى
              </button>
            </div>
          )}

          {/* حقل الإدخال */}
          <div
            className="p-4 border-t"
            style={{ borderColor: chatbotStyles.mutedForeground }}
          >
            <input
              type="text"
              placeholder="اكتب سؤالك..."
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: chatbotStyles.mutedForeground,
                color: chatbotStyles.secondaryForeground,
                focusRingColor: chatbotStyles.primary,
              }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleInputSubmit();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
