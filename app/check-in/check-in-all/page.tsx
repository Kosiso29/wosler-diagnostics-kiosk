"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Calendar, Clock, Loader2, CheckCircle } from "lucide-react"
import { Modal } from "@/components/modal"

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

export default function CheckInAll() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [checkedInBookings, setCheckedInBookings] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  useEffect(() => {
    const storedBookings = sessionStorage.getItem("bookings")
    if (storedBookings) {
      const allBookings = JSON.parse(storedBookings)

      // Filter for today's bookings and valid check-in time (within 30 mins)
      const today = new Date().toISOString().split("T")[0]
      const now = new Date()

      const validBookings = allBookings
        .filter((booking: Booking) => {
          // Check if booking is today
          if (!booking.startTimeStamp.startsWith(today)) return false

          // Check if booking is not in the past and within 30 mins
          const appointmentTime = new Date(booking.startTimeStamp)
          const timeDiff = appointmentTime.getTime() - now.getTime()
          const minutesDiff = timeDiff / (1000 * 60)

          return minutesDiff >= 0 && minutesDiff <= 30
        })
        .sort((a: Booking, b: Booking) => new Date(a.startTimeStamp).getTime() - new Date(b.startTimeStamp).getTime())

      setBookings(validBookings)

      if (validBookings.length === 0) {
        setModalTitle("No Valid Appointments")
        setModalMessage(
          "There are no appointments available for check-in at this time. Appointments are only available for check-in within 30 minutes of the scheduled time.",
        )
        setModalOpen(true)
        setTimeout(() => router.push("/check-in/booking-list"), 3000)
      }
    } else {
      router.push("/check-in")
    }
  }, [router])

  useEffect(() => {
    if (isComplete) {
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
  }, [isComplete, router])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleCheckInAll = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Process each booking sequentially
      for (const booking of bookings) {
        // Skip if already checked in
        if (checkedInBookings.includes(booking.id)) continue

        const response = await fetch("/api/slots/checkin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId: booking.id }),
        })

        if (!response.ok) {
          throw new Error(`Failed to check in booking ${booking.id}`)
        }

        // Add to checked in list
        setCheckedInBookings((prev) => [...prev, booking.id])

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setIsComplete(true)
    } catch (error) {
      setError("We're having trouble—please see the front desk or contact 999999999")
      setTimeout(() => router.push("/"), 30000)
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  if (isComplete) {
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

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Appointments:</h2>
              <div className="space-y-2">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800">
                    <div>
                      <p className="text-white font-medium">{booking.service.service}</p>
                      <p style={{ color: "#C9CCD1" }}>{formatTime(booking.startTimeStamp)}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                ))}
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
            onClick={() => router.push("/check-in/booking-list")}
            className="text-white hover:bg-slate-800 min-h-[48px] min-w-[48px]"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-white">Check In All</h1>

          <div className="w-24" />
        </div>

        <Card className="p-8 border-0 shadow-xl" style={{ backgroundColor: "#343941" }}>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Check In</h2>
              <p className="text-lg" style={{ color: "#C9CCD1" }}>
                The following appointments are available for check-in:
              </p>
            </div>

            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center p-4 rounded-lg bg-slate-800">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#9469E9" }}
                    >
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{booking.service.service}</h3>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" style={{ color: "#C9CCD1" }} />
                        <span style={{ color: "#C9CCD1" }}>{formatTime(booking.startTimeStamp)}</span>
                      </div>
                    </div>
                  </div>
                  {checkedInBookings.includes(booking.id) && <CheckCircle className="w-6 h-6 text-green-500" />}
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: "#E04F5F", color: "#FFFFFF" }}>
                {error}
              </div>
            )}

            <Button
              onClick={handleCheckInAll}
              size="lg"
              disabled={isLoading || bookings.length === 0 || checkedInBookings.length === bookings.length}
              className="w-full h-16 text-xl font-semibold"
              style={{ backgroundColor: "#9469E9" }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Checking you in...
                </>
              ) : checkedInBookings.length === bookings.length ? (
                "All Checked In"
              ) : (
                "Check In All Appointments"
              )}
            </Button>
          </div>
        </Card>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle} message={modalMessage} autoCloseTime={10} />
    </div>
  )
}
