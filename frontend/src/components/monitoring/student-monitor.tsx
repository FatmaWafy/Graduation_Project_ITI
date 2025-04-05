"use client";

import {
  FilesetResolver,
  FaceLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Accept examId as a prop
interface StudentMonitorProps {
  examId: string;
}

export default function StudentMonitor({ examId }: StudentMonitorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [noFaceCount, setNoFaceCount] = useState(0);
  const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<number>(performance.now());

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing Mediapipe Vision...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
            },
            outputFaceBlendshapes: false,
            runningMode: "VIDEO",
            numFaces: 1,
          });
          
        console.log("FaceLandmarker initialized successfully");
        setFaceLandmarker(landmarker);
        startCamera();
      } catch (error) {
        console.error("Error initializing Mediapipe Vision:", error);
      }
    };

    init();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logCheating("User switched to a new tab or minimized the browser");
        toast.warn("You switched to a new tab or minimized the browser.", {
          style: {
            backgroundColor: "#FFD700",
            color: "black",
          },
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };

  }, []);

  useEffect(() => {
    const handleCopy = () => {
      logCheating("User attempted to copy content");
      toast.warn("Copying content is not allowed.", {
        style: {
          backgroundColor: "#FFD700", 
          color: "black", 
        },
      });
    };

    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.oncanplay = () => {
          videoRef.current?.play();
          requestAnimationFrame(processFrame);
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const processFrame = async () => {
    console.log("Processing frame...");
  
    if (
      videoRef.current &&
      canvasRef.current &&
      faceLandmarker &&
      videoRef.current.readyState === 4
    ) {
      console.log("Ready to process frame");
  
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const result = faceLandmarker.detectForVideo(video, performance.now());
      console.log("Detection result:", result);
  
      if (!result.faceLandmarks || result.faceLandmarks.length === 0) {
        console.log("No face detected");
        logCheating("No face detected");
        setNoFaceCount(prevCount => prevCount + 1);
        const timeSinceLastDetection = performance.now() - lastFaceDetectionTime;
  
        if (timeSinceLastDetection > 5000 && noFaceCount >= 2) {
          toast.error("You have been removed from the exam due to suspicious activity.");
          window.location.href = "/exam-end";
        }
      } else {
        console.log("Face detected");
        const drawingUtils = new DrawingUtils(ctx);
        for (const landmarks of result.faceLandmarks) {
          drawingUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            { color: "#C0C0C070", lineWidth: 1 }
          );
        }
        setNoFaceCount(0); // Reset counter if face is detected
        setLastFaceDetectionTime(performance.now()); // Update the time of last detection
      }
    }
  
    requestAnimationFrame(processFrame);
  };

  const logCheating = async (reason: string) => {
    const token = getCookie("token");
    try {
      console.log("Sending log to server...");
      await axios.post(
        "http://127.0.0.1:8000/exam/exams/logs/",
        {
          exam_id: examId, // Use the dynamic exam ID passed as a prop
          reason,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cheating logged:", reason);
    } catch (error) {
      console.error("Failed to log cheating:", error);
    }
  };

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  return (
    <>
      <div style={{ position: "relative", width: "800px", height: "600px" }}>
        <video ref={videoRef} style={{ width: "100%", height: "100%", marginTop:"20px" }} muted />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>
      <ToastContainer />
    </>
  );
}
