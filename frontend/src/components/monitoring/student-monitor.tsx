

// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as faceapi from 'face-api.js';

// interface StudentMonitorProps {
//   examId: string;
// }

// export default function StudentMonitor({ examId }: StudentMonitorProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [noFaceCount, setNoFaceCount] = useState(0);
//   const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<number>(performance.now());
//   const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);
//         console.log("Loading face detection models...");

//         // Use CDN-hosted models instead of local files
//         const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models";

//         // Load models from CDN
//         await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
//         console.log("Tiny Face Detector model loaded");

//         await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
//         console.log("Face Landmark model loaded");

//         setModelsLoaded(true);
//         setIsLoading(false);
//         console.log("Face detection models loaded successfully");
//       } catch (error) {
//         console.error("Error loading face detection models:", error);
//         setError("Failed to load face detection models. Please refresh the page and try again.");
//         setIsLoading(false);
//       }
//     };

//     loadModels();

//     return () => {
//       if (detectionInterval) {
//         clearInterval(detectionInterval);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const startVideoStream = async () => {
//       if (!modelsLoaded) return;

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 640, height: 480, facingMode: "user" },
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current?.play();
//             console.log("Video is playing, starting face detection");
//             startFaceDetection();
//           };
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error);
//         setError("Failed to access camera. Please ensure camera permissions are granted.");
//         setIsLoading(false);
//       }
//     };

//     startVideoStream();
//   }, [modelsLoaded]);

//   const startFaceDetection = () => {
//     if (!videoRef.current || !canvasRef.current) return;
  
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
  
//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth || 640;
//     canvas.height = video.videoHeight || 480;
  
//     const displaySize = { width: canvas.width, height: canvas.height };
//     faceapi.matchDimensions(canvas, displaySize);
  
//     console.log("Starting face detection");
  
//     // Delay in milliseconds (e.g., 500ms between detections)
//     const detectionDelay = 500;
  
//     // Use a recursive function with setTimeout to control detection speed
//     const detectFace = async () => {
//       if (video.paused || video.ended || !modelsLoaded) return;
  
//       try {
//         const detections = await faceapi
//           .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
//           .withFaceLandmarks();
  
//         const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);
  
//           faceapi.draw.drawDetections(canvas, resizedDetections);
//           faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  
//           if (detections.length === 0) {
//             console.log("No face detected, current count:", noFaceCount + 1);
  
//             setNoFaceCount((prevCount) => {
//               const newCount = prevCount + 1;
//               console.log("Updated noFaceCount:", newCount);
  
//               if (newCount >= 5) {
//                 const timeSinceLastDetection = Date.now() - lastFaceDetectionTime;
//                 console.log("No face for frames:", newCount, "Time since last detection:", timeSinceLastDetection);
  
//                 logCheating("No face detected for extended period");
//                 toast.error("Your face is not detected! Please ensure you are in the camera frame.", {
//                   toastId: "no-face-alert", // Prevent duplicate toasts
//                 });
//               }
  
//               return newCount;
//             });
//           } else {
//             console.log("Face detected, resetting counter");
//             setNoFaceCount(0); // Reset counter when face is detected
//             setLastFaceDetectionTime(Date.now());
//           }
//         }
//       } catch (error) {
//         console.error("Error during face detection:", error);
//       } finally {
//         // Use setTimeout to delay the next frame detection
//         setTimeout(detectFace, detectionDelay); // 500ms delay
//       }
//     };
  
//     detectFace(); // Start the detection loop
//   };
  
  
//   const logCheating = async (reason: string) => {
//     const token = getCookie("token");
//     if (!token) {
//       console.error("No token found.");
//       return;
//     }
  
//     try {
//       console.log("Logging suspicious activity:", reason);
  
//       // Log to server
//       const response = await axios.post(
//         "http://127.0.0.1:8000/exam/exams/logs/",
//         {
//           exam_id: examId,
//           reason,
//           timestamp: new Date().toISOString(),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",  // Ensure you're sending JSON
//           },
//         }
//       );
//       console.log("Cheating logged:", reason);
//     } catch (error) {
//       console.error("Failed to log cheating:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         // If the server returned a response
//         console.error("Server response:", error.response);
//       } else {
//         if (error instanceof Error) {
//           console.error("Error message:", error.message);
//         } else {
//           console.error("Unknown error:", error);
//         }
//       }
//     }
//   };
  

