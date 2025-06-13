"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { ArrowLeft, Calendar, Clock, AlertCircle } from "lucide-react"
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

type AppointmentStatus = "past" | "current" | "future" | "valid"

export default function BookingList() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
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

      // Filter for today's bookings only
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

  const getAppointmentStatus = (booking: Booking): AppointmentStatus => {
    const now = new Date()
    const appointmentTime = new Date(booking.startTimeStamp)
    const timeDiff = appointmentTime.getTime() - now.getTime()
    const minutesDiff = timeDiff / (1000 * 60)

    // Past appointment (start time has passed)
    if (minutesDiff < 0) {
      return "past"
    }

    // Future appointment (more than 30 minutes away)
    if (minutesDiff > 30) {
      return "future"
    }

    // Current appointment (within 30 minutes)
    return "valid"
  }

  const handleSelectBooking = (booking: Booking) => {
    const status = getAppointmentStatus(booking)

    if (status === "past") {
      setModalTitle("Appointment Has Passed")
      setModalMessage(
        "This appointment has passed. If you are still looking to get this service, please contact 999999999.",
      )
      setModalOpen(true)
      return
    }

    if (status === "future") {
      setModalTitle("Early Check-in")
      setModalMessage(
        "We cannot check in later than 30 mins from the scheduled time. Kindly check in within 30 mins of the appointment.",
      )
      setModalOpen(true)
      return
    }

    // Valid appointment - proceed with check-in
    sessionStorage.setItem("selectedBooking", JSON.stringify(booking))
    router.push(`/check-in/verify/${booking.id}`)
  }

  const closeModal = () => {
    setModalOpen(false)
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
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
                {bookings.map((booking) => {
                  const status = getAppointmentStatus(booking)
                  const isPast = status === "past"
                  const isFuture = status === "future"
                  const isDisabled = isPast || isFuture

                  return (
                    <Card
                      key={booking.id}
                      className={`p-6 border-0 shadow-xl min-w-[300px] max-w-[300px] ${
                        isDisabled ? "opacity-70" : "hover:scale-105 transition-transform cursor-pointer"
                      }`}
                      style={{ backgroundColor: "#343941" }}
                      onClick={() => !isDisabled && handleSelectBooking(booking)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: isDisabled ? "#6B7280" : "#9469E9" }}
                          >
                            {isPast ? (
                              <AlertCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Calendar className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{booking.service.service}</h3>
                            <p className="text-sm" style={{ color: "#C9CCD1" }}>
                              Ref: {booking.bookingReference}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" style={{ color: "#C9CCD1" }} />
                            <span style={{ color: "#C9CCD1" }}>{formatTime(booking.startTimeStamp)}</span>
                          </div>

                          <div style={{ color: "#C9CCD1" }}>Operator: {booking.operator.name}</div>
                        </div>

                        <Button
                          size="sm"
                          className={`w-full h-10 text-base font-semibold ${
                            isDisabled ? "bg-gray-500 cursor-not-allowed" : ""
                          }`}
                          style={{ backgroundColor: isDisabled ? "#6B7280" : "#9469E9" }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectBooking(booking)
                          }}
                          disabled={isDisabled}
                        >
                          {isPast ? "Missed" : isFuture ? "Too Early" : "Check In"}
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={modalTitle} message={modalMessage} autoCloseTime={10} />
    </div>
  )
}
