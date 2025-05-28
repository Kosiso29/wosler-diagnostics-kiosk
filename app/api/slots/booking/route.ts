import { type NextRequest, NextResponse } from "next/server"

// Get today's date in ISO format
const today = new Date().toISOString().split("T")[0]

// Mock booking data with today's dates
const mockBookings = [
  {
    id: 548,
    roomId: 1,
    room: {
      clinic: {
        name: "Wosler Diagnostics Downtown",
        nexusNumber: "8547965896",
      },
    },
    patient: {
      firstName: "Jane",
      lastName: "Doe",
      phoneNumber: "+14587458796",
      birthDate: "1995-09-06T00:00:00.000Z",
      Healthcard: "ontario-8547961250-AB",
    },
    startTimeStamp: `${today}T13:00:00Z`,
    endTimeStamp: `${today}T13:29:00Z`,
    service: { service: "Elbow (R)" },
    operator: { name: "Blow, Joe" },
    bookingReference: "530",
  },
  {
    id: 549,
    roomId: 1,
    room: {
      clinic: {
        name: "Wosler Diagnostics Downtown",
        nexusNumber: "8547965896",
      },
    },
    patient: {
      firstName: "Jane",
      lastName: "Doe",
      phoneNumber: "+14587458796",
      birthDate: "1995-09-06T00:00:00.000Z",
      Healthcard: "ontario-8547961250-AB",
    },
    startTimeStamp: `${today}T15:00:00Z`,
    endTimeStamp: `${today}T15:29:00Z`,
    service: { service: "Knee (L)" },
    operator: { name: "Smith, Mary" },
    bookingReference: "531",
  },
  {
    id: 550,
    roomId: 2,
    room: {
      clinic: {
        name: "Wosler Diagnostics North",
        nexusNumber: "8547965896",
      },
    },
    patient: {
      firstName: "John",
      lastName: "Smith",
      phoneNumber: "+14161234567",
      birthDate: "1980-03-15T00:00:00.000Z",
      Healthcard: "ontario-1234567890-CD",
    },
    startTimeStamp: `${today}T10:00:00Z`,
    endTimeStamp: `${today}T10:29:00Z`,
    service: { service: "Chest X-Ray" },
    operator: { name: "Johnson, Bob" },
    bookingReference: "123",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const bookingReference = searchParams.get("bookingReference")
  const patientHCN = searchParams.get("patientHCN")
  const firstName = searchParams.get("firstName")
  const lastName = searchParams.get("lastName")
  const patientDOB = searchParams.get("patientDOB")
  const date = searchParams.get("date")
  const nexusNumber = searchParams.get("nexusNumber")
  const phone = searchParams.get("phone")

  // Simulate 5xx error for testing when bookingReference is "999"
  if (bookingReference === "999") {
    return new Response("Internal Server Error", { status: 500 })
  }

  // Validate nexusNumber is provided
  if (!nexusNumber) {
    return NextResponse.json({ error: "nexusNumber is required" }, { status: 400 })
  }

  let filteredBookings = mockBookings.filter((booking) => booking.room.clinic.nexusNumber === nexusNumber)

  // Filter by booking reference
  if (bookingReference) {
    filteredBookings = filteredBookings.filter((booking) => booking.bookingReference === bookingReference)
  }

  // Filter by health card number
  else if (patientHCN) {
    filteredBookings = filteredBookings.filter((booking) =>
      booking.patient.Healthcard.toLowerCase().includes(patientHCN.toLowerCase()),
    )
  }

  // Filter by personal details
  else if (firstName && lastName && patientDOB && phone) {
    filteredBookings = filteredBookings.filter((booking) => {
      const nameMatch =
        booking.patient.firstName.toLowerCase() === firstName.toLowerCase() &&
        booking.patient.lastName.toLowerCase() === lastName.toLowerCase()
      const dobMatch = booking.patient.birthDate.startsWith(patientDOB)

      // Clean phone numbers for comparison
      const cleanInputPhone = phone.replace(/\D/g, "")
      const cleanStoredPhone = booking.patient.phoneNumber.replace(/\D/g, "")
      const phoneMatch =
        cleanInputPhone === cleanStoredPhone ||
        cleanInputPhone === cleanStoredPhone.slice(-10) ||
        `1${cleanInputPhone}` === cleanStoredPhone

      return nameMatch && dobMatch && phoneMatch
    })
  } else {
    return NextResponse.json({ error: "Missing required search parameters" }, { status: 400 })
  }

  // Filter by date if provided
  if (date) {
    filteredBookings = filteredBookings.filter((booking) => booking.startTimeStamp.startsWith(date))
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json(filteredBookings)
}
