"use client"

import { AlertTriangle, Camera, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ExamRulesPage() {
    const { id } = useParams()
    const router = useRouter()
    const [isViolated, setIsViolated] = useState(false)
    const [violationReason, setViolationReason] = useState("")
    const [loading, setLoading] = useState(true)
    const [brightnessValue, setBrightnessValue] = useState(100)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const examId = Array.isArray(id) ? id[0] : id
        const violated = localStorage.getItem(`exam_violated_${examId}`) === "true"

        if (violated) {
            setIsViolated(true)
            setViolationReason(localStorage.getItem(`exam_violation_reason_${examId}`) || "Exam rules violation")
        }

        // تشغيل الكاميرا
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                }

                // قياس السطوع كل 2 ثانية
                setInterval(() => {
                    const canvas = canvasRef.current
                    const video = videoRef.current
                    if (!canvas || !video) return

                    const ctx = canvas.getContext("2d")
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

                    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
                    if (!imageData) return

                    const data = imageData.data
                    let total = 0

                    for (let i = 0; i < data.length; i += 4) {
                        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
                        total += avg
                    }

                    const avgBrightness = total / (data.length / 4)

                    if (avgBrightness < 40) {
                        toast.warning("الإضاءة منخفضة، من فضلك زوّد النور")
                    }
                }, 2000)
            })
            .catch(error => {
                console.error("Camera error:", error)
                toast.error("حدث خطأ أثناء تشغيل الكاميرا")
            })

        setLoading(false)
    }, [id])

    const startExam = () => {
        if (isViolated) {
            alert("You cannot take this exam due to previous violations.")
            return
        }

        const examId = Array.isArray(id) ? id[0] : id
        router.push(`/dashboard_student/exams/exam/${examId}`)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-destructive"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full bg-background text-foreground p-4 space-y-4">
            {/* الكاميرا + التحكم */}
            <div className="flex flex-col items-center">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="rounded-lg w-full max-w-md"
                    style={{ filter: `brightness(${brightnessValue}%)` }}
                />
                <canvas ref={canvasRef} className="hidden" />
                <p className="mt-2 text-sm">Control brightness</p>
                <Slider
                    defaultValue={[100]}
                    min={50}
                    max={150}
                    step={1}
                    className="w-[200px]"
                    onValueChange={(val) => setBrightnessValue(val[0])}
                />
            </div>

            {/* القوانين */}
            <div className="bg-secondary text-foreground p-6 text-center">
                <h1 className="text-2xl font-bold">Exam Rules & Instructions</h1>
            </div>

            <div className="p-4 space-y-8">
                <div className="text-center mb-6">
                    <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-2" />
                    <p className="text-lg font-semibold">Please read all rules carefully before starting the exam</p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <Copy className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold mb-1">No Copying Allowed</h3>
                            <p>Copying any content during the exam is strictly prohibited. If you attempt to copy any material, you will be immediately removed from the exam.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <ExternalLink className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold mb-1">No Tab Switching</h3>
                            <p>Navigating away from the exam tab is not allowed. If you switch to another tab or application, you will be immediately removed from the exam.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                        <Camera className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-lg font-bold mb-1">Camera Must Stay On</h3>
                            <p>Your camera must remain on throughout the exam. Make sure you stay within the camera frame. If you receive 5 alerts about being out of frame, you will be removed from the exam.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary p-4 rounded-lg">
                    <p className="font-medium text-center">
                        By clicking "Start Exam", you agree to follow all the rules stated above.
                    </p>
                </div>

                {isViolated && (
                    <div className="bg-destructive/10 border border-destructive text-destructive-foreground p-4 rounded-lg">
                        <p className="font-bold text-center">You cannot take this exam</p>
                        <p className="text-center">Reason: {violationReason}</p>
                    </div>
                )}
            </div>

            {/* زرار البدء */}
            <div className="p-6 flex justify-center">
                {isViolated ? (
                    <Link href="/dashboard_student">
                        <Button variant="secondary">Return to Dashboard</Button>
                    </Link>
                ) : (
                    <Button onClick={startExam} className="bg-primary hover:bg-primary/90" variant="destructive">
                        Start Exam
                    </Button>
                )}
            </div>
        </div>
    )
}
