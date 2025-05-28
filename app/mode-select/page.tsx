"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Calendar, UserPlus } from "lucide-react"

export default function ModeSelect() {
  const router = useRouter()

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/")}
            className="text-white hover:bg-slate-800 min-h-[48px] min-w-[48px]"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Wosler Diagnostics</h1>
            <p className="text-xl mt-2" style={{ color: "#C9CCD1" }}>
              Welcome to our clinic
            </p>
          </div>

          <div className="w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="p-8 border-0 shadow-xl cursor-pointer hover:scale-105 transition-transform min-h-[200px]"
            style={{ backgroundColor: "#343941" }}
            onClick={() => router.push("/check-in")}
          >
            <div className="text-center space-y-6">
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#9469E9" }}
              >
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Check In</h2>
              <p className="text-xl" style={{ color: "#C9CCD1" }}>
                I have a scheduled appointment
              </p>
            </div>
          </Card>

          <Card
            className="p-8 border-0 shadow-xl cursor-pointer hover:scale-105 transition-transform min-h-[200px]"
            style={{ backgroundColor: "#343941" }}
            onClick={() => router.push("/walk-in")}
          >
            <div className="text-center space-y-6">
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#9469E9" }}
              >
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Walk-In</h2>
              <p className="text-xl" style={{ color: "#C9CCD1" }}>
                I don't have an appointment
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
