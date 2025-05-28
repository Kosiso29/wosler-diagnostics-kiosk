import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 })
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, this would update the booking status to 'arrived'
    // For now, we'll just return success
    console.log(`Checking in booking ${bookingId}`)

    return NextResponse.json({
      success: true,
      message: "Patient checked in successfully",
      bookingId,
    })
  } catch (error) {
    console.error("Check-in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
