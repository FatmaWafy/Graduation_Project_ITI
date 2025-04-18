"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";

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

        console.log("Face detection models loaded successfully");
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
                  console.log("Video is playing, starting face detection");
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
                console.log("Video is playing, using simple monitoring");
                setIsLoading(false);
                setFaceDetected(true);

                const interval = setInterval(() => {
                  if (videoRef.current && videoRef.current.paused) {
                    console.log("Video paused, possible violation");
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
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
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
    return () => document.removeEventListener("copy", handleCopy as EventListener);
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

    console.log("Starting face detection interval");

    const interval = setInterval(async () => {
      if (video.paused || video.ended || !modelsLoaded) return;

      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

          if (detections.length === 0) {
            console.log("No face detected");
            setFaceDetected(false);
            setNoFaceCount((prevCount) => {
              const newCount = prevCount + 1;
              console.log("No face count:", newCount);

              if (newCount >= 5) {
                const timeSinceLastDetection = Date.now() - lastFaceDetectionTime;

                if (timeSinceLastDetection > 5000) {
                  logCheating("No face detected for extended period");
                  showAlert(
                    "Please ensure your face is visible in the camera frame.",
                    "error",
                    "no-face-warning"
                  );

                  if (timeSinceLastDetection > 10000) {
                    showAlert(
                      "Extended absence detected. This has been recorded.",
                      "error",
                      "no-face-error"
                    );
                    markExamAsViolated("Face not detected for extended period");
                  }
                }
              }
              return newCount;
            });
          } else {
            console.log("Face detected");
            setFaceDetected(true);
            setNoFaceCount(0);
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
    }, 500);

    setDetectionInterval(interval);
  };

  const markExamAsViolated = (reason: string) => {
    localStorage.setItem(`exam_violated_${examId}`, "true");
    localStorage.setItem(`exam_violation_reason_${examId}`, reason);

    showAlert(
      "Exam violation detected. Redirecting to dashboard...",
      "error",
      "exam-violated"
    );

    setTimeout(() => router.push("/dashboard_student"), 3000);
  };

  const logCheating = async (reason: string) => {
    try {
      console.log("Logging suspicious activity:", reason);
      const logs = JSON.parse(localStorage.getItem("exam_logs") || "[]");
      logs.push({
        exam_id: examId,
        reason,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("exam_logs", JSON.stringify(logs));

      const token = getCookie("token");
      if (token) {
        try {
          await axios.post(
            "http://127.0.0.1:8000/exam/exams/logs/",
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
          console.error(
            "Failed to send log to server, but saved locally:",
            apiError
          );
        }
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