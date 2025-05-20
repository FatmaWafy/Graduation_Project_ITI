"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";
const origin = process.env.NEXT_PUBLIC_API_URL;

interface StudentMonitorProps {
  examId: string;
}

export default function StudentMonitor({ examId }: StudentMonitorProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Loading face detection system..."
  );
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [noFaceCount, setNoFaceCount] = useState(0);
  const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<number>(
    Date.now()
  );
  const [faceDetected, setFaceDetected] = useState(false);
  const [detectionInterval, setDetectionInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [lastAlertTime, setLastAlertTime] = useState<{ [key: string]: number }>(
    {}
  );
  const [consecutiveNoFaceDetections, setConsecutiveNoFaceDetections] =
    useState(0);
  // Utility to debounce alerts
  const showAlert = (message: string, type: "warn" | "error", id: string) => {
    const now = Date.now();
    const lastAlert = lastAlertTime[id] || 0;

    // Only show alert if 5 seconds have passed since last alert of this type
    if (now - lastAlert < 5000) return;

    setLastAlertTime((prev) => ({ ...prev, [id]: now }));

    const toastStyles = {
      warn: { backgroundColor: "#FF9800", color: "#FFFFFF" }, // Orange for warnings
      error: { backgroundColor: "#EF4444", color: "#FFFFFF" }, // Red for errors
    };

    toast[type](message, {
      toastId: id,
      style: toastStyles[type],
      autoClose: 3000,
    });
  };
  const EXAM_STATE_KEY = `exam_state_${examId}`;

  useEffect(() => {
    const preventDuplicate = (e: BeforeUnloadEvent) => {
      if (localStorage.getItem(EXAM_STATE_KEY) !== "active") {
        e.preventDefault();
        e.returnValue = "";
      }
      localStorage.setItem(EXAM_STATE_KEY, "terminated"); 
    };
    window.addEventListener("beforeunload", preventDuplicate);

    // نحدد إن الامتحان active في البداية
    localStorage.setItem(EXAM_STATE_KEY, "active");

    return () => {
      window.removeEventListener("beforeunload", preventDuplicate);
    };
  }, [examId]);

  useEffect(() => {
    const checkExamState = () => {
      const state = localStorage.getItem(EXAM_STATE_KEY);
      if (state === "terminated") {
        showAlert(
          "Exam is terminated. Please close this tab.",
          "error",
          "exam-terminated"
        );
        markExamAsViolated("Duplicate tab detected after termination");
      }
    };

    window.addEventListener("storage", checkExamState);

    checkExamState();

    return () => {
      window.removeEventListener("storage", checkExamState);
    };
  }, [examId]);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingMessage("Loading face detection models...");
        const MODEL_URL =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);

        setModelsLoaded(true);
        setLoadingMessage("Models loaded successfully, starting camera...");
      } catch (error) {
        console.error("Error loading face detection models:", error);
        setError(
          "Failed to load face detection models. Please refresh the page and try again."
        );
        setIsLoading(false);
        startSimpleMonitoring();
      }
    };

    loadModels();

    return () => {
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, []);

  // Start camera after models are loaded
  useEffect(() => {
    if (!modelsLoaded) return;

    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current
                .play()
                .then(() => {
                  setIsLoading(false);
                  setTimeout(() => startFaceDetection(), 1000);
                })
                .catch((err) => {
                  console.error("Error playing video:", err);
                  setError(
                    "Failed to start camera stream. Please ensure camera permissions are granted."
                  );
                  setIsLoading(false);
                });
            }
          };
        }
      } catch (error) {
        console.error("Error starting camera:", error);
        setError(
          "Failed to access camera. Please ensure camera permissions are granted."
        );
        setIsLoading(false);
      }
    };

    startVideoStream();
  }, [modelsLoaded]);

  // Fallback to simple camera monitoring
  const startSimpleMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                setIsLoading(false);
                setFaceDetected(true);

                const interval = setInterval(() => {
                  if (videoRef.current && videoRef.current.paused) {
                    logCheating("Video stream interrupted");
                  }
                }, 1000);

                setDetectionInterval(interval);
              })
              .catch((err) => {
                console.error("Error playing video:", err);
                setError(
                  "Failed to start camera stream. Please ensure camera permissions are granted."
                );
                setIsLoading(false);
              });
          }
        };
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      setError(
        "Failed to access camera. Please ensure camera permissions are granted."
      );
      setIsLoading(false);
    }
  };

  // Set up tab visibility monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        logCheating("User switched to a new tab or minimized the browser");
        showAlert(
          "Warning: Tab switching detected. Please stay on the exam page.",
          "warn",
          "tab-switch"
        );
        markExamAsViolated("Tab switching detected");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Set up copy prevention
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logCheating("User attempted to copy content");
      showAlert(
        "Warning: Copying content is prohibited during the exam.",
        "warn",
        "copy-attempt"
      );
      markExamAsViolated("Copy attempt detected");
    };

    document.addEventListener("copy", handleCopy as EventListener);
    return () =>
      document.removeEventListener("copy", handleCopy as EventListener);
  }, []);

  //handle Full screen Change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        showAlert(
          "Exam terminated due to exiting fullscreen mode.",
          "error",
          "fullscreen-exit-failure"
        );
        logCheating("Exam terminated due to exiting fullscreen mode");
        markExamAsViolated("Exit from fullscreen mode detected");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  //handle Focus Change
  useEffect(() => {
    const handleFocusChange = () => {
      if (document.hasFocus()) {
        console.log("App is in focus");
      } else {
        showAlert(
          "Warning: App lost focus. Please stay on the exam.",
          "warn",
          "focus-loss"
        );
        logCheating("App lost focus - possible split screen usage");
        markExamAsViolated("App lost focus detected");
      }
    };

    window.addEventListener("focus", handleFocusChange);
    window.addEventListener("blur", handleFocusChange);
    return () => {
      window.removeEventListener("focus", handleFocusChange);
      window.removeEventListener("blur", handleFocusChange);
    };
  }, []);

  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) {
      console.error(
        "Cannot start face detection - video, canvas or models not ready"
      );
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const displaySize = { width: canvas.width, height: canvas.height };
    faceapi.matchDimensions(canvas, displaySize);

    const interval = setInterval(async () => {
      if (video.paused || video.ended || !modelsLoaded) return;

      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          if (detections.length === 0) {
            setFaceDetected(false);
            setNoFaceCount((prevCount) => {
              const newCount = prevCount + 1;

              // Only log every 5th detection to reduce logs
              if (newCount % 5 === 0) {
                logCheating("No face detected");
              }

              return newCount;
            });

            // Increment consecutive no face detections counter
            setConsecutiveNoFaceDetections((prev) => {
              const newCount = prev + 1;

              // Show warning at 2 consecutive failures
              if (newCount === 5) {
                showAlert(
                  "Please ensure your face is visible in the camera frame.",
                  "warn",
                  "no-face-warning"
                );
              }

              if (newCount === 8) {
                showAlert(
                  "Face not detected! You will be removed from the exam if your face is not detected.",
                  "error",
                  "no-face-error"
                );
              }

              if (newCount >= 10) {
                logCheating(
                  "No face detected for extended period - automatic removal"
                );
                showAlert(
                  "You have been removed from the exam due to extended face absence.",
                  "error",
                  "exam-terminated"
                );
                markExamAsViolated(
                  "Face not detected for extended period - automatic removal"
                );
              }

              return newCount;
            });
          } else {
            setFaceDetected(true);
            setNoFaceCount(0);
            setConsecutiveNoFaceDetections(0);
            setLastFaceDetectionTime(Date.now());
            toast.dismiss("no-face-warning");
            toast.dismiss("no-face-error");
          }
        }
      } catch (error) {
        console.error("Error during face detection:", error);
        clearInterval(interval);
        setError(
          "Face detection failed. Switching to simple camera monitoring."
        );
        startSimpleMonitoring();
      }
    }, 1000); // Changed from 500ms to 1000ms to reduce processing frequency

    setDetectionInterval(interval);
  };

  const markExamAsViolated = async (reason: string) => {
    const alreadyViolated = localStorage.getItem(`exam_violated_${examId}`);
    if (alreadyViolated === "true") return; // 🛑 منع التكرار

    localStorage.setItem(`exam_violated_${examId}`, "true");
    localStorage.setItem(`exam_violation_reason_${examId}`, reason);

    await logCheating(reason);

    const token = getCookie("token");
    if (token) {
      try {
        await axios.post(
          `${origin}/exam/exams/logs/`,
          {
            exam_id: examId,
            reason,
            timestamp: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (apiError) {
        console.error("Failed to send final log to server");
      }
    }

    showAlert(
      "Exam violation detected. Redirecting to dashboard...",
      "error",
      "exam-violated"
    );
    localStorage.setItem(EXAM_STATE_KEY, "terminated"); // إضافة terminateExam هنا
    setTimeout(() => router.push("/dashboard_student"), 3000);
  };

  // const logCheating = async (reason: string) => {
  //   try {
  //     const logsStr = localStorage.getItem("exam_logs");
  //     let logs = logsStr ? JSON.parse(logsStr) : [];

  //     if (logs.length >= 50) {
  //       logs = logs.slice(-49);
  //     }

  //     logs.push({
  //       exam_id: examId,
  //       reason,
  //       timestamp: new Date().toISOString(),
  //     });

  //     localStorage.setItem("exam_logs", JSON.stringify(logs));

  //     // ❌ شيل الـ POST من هنا
  //   } catch (error) {
  //     console.error("Failed to log activity");
  //   }
  // };

  const logCheating = async (reason: string) => {
    try {
      const logsStr = localStorage.getItem("exam_logs");
      let logs = logsStr ? JSON.parse(logsStr) : [];

      if (logs.length >= 50) {
        logs = logs.slice(-49);
      }

      logs.push({
        exam_id: examId,
        reason,
        timestamp: new Date().toISOString(),
      });

      localStorage.setItem("exam_logs", JSON.stringify(logs));

      const token = getCookie("token");
      if (token) {
        await axios.post(
          `${origin}/exam/exams/logs/`,
          {
            exam_id: examId,
            reason,
            timestamp: new Date().toISOString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "500px",
        height: "400px",
        marginTop: "2rem",
        border: "2px solid #cbd5e1",
        borderRadius: "1rem",
        padding: "1rem",
        backgroundColor: "#f8fafc",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "0.75rem",
        }}
        muted
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <ToastContainer />
      {isLoading && (
        <div style={{ marginTop: "1rem", color: "#0ea5e9" }}>Loading...</div>
      )}
      {error && (
        <div style={{ marginTop: "1rem", color: "#ef4444" }}>{error}</div>
      )}
    </div>
  );
}
