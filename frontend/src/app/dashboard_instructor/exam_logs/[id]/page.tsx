"use client";
import { useEffect, useState, Suspense } from "react";
import { notFound } from "next/navigation";
import { ExamLogsHeader } from "../../../../components/exam-logs-header";
import { ExamLogsTable } from "../../../../components/exam-logs-table";
import { ExamLog } from "@/lib/types";
const origin = process.env.NEXT_PUBLIC_API_URL;

interface ExamLogsPageProps {
  params: Promise<{ id: string }>;
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token || "";
  }
  return "";
};

export default function ExamLogsPage({ params }: ExamLogsPageProps) {
  const [examId, setExamId] = useState<string | null>(null);

  useEffect(() => {
    params.then((param) => {
      const { id } = param;
      if (!id || isNaN(Number(id))) {
        notFound();
      } else {
        setExamId(id);
      }
    });
  }, [params]);

  if (!examId) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <ExamLogsHeader examId={examId} />
      <Suspense fallback={<ExamLogsTableSkeleton />}>
        <ExamLogsContent examId={examId} />
      </Suspense>
    </div>
  );
}

function ExamLogsContent({ examId }: { examId: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<ExamLog[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    setToken(token);

    if (token) {
      const fetchLogs = async () => {
        try {
          const res = await fetch(
            `${origin}/exam/exams/logs/${examId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          );

          // If status is 404, treat it as "no logs" rather than an error
          if (res.status === 404) {
            setLogs([]);
            return;
          }

          if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
          }

          const data = await res.json();
          setLogs(data);
        } catch (err: any) {
          console.error("Fetch logs error:", err.message);
          setError("Failed to fetch logs.");
        }
      };

      fetchLogs();
    }
  }, [examId]);

  if (!token) {
    return (
      <div className="mt-8 text-center p-8 bg-muted rounded-lg">
        <h3 className="text-xl font-medium">No token found</h3>
        <p className="text-muted-foreground mt-2">
          Please log in to view the logs.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center p-8 bg-destructive/10 rounded-lg">
        <h3 className="text-xl font-medium text-destructive">
          Error loading logs
        </h3>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  if (!logs) {
    return (
      <div className="mt-8 text-center text-muted-foreground">
        Loading logs...
      </div>
    );
  }

  if (error || (logs && logs.length === 0)) {
    return (
      <div className="mt-8 text-center p-8 bg-muted rounded-lg">
        <h3 className="text-xl font-medium">No logs found</h3>
        <p className="text-muted-foreground mt-2">
          There are no logs available for this exam.
        </p>
      </div>
    );
  }

  return <ExamLogsTable logs={logs} />;
}

function ExamLogsTableSkeleton() {
  return (
    <div className="mt-8 space-y-3">
      <div className="h-10 bg-muted rounded animate-pulse" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