//   const getCookie = (name: string): string | null => {
//     const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//     return match ? match[2] : null;
//   };

//   const handleVisibilityChange = () => {
//     if (document.visibilityState === "hidden") {
//       logCheating("User switched to a new tab or minimized the browser");
//       toast.warn("You switched to a new tab or minimized the browser.", {
//         style: { backgroundColor: "#FFD700", color: "black" },
//       });
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   const handleCopy = () => {
//     logCheating("User attempted to copy content");
//     toast.warn("Copying content is not allowed.", { style: { backgroundColor: "#FFD700", color: "black" } });
//   };

//   useEffect(() => {
//     document.addEventListener("copy", handleCopy);

//     return () => {
//       document.removeEventListener("copy", handleCopy);
//     };
//   }, []);

//   return (
//     <div style={{ position: "relative", width: "800px", height: "600px" }}>
//       <video ref={videoRef} style={{ width: "100%", height: "100%" }} muted />
//       <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
//       <ToastContainer />
//       {isLoading && <div>Loading...</div>}
//       {error && <div>{error}</div>}
//     </div>
//   );
// }









// "use client"

// import { useEffect, useRef, useState } from "react"
// import { useRouter } from "next/navigation"
// import axios from "axios"
// import { ToastContainer, toast } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"
// import * as faceapi from "face-api.js"

// interface StudentMonitorProps {
//   examId: string
// }

// export default function StudentMonitor({ examId }: StudentMonitorProps) {
//   const router = useRouter()
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const [modelsLoaded, setModelsLoaded] = useState(false)
//   const [noFaceCount, setNoFaceCount] = useState(0)
//   const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<number>(performance.now())
//   const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [violationCount, setViolationCount] = useState(0)
//   const [cameraEnabled, setCameraEnabled] = useState(false)

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)
//         console.log("Loading face detection models...")

//         // Use CDN-hosted models instead of local files
//         const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models"

//         // Load models from CDN
//         await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
//         console.log("Tiny Face Detector model loaded")

//         await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
//         console.log("Face Landmark model loaded")

//         setModelsLoaded(true)
//         setIsLoading(false)
//         console.log("Face detection models loaded successfully")
//       } catch (error) {
//         console.error("Error loading face detection models:", error)
//         setError("Failed to load face detection models. Please refresh the page and try again.")
//         setIsLoading(false)
//       }
//     }

//     loadModels()

//     return () => {
//       if (detectionInterval) {
//         clearInterval(detectionInterval)
//       }
//     }
//   }, [])

//   useEffect(() => {
//     const startVideoStream = async () => {
//       if (!modelsLoaded) return

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { width: 640, height: 480, facingMode: "user" },
//         })

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current?.play()
//             console.log("Video is playing, starting face detection")
//             setCameraEnabled(true)
//             startFaceDetection()
//           }
//         }
//       } catch (error) {
//         console.error("Error accessing camera:", error)
//         setError("Failed to access camera. Please ensure camera permissions are granted.")
//         setIsLoading(false)
//       }
//     }

//     startVideoStream()
//   }, [modelsLoaded])

//   const startFaceDetection = () => {
//     if (!videoRef.current || !canvasRef.current) return

//     const video = videoRef.current
//     const canvas = canvasRef.current

//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth || 640
//     canvas.height = video.videoHeight || 480

//     const displaySize = { width: canvas.width, height: canvas.height }
//     faceapi.matchDimensions(canvas, displaySize)

//     console.log("Starting face detection")

//     // Delay in milliseconds (e.g., 500ms between detections)
//     const detectionDelay = 500

//     // Use a recursive function with setTimeout to control detection speed
//     const detectFace = async () => {
//       if (video.paused || video.ended || !modelsLoaded) return

//       try {
//         const detections = await faceapi
//           .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
//           .withFaceLandmarks()

//         const resizedDetections = faceapi.resizeResults(detections, displaySize)

//         const ctx = canvas.getContext("2d")
//         if (ctx) {
//           ctx.clearRect(0, 0, canvas.width, canvas.height)

