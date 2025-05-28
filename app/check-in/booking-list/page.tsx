"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react"

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

export default function BookingList() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])

  useIdleTimer(() => {
    router.push("/")
  }, 45000)

  useEffect(() => {
    const storedBookings = sessionStorage.getItem("bookings")
    if (storedBookings) {
      const allBookings = JSON.parse(storedBookings)
      // Filter for today's bookings and sort by time
      const today = new Date().toISOString().split("T")[0]
      const todaysBookings = allBookings
        .filter((booking: Booking) => booking.startTimeStamp.startsWith(today))
        .sort((a: Booking, b: Booking) => new Date(a.startTimeStamp).getTime() - new Date(b.startTimeStamp).getTime())

      setBookings(todaysBookings)
    } else {
      router.push("/check-in")
    }
  }, [router])

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

  const handleSelectBooking = (booking: Booking) => {
    sessionStorage.setItem("selectedBooking", JSON.stringify(booking))
    router.push(`/check-in/verify/${booking.id}`)
  }

  const handleCheckInAll = () => {
    // For multiple bookings, we'll check them in one by one
    router.push("/check-in/check-in-all")
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#2B2F36" }}>
      <div className="max-w-4xl mx-auto">
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

          <h1 className="text-3xl font-bold text-white">Your Appointments Today</h1>

          <div className="w-24" />
        </div>

        {bookings.length === 0 ? (
          <Card className="p-8 border-0 shadow-xl text-center" style={{ backgroundColor: "#343941" }}>
            <p className="text-xl text-white">No appointments found for today.</p>
            <p className="text-lg mt-2" style={{ color: "#C9CCD1" }}>
              Please see the front desk for assistance.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.length > 1 && (
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleCheckInAll}
                  className="h-16 text-xl font-semibold px-8"
                  style={{ backgroundColor: "#9469E9" }}
                >
                  Check In for All Appointments
                </Button>
              </div>
            )}

            <div className="grid gap-4">
              {bookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="p-6 border-0 shadow-xl cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: "#343941" }}
                  onClick={() => handleSelectBooking(booking)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#9469E9" }}
                        >
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{booking.service.service}</h3>
                          <p className="text-lg" style={{ color: "#C9CCD1" }}>
                            Ref: {booking.bookingReference}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5" style={{ color: "#C9CCD1" }} />
                          <span style={{ color: "#C9CCD1" }}>
                            {formatTime(booking.startTimeStamp)} - {formatTime(booking.endTimeStamp)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5" style={{ color: "#C9CCD1" }} />
                          <span style={{ color: "#C9CCD1" }}>{booking.room.clinic.name}</span>
                        </div>

                        <div style={{ color: "#C9CCD1" }}>Operator: {booking.operator.name}</div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="h-12 text-lg font-semibold"
                      style={{ backgroundColor: "#9469E9" }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectBooking(booking)
                      }}
                    >
                      Check In
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
