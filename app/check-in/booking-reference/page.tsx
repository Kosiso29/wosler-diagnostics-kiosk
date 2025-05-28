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

export default function BookingReference() {
  const router = useRouter()
  const [bookingRef, setBookingRef] = useState("")
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

    // Validate booking reference: 3-10 digits only
    const digitRegex = /^\d{3,10}$/
    if (!bookingRef || !digitRegex.test(bookingRef)) {
      setError("Please enter the digits found on your confirmation.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/slots/booking?bookingReference=${bookingRef}&nexusNumber=8547965896`)

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

      // Store booking data and navigate to verification/booking list
      sessionStorage.setItem("bookings", JSON.stringify(bookings))
      sessionStorage.setItem("searchMethod", "bookingReference")

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

          <h1 className="text-3xl font-bold text-white">Enter Booking Reference</h1>

          <div className="w-24" />
        </div>

        <Card className="p-8 border-0 shadow-xl" style={{ backgroundColor: "#343941" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="bookingRef" className="text-xl font-medium text-white">
                Booking Reference Number
              </Label>
              <Input
                id="bookingRef"
                type="text"
                value={bookingRef}
                onChange={(e) => setBookingRef(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter your booking reference"
                className="text-2xl h-16 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                maxLength={10}
                autoFocus
              />
              <p className="text-sm" style={{ color: "#C9CCD1" }}>
                This is the number found on your appointment confirmation
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
              disabled={isLoading || !bookingRef}
              className="w-full h-16 text-xl font-semibold"
              style={{ backgroundColor: "#9469E9" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Finding your appointment...
                </>
              ) : (
                "Find My Appointment"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
