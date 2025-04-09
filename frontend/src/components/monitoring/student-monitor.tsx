
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from 'face-api.js';

interface StudentMonitorProps {
  examId: string;
}

export default function StudentMonitor({ examId }: StudentMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [noFaceCount, setNoFaceCount] = useState(0);
  const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<number>(performance.now());
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isKickedOut, setIsKickedOut] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Loading face detection models...");

        // Use CDN-hosted models instead of local files
        const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

        // Load models from CDN
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("Tiny Face Detector model loaded");

        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log("Face Landmark model loaded");

        setModelsLoaded(true);
        setIsLoading(false);
        console.log("Face detection models loaded successfully");
      } catch (error) {
        console.error("Error loading face detection models:", error);
        setError("Failed to load face detection models. Please refresh the page and try again.");
        setIsLoading(false);
      }
    };

    loadModels();

    return () => {
      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, []);

  useEffect(() => {
    const startVideoStream = async () => {
      if (!modelsLoaded) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            console.log("Video is playing, starting face detection");
            startFaceDetection();
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setError("Failed to access camera. Please ensure camera permissions are granted.");
        setIsLoading(false);
      }
    };

    startVideoStream();
  }, [modelsLoaded]);

  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
  
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
  
    const displaySize = { width: canvas.width, height: canvas.height };
    faceapi.matchDimensions(canvas, displaySize);
  
    console.log("Starting face detection");
  
    // Delay in milliseconds (e.g., 500ms between detections)
    const detectionDelay = 500;
  
    // Use a recursive function with setTimeout to control detection speed
    const detectFace = async () => {
      if (video.paused || video.ended || !modelsLoaded) return;
  
      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
          .withFaceLandmarks();
  
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  
          if (detections.length === 0) {
            console.log("No face detected, current count:", noFaceCount + 1);
  
            setNoFaceCount((prevCount) => {
              const newCount = prevCount + 1;
              console.log("Updated noFaceCount:", newCount);
  
              if (newCount >= 5) {
                const timeSinceLastDetection = Date.now() - lastFaceDetectionTime;
                console.log("No face for frames:", newCount, "Time since last detection:", timeSinceLastDetection);
  
                logCheating("No face detected for extended period");
                toast.error("Your face is not detected! Please ensure you are in the camera frame.", {
                  toastId: "no-face-alert", // Prevent duplicate toasts
                });
              }
  
              return newCount;
            });
          } else {
            console.log("Face detected, resetting counter");
            setNoFaceCount(0); // Reset counter when face is detected
            setLastFaceDetectionTime(Date.now());
          }
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      } finally {
        // Use setTimeout to delay the next frame detection
        setTimeout(detectFace, detectionDelay); // 500ms delay
      }
    };
  
    detectFace(); // Start the detection loop
  };
  
  
  const logCheating = async (reason: string) => {
    const token = getCookie("token");
    if (!token) {
      console.error("No token found.");
      return;
    }
  
    try {
      console.log("Logging suspicious activity:", reason);
  
      // Log to server
      const response = await axios.post(
        "http://127.0.0.1:8000/exam/exams/logs/",
        {
          exam_id: examId,
          reason,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",  // Ensure you're sending JSON
          },
        }
      );
      console.log("Cheating logged:", reason);
    } catch (error) {
      console.error("Failed to log cheating:", error);
      if (axios.isAxiosError(error) && error.response) {
        // If the server returned a response
        console.error("Server response:", error.response);
      } else {
        if (error instanceof Error) {
          console.error("Error message:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    }
  };
  

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      logCheating("User switched to a new tab or minimized the browser");
      toast.warn("You switched to a new tab or minimized the browser.", {
        style: { backgroundColor: "#FFD700", color: "black" },
      });
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleCopy = () => {
    logCheating("User attempted to copy content");
    toast.warn("Copying content is not allowed.", { style: { backgroundColor: "#FFD700", color: "black" } });
  };

  useEffect(() => {
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "500px",
        height: "400px",
        marginTop: "2rem",
        border: "2px solid #cbd5e1", // لون لبني خفيف
        borderRadius: "1rem",
        padding: "1rem",
        backgroundColor: "#f8fafc", // لون خلفية فاتح
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
      {isLoading && <div style={{ marginTop: "1rem", color: "#0ea5e9" }}>Loading...</div>}
      {error && <div style={{ marginTop: "1rem", color: "#ef4444" }}>{error}</div>}
    </div>
  );
  
}

