import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get("date")
    const doctorId = searchParams.get("doctorId")

    if (!date || !doctorId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const response = await fetch(
      `${API_BASE_URL}/api/ApiAppointmentController/GetFreeAppForDr?RequestDate=${date}&DoctorID=${doctorId}&BranchID=22`,
      {
        headers: {
          apikey: "EngMostafaSafwat",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch time slots")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Time slots API error:", error)
    return NextResponse.json({ error: "Failed to fetch time slots" }, { status: 500 })
  }
}
