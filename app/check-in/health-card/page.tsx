"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function HealthCard() {
  const router = useRouter()
  const [healthCard, setHealthCard] = useState("")
  const [date, setDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  // Handle countdown for 5xx errors
  useEffect(() => {
    if (redirectCountdown === null) return

    if (redirectCountdown <= 0) {
      router.push("/")
      return
    }

    const timer = setTimeout(() => {
      setRedirectCountdown(redirectCountdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [redirectCountdown, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setRedirectCountdown(null)

    // Validate health card: 8-12 alphanumeric characters
    const hcnRegex = /^[A-Za-z0-9]{8,12}$/
    if (!healthCard || !hcnRegex.test(healthCard)) {
      setError("Health Card number must be 8–12 alphanumeric characters.")
      return
    }

    setIsLoading(true)

    try {
      let url = `/api/slots/booking?patientHCN=${healthCard}&nexusNumber=8547965896`
      if (date) {
        url += `&date=${date}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          setError("Data not found - Please see the front desk or contact 999999999")
        } else {
          setError("We're having trouble—please see the front desk or contact 999999999")
          setRedirectCountdown(30) // Start 30 second countdown
        }
        return
      }

      const bookings = await response.json()

      if (bookings.length === 0) {
        setError("Data not found - Please see the front desk or contact 999999999")
        return
      }

      // Store booking data and navigate
      sessionStorage.setItem("bookings", JSON.stringify(bookings))
      sessionStorage.setItem("searchMethod", "healthCard")
      sessionStorage.setItem("providedHCN", healthCard)

      if (bookings.length === 1) {
        router.push(`/check-in/verify/${bookings[0].id}`)
      } else {
        router.push("/check-in/booking-list")
      }
    } catch (error) {
      setError("We're having trouble—please see the front desk or contact 999999999")
      setRedirectCountdown(30) // Start 30 second countdown
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/check-in")}
            className="text-white hover:bg-slate-800 min-h-[48px] min-w-[48px]"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-white">Health Card Information</h1>

          <div className="w-24" />
        </div>

        <Card className="p-8 border-0 shadow-xl" style={{ backgroundColor: "#343941" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="healthCard" className="text-xl font-medium text-white">
                Health Card Number *
              </Label>
              <Input
                id="healthCard"
                type="text"
                value={healthCard}
                onChange={(e) => setHealthCard(e.target.value.toUpperCase())}
                placeholder="Enter your health card number"
                className="text-2xl h-16 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                maxLength={12}
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="date" className="text-xl font-medium text-white">
                Appointment Date (Optional)
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="text-2xl h-16 bg-slate-800 border-slate-600 text-white"
              />
              <p className="text-sm" style={{ color: "#C9CCD1" }}>
                Leave blank to see all upcoming appointments
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#E04F5F", color: "#FFFFFF" }}>
                {error}
                {redirectCountdown !== null && (
                  <p className="mt-2">Returning to home screen in {redirectCountdown} seconds...</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !healthCard}
              className="w-full h-16 text-xl font-semibold"
              style={{ backgroundColor: "#9469E9" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Finding your appointments...
                </>
              ) : (
                "Find My Appointments"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
