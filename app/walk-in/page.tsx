"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Construction } from "lucide-react"

export default function WalkIn() {
  const router = useRouter()

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
      <div className="max-w-2xl mx-auto">
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

          <h1 className="text-3xl font-bold text-white">Walk-In Registration</h1>

          <div className="w-24" />
        </div>

        <Card className="p-12 border-0 shadow-xl text-center" style={{ backgroundColor: "#343941" }}>
          <div className="space-y-6">
            <div
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#9469E9" }}
            >
              <Construction className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-4xl font-bold text-white">Coming Soon</h2>

            <p className="text-xl" style={{ color: "#C9CCD1" }}>
              Walk-in registration will be available in Phase 2 of our kiosk system.
            </p>

            <p className="text-lg" style={{ color: "#C9CCD1" }}>
              For now, please see the front desk to register as a walk-in patient.
            </p>

            <Button
              size="lg"
              onClick={() => router.push("/mode-select")}
              className="h-16 text-xl font-semibold px-8"
              style={{ backgroundColor: "#9469E9" }}
            >
              Back to Options
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
