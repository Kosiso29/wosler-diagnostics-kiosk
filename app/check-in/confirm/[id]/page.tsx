"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Loader2, CheckCircle, Calendar, Clock, MapPin } from "lucide-react"

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

export default function ConfirmCheckIn() {
  const router = useRouter()
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(15)

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  useEffect(() => {
    const storedBookings = sessionStorage.getItem("bookings")

    if (storedBookings) {
      const bookings = JSON.parse(storedBookings)
      const currentBooking = bookings.find((b: Booking) => b.id === Number.parseInt(params.id as string))

      if (currentBooking) {
        setBooking(currentBooking)
      } else {
        router.push("/check-in")
      }
    } else {
      router.push("/check-in")
    }
  }, [params.id, router])

  useEffect(() => {
    if (isCheckedIn) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            router.push("/")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isCheckedIn, router])

  const handleCheckIn = async () => {
    if (!booking) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/slots/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId: booking.id }),
      })

      if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
          setError("Unable to check in. Please see the front desk for assistance.")
        } else {
          setError("We're having trouble—please see the front desk or contact 999999999")
          setTimeout(() => router.push("/"), 30000)
        }
        return
      }

      setIsCheckedIn(true)
    } catch (error) {
      setError("We're having trouble—please see the front desk or contact 999999999")
      setTimeout(() => router.push("/"), 30000)
    } finally {
      setIsLoading(false)
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#2B2F36" }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isCheckedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: "#2B2F36" }}>
        <Card className="w-full max-w-2xl p-12 text-center border-0 shadow-2xl" style={{ backgroundColor: "#343941" }}>
          <div className="space-y-8">
            <div
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#9469E9" }}
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white">You're Checked In!</h1>
              <p className="text-2xl" style={{ color: "#C9CCD1" }}>
                Please have a seat and wait to be called
              </p>
            </div>

            <div className="space-y-4 text-left">
              <h2 className="text-2xl font-bold text-white">Appointment Details:</h2>
              <div className="space-y-2 text-lg">
                <p className="text-white">{booking.service.service}</p>
                <p style={{ color: "#C9CCD1" }}>
                  {formatTime(booking.startTimeStamp)} - {formatTime(booking.endTimeStamp)}
                </p>
                <p style={{ color: "#C9CCD1" }}>{booking.room.clinic.name}</p>
                <p style={{ color: "#C9CCD1" }}>Reference: {booking.bookingReference}</p>
              </div>
            </div>

            <p className="text-lg" style={{ color: "#C9CCD1" }}>
              Returning to home screen in {countdown} second{countdown !== 1 ? "s" : ""}...
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.back()}
            className="text-white hover:bg-slate-800 min-h-[48px] min-w-[48px]"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-white">Confirm Check-In</h1>

          <div className="w-24" />
        </div>

        <div className="space-y-6">
          <Card className="p-8 border-0 shadow-xl" style={{ backgroundColor: "#343941" }}>
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Ready to Check In?</h2>
                <p className="text-xl" style={{ color: "#C9CCD1" }}>
                  Please confirm your appointment details below
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-800">
                  <Calendar className="w-8 h-8" style={{ color: "#9469E9" }} />
                  <div>
                    <h3 className="text-xl font-bold text-white">{booking.service.service}</h3>
                    <p style={{ color: "#C9CCD1" }}>Reference: {booking.bookingReference}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800">
                    <Clock className="w-6 h-6" style={{ color: "#9469E9" }} />
                    <div>
                      <p className="text-white font-medium">Time</p>
                      <p style={{ color: "#C9CCD1" }}>
                        {formatTime(booking.startTimeStamp)} - {formatTime(booking.endTimeStamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-slate-800">
                    <MapPin className="w-6 h-6" style={{ color: "#9469E9" }} />
                    <div>
                      <p className="text-white font-medium">Location</p>
                      <p style={{ color: "#C9CCD1" }}>{booking.room.clinic.name}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-slate-800">
                  <p className="text-white font-medium">Operator</p>
                  <p style={{ color: "#C9CCD1" }}>{booking.operator.name}</p>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#E04F5F", color: "#FFFFFF" }}>
                  {error}
                </div>
              )}

              <Button
                onClick={handleCheckIn}
                size="lg"
                disabled={isLoading}
                className="w-full h-16 text-xl font-semibold"
                style={{ backgroundColor: "#9469E9" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Checking you in...
                  </>
                ) : (
                  "Check In Now"
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