//           faceapi.draw.drawDetections(canvas, resizedDetections)
//           faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

//           if (detections.length === 0) {
//             console.log("No face detected, current count:", noFaceCount + 1)

//             setNoFaceCount((prevCount) => {
//               const newCount = prevCount + 1
//               console.log("Updated noFaceCount:", newCount)

//               if (newCount >= 5) {
//                 const timeSinceLastDetection = Date.now() - lastFaceDetectionTime
//                 console.log("No face for frames:", newCount, "Time since last detection:", timeSinceLastDetection)

//                 logCheating("No face detected for extended period")
//                 toast.error("Your face is not detected! Please ensure you are in the camera frame.", {
//                   toastId: "no-face-alert", // Prevent duplicate toasts
//                 })

//                 // Mark exam as violated after 5 face detection failures
//                 markExamAsViolated("Face not detected for extended period")
//               }

//               return newCount
//             })
//           } else {
//             console.log("Face detected, resetting counter")
//             setNoFaceCount(0) // Reset counter when face is detected
//             setLastFaceDetectionTime(Date.now())
//           }
//         }
//       } catch (error) {
//         console.error("Error during face detection:", error)
//       } finally {
//         // Use setTimeout to delay the next frame detection
//         setTimeout(detectFace, detectionDelay) // 500ms delay
//       }
//     }

//     detectFace() // Start the detection loop
//   }

//   const markExamAsViolated = (reason: string) => {
//     // Store violation in localStorage
//     localStorage.setItem(`exam_violated_${examId}`, "true")
//     localStorage.setItem(`exam_violation_reason_${examId}`, reason)

//     // Redirect to dashboard
//     toast.error("Exam violation detected. You are being redirected to the dashboard.", {
//       onClose: () => {
//         router.push("/dashboard_student")
//       },
//       autoClose: 3000,
//     })
//   }

//   const logCheating = async (reason: string) => {
//     // Always log to localStorage as a backup
//     const logEntry = {
//       exam_id: examId,
//       reason,
//       timestamp: new Date().toISOString(),
//     }

//     // Store in localStorage
//     const existingLogs = JSON.parse(localStorage.getItem("exam_violation_logs") || "[]")
//     existingLogs.push(logEntry)
//     localStorage.setItem("exam_violation_logs", JSON.stringify(existingLogs))

//     // Try to send to server if possible
//     try {
//       const token = getCookie("token")
//       if (token) {
//         await axios.post("http://127.0.0.1:8000/exam/exams/logs/", logEntry, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         })
//         console.log("Cheating logged to server:", reason)
//       }
//     } catch (error) {
//       console.warn("Failed to log cheating to server (saved locally):", error)
//     }

//     // Increment violation count
//     setViolationCount((prev) => {
//       const newCount = prev + 1
//       if (newCount >= 5) {
//         markExamAsViolated(reason)
//       }
//       return newCount
//     })
//   }

//   const getCookie = (name: string): string | null => {
//     const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
//     return match ? match[2] : null
//   }

//   const handleVisibilityChange = () => {
//     if (document.visibilityState === "hidden") {
//       logCheating("User switched to a new tab or minimized the browser")
//       toast.error("You switched to a new tab or minimized the browser.", {
//         style: { backgroundColor: "#FFD700", color: "black" },
//       })

//       // Immediately mark as violated for tab switching
//       markExamAsViolated("Tab switching detected")
//     }
//   }

//   useEffect(() => {
//     document.addEventListener("visibilitychange", handleVisibilityChange)

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange)
//     }
//   }, [])

//   const handleCopy = (e: Event) => {
//     e.preventDefault()
//     logCheating("User attempted to copy content")
//     toast.error("Copying content is not allowed.", {
//       style: { backgroundColor: "#FFD700", color: "black" },
//     })

//     // Immediately mark as violated for copying
//     markExamAsViolated("Copy attempt detected")
//   }

//   useEffect(() => {
//     document.addEventListener("copy", handleCopy as EventListener)

//     return () => {
//       document.removeEventListener("copy", handleCopy as EventListener)
//     }
//   }, [])

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-bold mb-4">Exam Monitoring</h2>

