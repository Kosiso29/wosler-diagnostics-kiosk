"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useIdleTimer } from "@/hooks/use-idle-timer"

export default function AttractScreen() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)

  // 45 second idle timer
  useIdleTimer(() => {
    setIsActive(false)
  }, 45000)

  const handleTapAnywhere = () => {
    setIsActive(true)
    router.push("/mode-select")
  }

  return (
    <div
      className="min-h-screen bg-slate-900 flex items-center justify-center p-8 cursor-pointer"
      onClick={handleTapAnywhere}
      style={{ backgroundColor: "#2B2F36" }}
    >
      <Card className="w-full max-w-2xl p-12 text-center border-0 shadow-2xl" style={{ backgroundColor: "#343941" }}>
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white">Wosler Diagnostics</h1>
            <p className="text-2xl" style={{ color: "#C9CCD1" }}>
              Welcome to our clinic
            </p>
          </div>

          <div className="space-y-6">
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#9469E9" }}
            >
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>

            <h2 className="text-4xl font-semibold text-white">Tap anywhere to begin</h2>

            <p className="text-xl" style={{ color: "#C9CCD1" }}>
              Check in for your appointment or register as a walk-in
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
