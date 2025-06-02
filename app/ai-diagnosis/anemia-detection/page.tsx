"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

interface AnemiaResult {
  success: boolean
  prediction: string
  confidence: number
  type: "eye" | "nail"
  roi_detected?: boolean
  error?: string
}

interface CameraViewProps {
  onCapture: (image: string) => void
  onClose: () => void
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function CameraView({ onCapture, onClose }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [flash, setFlash] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
  const [clientValue, setClientValue] = useState<number | null>(null)

  useEffect(() => {
    setClientValue(window.innerWidth); // or Date.now(), Math.random(), etc.
  }, []);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        setStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraError(null)
      } catch (err) {
        console.error("Error accessing camera:", err)
        setCameraError("Could not access camera. Please check permissions.")
      }
    }
    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const captureImage = () => {
    if (cameraError) return
    
    setCountdown(3)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer)
          takePicture()
          return null
        }
        return prev ? prev - 1 : null
      })
    }, 1000)
  }

  const takePicture = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 200)

    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const image = canvas.toDataURL("image/jpeg", 0.9)
        onCapture(image)
      }
    }
  }

  if (clientValue === null) return null; // or a loading state

  return (
    <div>
      <div>{clientValue}</div>
      <video ref={videoRef} autoPlay playsInline style={{ display: cameraError ? "none" : "block" }} />
      {cameraError && <div className="error">{cameraError}</div>}
      <button onClick={captureImage}>Capture</button>
      {countdown !== null && <div className="countdown">{countdown}</div>}
      {flash && <div className="flash" />}
    </div>
  )
}

export default CameraView
