import { type NextRequest, NextResponse } from "next/server"

// Mock booking data with fixed dates
const mockBookings = [
  // Today's bookings
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
    startTimeStamp: "2025-05-28T13:00:00Z",
    endTimeStamp: "2025-05-28T13:29:00Z",
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
    startTimeStamp: "2025-05-28T15:00:00Z",
    endTimeStamp: "2025-05-28T15:29:00Z",
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
    startTimeStamp: "2025-05-28T10:00:00Z",
    endTimeStamp: "2025-05-28T10:29:00Z",
    service: { service: "Chest X-Ray" },
    operator: { name: "Johnson, Bob" },
    bookingReference: "123",
  },
  // Tomorrow (May 29)
  {
    id: 551,
    roomId: 3,
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
    startTimeStamp: "2025-05-29T09:30:00Z",
    endTimeStamp: "2025-05-29T10:00:00Z",
    service: { service: "MRI - Shoulder" },
    operator: { name: "Williams, Sarah" },
    bookingReference: "532",
  },
  {
    id: 552,
    roomId: 2,
    room: {
      clinic: {
        name: "Wosler Diagnostics East",
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
    startTimeStamp: "2025-05-29T14:15:00Z",
    endTimeStamp: "2025-05-29T14:45:00Z",
    service: { service: "Ultrasound - Abdomen" },
    operator: { name: "Garcia, Carlos" },
    bookingReference: "124",
  },
  // May 30 (Friday)
  {
    id: 553,
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
    startTimeStamp: "2025-05-30T11:00:00Z",
    endTimeStamp: "2025-05-30T11:30:00Z",
    service: { service: "CT Scan - Head" },
    operator: { name: "Thompson, Lisa" },
    bookingReference: "533",
  },
  {
    id: 554,
    roomId: 4,
    room: {
      clinic: {
        name: "Wosler Diagnostics West",
        nexusNumber: "8547965896",
      },
    },
    patient: {
      firstName: "Michael",
      lastName: "Johnson",
      phoneNumber: "+14169876543",
      birthDate: "1975-11-22T00:00:00.000Z",
      Healthcard: "ontario-9876543210-EF",
    },
    startTimeStamp: "2025-05-30T16:00:00Z",
    endTimeStamp: "2025-05-30T16:30:00Z",
    service: { service: "X-Ray - Ankle" },
    operator: { name: "Brown, David" },
    bookingReference: "125",
  },
  // May 31 (Saturday)
  {
    id: 555,
    roomId: 2,
    room: {
      clinic: {
        name: "Wosler Diagnostics Downtown",
        nexusNumber: "8547965896",
      },
    },
    patient: {
      firstName: "Michael",
      lastName: "Johnson",
      phoneNumber: "+14169876543",
      birthDate: "1975-11-22T00:00:00.000Z",
      Healthcard: "ontario-9876543210-EF",
    },
    startTimeStamp: "2025-05-31T10:30:00Z",
    endTimeStamp: "2025-05-31T11:00:00Z",
    service: { service: "Mammogram" },
    operator: { name: "Wilson, Emma" },
    bookingReference: "126",
  },
  // June 1 (Sunday)
  {
    id: 556,
    roomId: 3,
    room: {
      clinic: {
        name: "Wosler Diagnostics North",
        nexusNumber: "8547965896",
      },
    },
    patient: {
      firstName: "Sarah",
      lastName: "Williams",
      phoneNumber: "+14165551234",
      birthDate: "1988-07-14T00:00:00.000Z",
      Healthcard: "ontario-5551234567-GH",
    },
    startTimeStamp: "2025-06-01T13:45:00Z",
    endTimeStamp: "2025-06-01T14:15:00Z",
    service: { service: "Bone Density Scan" },
    operator: { name: "Miller, James" },
    bookingReference: "127",
  },
  // June 2 (Monday)
  {
    id: 557,
    roomId: 1,
    room: {
      clinic: {
        name: "Wosler Diagnostics East",
        nexusNumber: "8547965896",
      },
    },
    patient: {
      firstName: "Sarah",
      lastName: "Williams",
      phoneNumber: "+14165551234",
      birthDate: "1988-07-14T00:00:00.000Z",
      Healthcard: "ontario-5551234567-GH",
    },
    startTimeStamp: "2025-06-02T09:00:00Z",
    endTimeStamp: "2025-06-02T09:30:00Z",
    service: { service: "MRI - Knee" },
    operator: { name: "Davis, Robert" },
    bookingReference: "128",
  },
  {
    id: 558,
    roomId: 2,
    room: {
      clinic: {
        name: "Wosler Diagnostics Downtown",
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
    startTimeStamp: "2025-06-02T15:30:00Z",
    endTimeStamp: "2025-06-02T16:00:00Z",
    service: { service: "Ultrasound - Thyroid" },
    operator: { name: "Martinez, Ana" },
    bookingReference: "129",
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
