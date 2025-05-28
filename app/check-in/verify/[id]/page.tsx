"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Loader2 } from "lucide-react"

interface Booking {
  id: number
  startTimeStamp: string
  endTimeStamp: string
  service: { service: string }
  operator: { name: string }
  room: { clinic: { name: string } }
  patient: {
    firstName: string
    lastName: string
    phoneNumber: string
    birthDate: string
    Healthcard: string
  }
  bookingReference: string
}

export default function VerifyBooking() {
  const router = useRouter()
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [verificationMethod, setVerificationMethod] = useState<"phone" | "hcn" | null>(null)
  const [verificationValue, setVerificationValue] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchMethod, setSearchMethod] = useState("")

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  useEffect(() => {
    const storedBookings = sessionStorage.getItem("bookings")
    const storedSearchMethod = sessionStorage.getItem("searchMethod")
    const providedHCN = sessionStorage.getItem("providedHCN")
    const providedPhone = sessionStorage.getItem("providedPhone")

    if (storedBookings && storedSearchMethod) {
      setSearchMethod(storedSearchMethod)
      const bookings = JSON.parse(storedBookings)
      const currentBooking = bookings.find((b: Booking) => b.id === Number.parseInt(params.id as string))

      if (currentBooking) {
        setBooking(currentBooking)

        // Check if verification is needed
        if (storedSearchMethod === "bookingReference") {
          // Need to verify either phone or HCN
          setVerificationMethod("phone")
        } else if (storedSearchMethod === "personalDetails") {
          // Phone already provided, need to verify HCN
          if (providedPhone) {
            setVerificationMethod("hcn")
          } else {
            setVerificationMethod("phone")
          }
        } else if (storedSearchMethod === "healthCard" && providedHCN) {
          // HCN already provided, check if phone verification needed
          // For now, proceed directly to check-in
          router.push(`/check-in/confirm/${currentBooking.id}`)
        }
      } else {
        router.push("/check-in")
      }
    } else {
      router.push("/check-in")
    }
  }, [params.id, router])

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!verificationValue) {
      setError("Please enter the verification information.")
      return
    }

    // Validate based on verification method
    if (verificationMethod === "phone") {
      // Validate phone number (E.164 or 10 digits)
      const cleanPhone = verificationValue.replace(/\D/g, "")
      const phoneRegex = /^(\+?1)?[0-9]{10}$/
      const isValidPhone =
        phoneRegex.test(cleanPhone) ||
        phoneRegex.test(`+1${cleanPhone}`) ||
        (cleanPhone.length === 10 && /^\d{10}$/.test(cleanPhone))

      if (!isValidPhone) {
        setError("Please enter a valid phone number.")
        return
      }
    } else if (verificationMethod === "hcn") {
      // Validate health card: 8-12 alphanumeric characters
      const hcnRegex = /^[A-Za-z0-9]{8,12}$/
      if (!hcnRegex.test(verificationValue)) {
        setError("Health Card number must be 8–12 alphanumeric characters.")
        return
      }
    }

    if (!booking) return

    // Validate the verification value against the booking
    let isValid = false

    if (verificationMethod === "phone") {
      // Clean phone numbers for comparison
      const cleanInput = verificationValue.replace(/\D/g, "")
      const cleanStored = booking.patient.phoneNumber.replace(/\D/g, "")
      isValid = cleanInput === cleanStored || cleanInput === cleanStored.slice(-10)
    } else if (verificationMethod === "hcn") {
      isValid = verificationValue.toUpperCase() === booking.patient.Healthcard.toUpperCase()
    }

    if (!isValid) {
      setError("Try again")
      return
    }

    // Verification successful, proceed to check-in
    router.push(`/check-in/confirm/${booking.id}`)
  }

  const switchVerificationMethod = () => {
    setVerificationMethod(verificationMethod === "phone" ? "hcn" : "phone")
    setVerificationValue("")
    setError("")
  }

  const handleBack = () => {
    // Navigate back based on search method and whether there are multiple bookings
    const storedBookings = sessionStorage.getItem("bookings")
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings)
      if (bookings.length > 1) {
        router.push("/check-in/booking-list")
      } else {
        // Single booking, go back to the search method used
        if (searchMethod === "bookingReference") {
          router.push("/check-in/booking-reference")
        } else if (searchMethod === "healthCard") {
          router.push("/check-in/health-card")
        } else if (searchMethod === "personalDetails") {
          router.push("/check-in/personal-details")
        } else {
          router.push("/check-in")
        }
      }
    } else {
      router.push("/check-in")
    }
  }

  if (!booking || !verificationMethod) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#2B2F36" }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Only show appointment details if NOT coming from booking reference
  const showAppointmentDetails = searchMethod !== "bookingReference"

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleBack}
            className="text-white hover:bg-slate-800 min-h-[48px] min-w-[48px]"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-white">Verify Your Identity</h1>

          <div className="w-24" />
        </div>

        <div className="space-y-6">
          {/* Booking Summary - Only show if NOT from booking reference */}
          {showAppointmentDetails && (
            <Card className="p-6 border-0 shadow-xl" style={{ backgroundColor: "#343941" }}>
              <h2 className="text-2xl font-bold text-white mb-4">Your Appointment</h2>
              <div className="space-y-2">
                <p className="text-lg text-white">{booking.service.service}</p>
                <p style={{ color: "#C9CCD1" }}>
                  {new Date(booking.startTimeStamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  -{" "}
                  {new Date(booking.endTimeStamp).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p style={{ color: "#C9CCD1" }}>{booking.room.clinic.name}</p>
                <p style={{ color: "#C9CCD1" }}>Operator: {booking.operator.name}</p>
              </div>
            </Card>
          )}

          {/* Verification Form */}
          <Card className="p-8 border-0 shadow-xl" style={{ backgroundColor: "#343941" }}>
            <form onSubmit={handleVerification} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="verification" className="text-xl font-medium text-white">
                  {verificationMethod === "phone" ? "Phone Number" : "Health Card Number"}
                </Label>
                <Input
                  id="verification"
                  type="text"
                  value={verificationValue}
                  onChange={(e) => {
                    if (verificationMethod === "hcn") {
                      setVerificationValue(e.target.value.toUpperCase())
                    } else {
                      setVerificationValue(e.target.value)
                    }
                  }}
                  placeholder={
                    verificationMethod === "phone" ? "Enter your phone number" : "Enter your health card number"
                  }
                  className="text-2xl h-16 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
                  maxLength={verificationMethod === "hcn" ? 12 : undefined}
                  autoFocus
                />
                <p className="text-sm" style={{ color: "#C9CCD1" }}>
                  Please enter your {verificationMethod === "phone" ? "phone number" : "health card number"} to verify
                  your identity
                </p>
              </div>

              {error && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#E04F5F", color: "#FFFFFF" }}>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading || !verificationValue}
                  className="w-full h-16 text-xl font-semibold"
                  style={{ backgroundColor: "#9469E9" }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify and Continue"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={switchVerificationMethod}
                  className="w-full h-12 text-lg bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white"
                >
                  Use {verificationMethod === "phone" ? "Health Card" : "Phone Number"} Instead
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
