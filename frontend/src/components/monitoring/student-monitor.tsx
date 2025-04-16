// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import * as faceapi from "face-api.js";

// interface StudentMonitorProps {
//   examId: string;
// }

// export default function StudentMonitor({ examId }: StudentMonitorProps) {
//   const router = useRouter();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadingMessage, setLoadingMessage] = useState(
//     "Loading face detection system..."
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [noFaceCount, setNoFaceCount] = useState(0);
//   const [lastFaceDetectionTime, setLastFaceDetectionTime] = useState<number>(
//     Date.now()
//   );
//   const [faceDetected, setFaceDetected] = useState(false);
//   const [detectionInterval, setDetectionInterval] =
//     useState<NodeJS.Timeout | null>(null);

//   // Load face-api models  const [isKickedOut, setIsKickedOut] = useState(false);

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         setLoadingMessage("Loading face detection models...");

//         // Use a more reliable CDN for the models
//         const MODEL_URL =
//           "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

//         // Only load the models we actually need
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         ]);

//         console.log("Face detection models loaded successfully");
//         setModelsLoaded(true);
//         setLoadingMessage("Models loaded successfully, starting camera...");
//       } catch (error) {
//         console.error("Error loading face detection models:", error);
//         setError(
//           "Failed to load face detection models. Please refresh the page and try again."
//         );
//         setIsLoading(false);

//         // Fallback to simple camera monitoring without face detection
//         startSimpleMonitoring();
//       }
//     };

//     loadModels();

//     return () => {
//       // Clean up
//       if (detectionInterval) {
//         clearInterval(detectionInterval);
//       }
//     };
//   }, []);

//   // Start camera after models are loaded
//   useEffect(() => {
//     if (!modelsLoaded) return;

//     const startVideoStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: {
//             width: 640,
//             height: 480,
//             facingMode: "user",
//           },
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;

//           videoRef.current.onloadedmetadata = () => {
//             if (videoRef.current) {
//               videoRef.current
//                 .play()
//                 .then(() => {
//                   console.log("Video is playing, starting face detection");
//                   setIsLoading(false);
//                   // Wait a moment to ensure video is fully initialized
//                   setTimeout(() => startFaceDetection(), 1000);
//                 })
//                 .catch((err) => {
//                   console.error("Error playing video:", err);
//                   setError(
//                     "Failed to start camera stream. Please ensure camera permissions are granted."
//                   );
//                   setIsLoading(false);
//                 });
//             }
//           };
//         }
//       } catch (error) {
//         console.error("Error starting camera:", error);
//         setError(
//           "Failed to access camera. Please ensure camera permissions are granted."
//         );
//         setIsLoading(false);
//       }
//     };

//     startVideoStream();
//   }, [modelsLoaded]);

//   // Fallback to simple camera monitoring without face detection
//   const startSimpleMonitoring = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: 640,
//           height: 480,
//           facingMode: "user",
//         },
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;

//         videoRef.current.onloadedmetadata = () => {
//           if (videoRef.current) {
//             videoRef.current
//               .play()
//               .then(() => {
//                 console.log("Video is playing, using simple monitoring");
//                 setIsLoading(false);
//                 setFaceDetected(true); // Assume face is detected since we can't check

//                 // Simple interval to check if video is still playing
//                 const interval = setInterval(() => {
//                   if (videoRef.current && videoRef.current.paused) {
//                     console.log("Video paused, possible violation");
//                     logCheating("Video stream interrupted");
//                   }
//                 }, 1000);

//                 setDetectionInterval(interval);
//               })
//               .catch((err) => {
//                 console.error("Error playing video:", err);
//                 setError(
//                   "Failed to start camera stream. Please ensure camera permissions are granted."
//                 );
//                 setIsLoading(false);
//               });
//           }
//         };
//       }
//     } catch (error) {
//       console.error("Error starting camera:", error);
//       setError(
//         "Failed to access camera. Please ensure camera permissions are granted."
//       );
//       setIsLoading(false);
//     }
//   };