//       {isLoading && (
//         <div className="flex justify-center items-center p-4 bg-gray-100 rounded-lg">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mr-2"></div>
//           <p>Loading monitoring system...</p>
//         </div>
//       )}

//       {error && (
//         <div className="p-4 bg-red-50 text-red-700 rounded-lg">
//           <p className="font-bold">Error:</p>
//           <p>{error}</p>
//         </div>
//       )}

//       {cameraEnabled && (
//         <div className="relative w-full max-w-md mx-auto">
//           <div className="bg-black rounded-lg overflow-hidden">
//             <video ref={videoRef} className="w-full" muted />
//             <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
//           </div>
//           <p className="mt-2 text-sm text-center text-gray-600">
//             Your camera feed is being monitored. Please stay in frame at all times.
//           </p>
//         </div>
//       )}

//       <ToastContainer position="bottom-right" />
//     </div>
//   )
// }






"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import * as faceapi from "face-api.js"

interface StudentMonitorProps {
  examId: string
}

export default function StudentMonitor({ examId }: StudentMonitorProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState("Loading face detection system...")
  const [error, setError] = useState<string | null>(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [noFaceCount, setNoFaceCount] = useState(0)
  const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<number>(Date.now())
  const [faceDetected, setFaceDetected] = useState(false)
  const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null)

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingMessage("Loading face detection models...")

        // Use a more reliable CDN for the models
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/"

        // Only load the models we actually need
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ])

        console.log("Face detection models loaded successfully")
        setModelsLoaded(true)
        setLoadingMessage("Models loaded successfully, starting camera...")
      } catch (error) {
        console.error("Error loading face detection models:", error)
        setError("Failed to load face detection models. Please refresh the page and try again.")
        setIsLoading(false)

        // Fallback to simple camera monitoring without face detection
        startSimpleMonitoring()
      }
    }

    loadModels()

    return () => {
      // Clean up
      if (detectionInterval) {
        clearInterval(detectionInterval)
      }
    }
  }, [])

  // Start camera after models are loaded
  useEffect(() => {
    if (!modelsLoaded) return

    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: "user",
          },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream

          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current
                .play()
                .then(() => {
                  console.log("Video is playing, starting face detection")
                  setIsLoading(false)
                  // Wait a moment to ensure video is fully initialized
                  setTimeout(() => startFaceDetection(), 1000)
                })
                .catch((err) => {
                  console.error("Error playing video:", err)
                  setError("Failed to start camera stream. Please ensure camera permissions are granted.")
                  setIsLoading(false)
                })
            }
          }
        }
      } catch (error) {
        console.error("Error starting camera:", error)
        setError("Failed to access camera. Please ensure camera permissions are granted.")
        setIsLoading(false)
      }
    }

    startVideoStream()
  }, [modelsLoaded])

  // Fallback to simple camera monitoring without face detection
  const startSimpleMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current
              .play()
              .then(() => {
                console.log("Video is playing, using simple monitoring")
                setIsLoading(false)
                setFaceDetected(true) // Assume face is detected since we can't check

                // Simple interval to check if video is still playing
                const interval = setInterval(() => {
                  if (videoRef.current && videoRef.current.paused) {
                    console.log("Video paused, possible violation")
                    logCheating("Video stream interrupted")
                  }
                }, 1000)

                setDetectionInterval(interval)
              })
              .catch((err) => {
                console.error("Error playing video:", err)
                setError("Failed to start camera stream. Please ensure camera permissions are granted.")
                setIsLoading(false)
              })
          }
        }
      }
    } catch (error) {
      console.error("Error starting camera:", error)
      setError("Failed to access camera. Please ensure camera permissions are granted.")
      setIsLoading(false)
    }
  }

  // Set up tab visibility monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        logCheating("User switched to a new tab or minimized the browser")
        toast.warn("You switched to a new tab or minimized the browser.", {
          style: {
            backgroundColor: "#FFD700",
            color: "black",
          },
        })

        // Mark exam as violated for tab switching
        markExamAsViolated("Tab switching detected")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // Set up copy prevention
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      logCheating("User attempted to copy content")
      toast.warn("Copying content is not allowed.", {
        style: {
          backgroundColor: "#FFD700",
          color: "black",
        },
      })

      // Mark exam as violated for copying
      markExamAsViolated("Copy attempt detected")
    }

    document.addEventListener("copy", handleCopy as EventListener)

    return () => {
      document.removeEventListener("copy", handleCopy as EventListener)
    }
  }, [])

  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) {
      console.error("Cannot start face detection - video, canvas or models not ready")
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    const displaySize = { width: canvas.width, height: canvas.height }
    faceapi.matchDimensions(canvas, displaySize)

    console.log("Starting face detection interval")

    // Run face detection every 500ms
    const interval = setInterval(async () => {
      if (video.paused || video.ended || !modelsLoaded) return

      try {
        // Only use TinyFaceDetector which is more reliable
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()

        // Resize detections to match display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // Get canvas context and clear previous drawings
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // Draw detections and landmarks
          faceapi.draw.drawDetections(canvas, resizedDetections)
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)

          // Check if face is detected
          if (detections.length === 0) {
            console.log("No face detected")
            setFaceDetected(false)
            setNoFaceCount((prevCount) => {
              const newCount = prevCount + 1
              console.log("No face count:", newCount)

              // If no face detected for 5 consecutive checks (2.5 seconds)
              if (newCount >= 5) {
                const timeSinceLastDetection = Date.now() - lastFaceDetectionTime

                // If no face for more than 5 seconds
                if (timeSinceLastDetection > 5000) {
                  logCheating("No face detected for extended period")
                  toast.error("Your face is not detected! Please ensure you are in camera frame.", {
                    toastId: "no-face-warning",
                  })

                  // After 10 seconds of no face, consider it cheating
                  if (timeSinceLastDetection > 10000) {
                    toast.error("Suspicious activity recorded due to absence of face for extended period.", {
                      toastId: "no-face-error",
                    })
                    markExamAsViolated("Face not detected for extended period")
                  }
                }
              }
              return newCount
            })
          } else {
            console.log("Face detected")
            setFaceDetected(true)
            setNoFaceCount(0)
            setLastFaceDetectionTime(Date.now())

            // Clear any no-face warnings
            toast.dismiss("no-face-warning")
            toast.dismiss("no-face-error")
          }
        }
      } catch (error) {
        console.error("Error during face detection:", error)

        // If face detection fails, switch to simple monitoring
        clearInterval(interval)
        setError("Face detection failed. Switching to simple camera monitoring.")
        startSimpleMonitoring()
      }
    }, 500)

    setDetectionInterval(interval)
  }

  const markExamAsViolated = (reason: string) => {
    // Store violation in localStorage
    localStorage.setItem(`exam_violated_${examId}`, "true")
    localStorage.setItem(`exam_violation_reason_${examId}`, reason)

    // Redirect to dashboard
    toast.error("Exam violation detected. You are being redirected to the dashboard.", {
      onClose: () => {
        router.push("/dashboard_student")
      },
      autoClose: 3000,
    })
  }

  const logCheating = async (reason: string) => {
    try {
      console.log("Logging suspicious activity:", reason)

      // Store in localStorage as backup
      const logs = JSON.parse(localStorage.getItem("exam_logs") || "[]")
      logs.push({
        exam_id: examId,
        reason,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("exam_logs", JSON.stringify(logs))

      // Try to send to server if possible
      const token = getCookie("token")
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
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
        } catch (apiError) {
          console.error("Failed to send log to server, but saved locally:", apiError)
        }
      }
    } catch (error) {
      console.error("Failed to log activity:", error)
    }
  }

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    return match ? match[2] : null
  }

  return (
    <>
      <div className="relative w-full max-w-2xl mx-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-gray-700">{loadingMessage}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video ref={videoRef} width="640" height="480" className="w-full h-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {!faceDetected && !isLoading && (
            <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-center py-1 px-2">
              No face detected! Please ensure you are in camera frame.
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-medium text-red-800">Exam Monitoring Active</h3>
          <p className="text-sm text-red-600">
            Your camera feed is being monitored. Please stay in frame and do not switch tabs or applications.
          </p>
          <div className="mt-2 flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${faceDetected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm">{faceDetected ? "Face detected" : "No face detected"}</span>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  )
}
