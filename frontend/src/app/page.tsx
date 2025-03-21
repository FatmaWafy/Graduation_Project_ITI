"use client"; // لو شغالة Next.js 13+ لازم تخليها كمكون client

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [tasks, setTasks] = useState([]); // لتخزين البيانات القادمة من Django
  const [error, setError] = useState(null); // لتخزين أي خطأ يحصل أثناء جلب البيانات

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tasks/") // تأكدي إن الـ API شغال
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data); // حفظ البيانات في state
      })
      .catch((error) => {
        setError(error.message); // تخزين أي خطأ
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">قائمة المهام</h1>
      {error && <p className="text-red-500">❌ {error}</p>} {/* عرض أي خطأ */}

      {tasks.length > 0 ? (
        <ul className="mt-4">
          {tasks.map((task: any) => (
            <li key={task.id} className="border p-2 my-2">
              {task.title} - {task.completed ? "✅ مكتمل" : "❌ غير مكتمل"}
            </li>
          ))}
        </ul>
      ) : (
        <p>⏳ جاري تحميل البيانات...</p>
      )}
    </div>
  );
}