//   // Set up tab visibility monitoring
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "hidden") {
//         logCheating("User switched to a new tab or minimized the browser");
//         toast.warn("You switched to a new tab or minimized the browser.", {
//           style: {
//             backgroundColor: "#FFD700",
//             color: "black",
//           },
//         });

//         // Mark exam as violated for tab switching
//         markExamAsViolated("Tab switching detected");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   // Set up copy prevention
//   useEffect(() => {
//     const handleCopy = (e: ClipboardEvent) => {
//       e.preventDefault();
//       logCheating("User attempted to copy content");
//       toast.warn("Copying content is not allowed.", {
//         style: {
//           backgroundColor: "#FFD700",
//           color: "black",
//         },
//       });

//       // Mark exam as violated for copying
//       markExamAsViolated("Copy attempt detected");
//     };

//     document.addEventListener("copy", handleCopy as EventListener);

//     return () => {
//       document.removeEventListener("copy", handleCopy as EventListener);
//     };
//   }, []);

//   const startFaceDetection = () => {
//     if (!videoRef.current || !canvasRef.current || !modelsLoaded) {
//       console.error(
//         "Cannot start face detection - video, canvas or models not ready"
//       );
//       return;
//     }

//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth || 640;
//     canvas.height = video.videoHeight || 480;

//     const displaySize = { width: canvas.width, height: canvas.height };
//     faceapi.matchDimensions(canvas, displaySize);

//     console.log("Starting face detection interval");

//     // Run face detection every 500ms
//     const interval = setInterval(async () => {
//       if (video.paused || video.ended || !modelsLoaded) return;

//       try {
//         // Only use TinyFaceDetector which is more reliable
//         const detections = await faceapi
//           .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//           .withFaceLandmarks();

//         // Resize detections to match display size
//         const resizedDetections = faceapi.resizeResults(
//           detections,
//           displaySize
//         );

//         // Get canvas context and clear previous drawings
//         const ctx = canvas.getContext("2d");
//         if (ctx) {
//           ctx.clearRect(0, 0, canvas.width, canvas.height);

//           // Draw detections and landmarks
//           faceapi.draw.drawDetections(canvas, resizedDetections);
//           faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

//           // Check if face is detected
//           if (detections.length === 0) {
//             console.log("No face detected");
//             setFaceDetected(false);
//             setNoFaceCount((prevCount) => {
//               const newCount = prevCount + 1;
//               console.log("No face count:", newCount);

//               // If no face detected for 5 consecutive checks (2.5 seconds)
//               if (newCount >= 5) {
//                 const timeSinceLastDetection =
//                   Date.now() - lastFaceDetectionTime;

//                 // If no face for more than 5 seconds
//                 if (timeSinceLastDetection > 5000) {
//                   logCheating("No face detected for extended period");
//                   toast.error(
//                     "Your face is not detected! Please ensure you are in camera frame.",
//                     {
//                       toastId: "no-face-warning",
//                     }
//                   );

//                   // After 10 seconds of no face, consider it cheating
//                   if (timeSinceLastDetection > 10000) {
//                     toast.error(
//                       "Suspicious activity recorded due to absence of face for extended period.",
//                       {
//                         toastId: "no-face-error",
//                       }
//                     );
//                     markExamAsViolated("Face not detected for extended period");
//                   }
//                 }
//               }
//               return newCount;
//             });
//           } else {
//             console.log("Face detected");
//             setFaceDetected(true);
//             setNoFaceCount(0);
//             setLastFaceDetectionTime(Date.now());

//             // Clear any no-face warnings
//             toast.dismiss("no-face-warning");
//             toast.dismiss("no-face-error");
//           }
//         }
//       } catch (error) {
//         console.error("Error during face detection:", error);

//         // If face detection fails, switch to simple monitoring
//         clearInterval(interval);
//         setError(
//           "Face detection failed. Switching to simple camera monitoring."
//         );
//         startSimpleMonitoring();
//       }
//     }, 500);

//     setDetectionInterval(interval);
//   };

//   const markExamAsViolated = (reason: string) => {
//     // Store violation in localStorage
//     localStorage.setItem(`exam_violated_${examId}`, "true");
//     localStorage.setItem(`exam_violation_reason_${examId}`, reason);

//     // Redirect to dashboard
//     toast.error(
//       "Exam violation detected. You are being redirected to the dashboard.",
//       {
//         onClose: () => {
//           router.push("/dashboard_student");
//         },
//         autoClose: 3000,
//       }
//     );
//   };

//   const logCheating = async (reason: string) => {
//     try {
//       console.log("Logging suspicious activity:", reason);

//       // Store in localStorage as backup
//       const logs = JSON.parse(localStorage.getItem("exam_logs") || "[]");
//       logs.push({
//         exam_id: examId,
//         reason,
//         timestamp: new Date().toISOString(),
//       });
//       localStorage.setItem("exam_logs", JSON.stringify(logs));

//       // Try to send to server if possible
//       const token = getCookie("token");
//       if (token) {
//         try {
//           await axios.post(
//             "http://127.0.0.1:8000/exam/exams/logs/",
//             {
//               exam_id: examId,
//               reason,
//               timestamp: new Date().toISOString(),
//             },
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//         } catch (apiError) {
//           console.error(
//             "Failed to send log to server, but saved locally:",
//             apiError
//           );
//         }
//       }
//     } catch (error) {
//       console.error("Failed to log activity:", error);
//     }
//   };

//   const getCookie = (name: string): string | null => {
//     const match = document.cookie.match(
//       new RegExp("(^| )" + name + "=([^;]+)")
//     );
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
//     toast.warn("Copying content is not allowed.", {
//       style: { backgroundColor: "#FFD700", color: "black" },
//     });
//   };

//   useEffect(() => {
//     document.addEventListener("copy", handleCopy);

//     return () => {
//       document.removeEventListener("copy", handleCopy);
//     };
//   }, []);

//   return (
//     <div
//       style={{
//         position: "relative",
//         width: "500px",
//         height: "400px",
//         marginTop: "2rem",
//         border: "2px solid #cbd5e1", // لون لبني خفيف
//         borderRadius: "1rem",
//         padding: "1rem",
//         backgroundColor: "#f8fafc", // لون خلفية فاتح
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//       }}
//     >
//       <video
//         ref={videoRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//           borderRadius: "0.75rem",
//         }}
//         muted
//       />
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//         }}
//       />
//       <ToastContainer />
//       {isLoading && (
//         <div style={{ marginTop: "1rem", color: "#0ea5e9" }}>Loading...</div>
//       )}
//       {error && (
//         <div style={{ marginTop: "1rem", color: "#ef4444" }}>{error}</div>
//       )}
//     </div>
//   );


// }
"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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

  // Debug the examId to ensure it's correct
  useEffect(() => {
    console.log("StudentMonitor received examId:", examId)
  }, [examId])

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
        console.log("Tab visibility changed to hidden")
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
  }, [examId]) // Add examId as dependency

  // Set up copy prevention
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      console.log("Copy attempt detected")
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
  }, [examId]) // Add examId as dependency

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

              // After 3 consecutive checks with no face (1.5 seconds)
              if (newCount === 3) {
                logCheating("No face detected for 3 consecutive checks")
                toast.warning("Your face is not detected! Please ensure you are in camera frame.", {
                  toastId: "no-face-warning",
                })
              }

              // After 6 consecutive checks with no face (3 seconds), kick out
              if (newCount >= 6) {
                toast.error("Face not detected for too long. You will be redirected to the dashboard.", {
                  toastId: "no-face-error",
                })
                markExamAsViolated("Face not detected for extended period")
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                  router.push("/dashboard_student")
                }, 3000)
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

    // Log the violation
    logCheating(reason)
  }

  const logCheating = async (reason: string) => {
    try {
      console.log(`Logging suspicious activity for exam ${examId}:`, reason)

      // Get the token from cookies
      const token = getCookie("token")

      // Create the log data
      const logData = {
        exam_id: examId,
        reason,
        timestamp: new Date().toISOString(),
      }

      console.log("Sending log data to server:", logData)

      // Send to server first
      try {
        const response = await fetch("http://127.0.0.1:8000/exam/exams/logs/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(logData),
        })

        const responseData = await response.json()
        console.log("Server response:", responseData)

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${JSON.stringify(responseData)}`)
        }
      } catch (apiError) {
        console.error("Failed to send log to server:", apiError)

        // Store in localStorage as backup if server request fails
        const logs = JSON.parse(localStorage.getItem("exam_logs") || "[]")
        logs.push(logData)
        localStorage.setItem("exam_logs", JSON.stringify(logs))
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
    <div
      style={{
        position: "relative",
        width: "500px",
        height: "400px",
        marginTop: "2rem",
        border: "2px solid #cbd5e1", // لون لبني خفيف
        borderRadius: "1rem",
        padding: "1rem",
        backgroundColor: "#f8fafc", // لون خلفية فاتحة
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
  )
}
