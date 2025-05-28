"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Hash, CreditCard, User, X } from "lucide-react"

export default function CheckInOptions() {
  const router = useRouter()
  const [showAlternatives, setShowAlternatives] = useState(false)

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  if (showAlternatives) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setShowAlternatives(false)}
              className="text-white hover:bg-slate-800 min-h-[48px] min-w-[48px]"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back
            </Button>

            <h1 className="text-3xl font-bold text-white">Find your booking using:</h1>

            <div className="w-24" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card
              className="p-6 border-0 shadow-xl cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: "#343941" }}
              onClick={() => router.push("/check-in/health-card")}
            >
              <div className="flex items-center space-x-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#9469E9" }}
                >
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Health Card Number</h2>
                  <p className="text-lg" style={{ color: "#C9CCD1" }}>
                    I have my health card with me
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 border-0 shadow-xl cursor-pointer hover:scale-105 transition-transform"
              style={{ backgroundColor: "#343941" }}
              onClick={() => router.push("/check-in/personal-details")}
            >
              <div className="flex items-center space-x-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#9469E9" }}
                >
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Personal Details</h2>
                  <p className="text-lg" style={{ color: "#C9CCD1" }}>
                    I'll use my name, date of birth, and phone number
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/mode-select")}
            className="text-white hover:bg-slate-800 min-h-[48px] min-w-[48px]"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-white">Check In</h1>

          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card
            className="p-6 border-0 shadow-xl cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: "#343941" }}
            onClick={() => router.push("/check-in/booking-reference")}
          >
            <div className="flex items-center space-x-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#9469E9" }}
              >
                <Hash className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">I have my booking reference</h2>
                <p className="text-lg" style={{ color: "#C9CCD1" }}>
                  Enter the number from your appointment confirmation
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 border-0 shadow-xl cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: "#343941" }}
            onClick={() => setShowAlternatives(true)}
          >
            <div className="flex items-center space-x-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#9469E9" }}
              >
                <X className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">I don't have one</h2>
                <p className="text-lg" style={{ color: "#C9CCD1" }}>
                  Find my appointment using other information
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
