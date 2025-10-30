import { type NextRequest, NextResponse } from "next/server"
import { format } from "date-fns"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { doctorId, date, timeSlot, fullName, mobile, description } = body

    // Split full name into parts
    const nameParts = fullName.trim().split(" ")
    const firstName = nameParts[0] || ""
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : ""
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""

    // Format dates
    const appointmentDate = format(new Date(date), "yyyy-MM-dd HH:mm")
    const startTime = format(new Date(timeSlot.StartTime), "yyyy-MM-dd HH:mm")
    const endTime = format(new Date(timeSlot.EndTime), "yyyy-MM-dd HH:mm:ss.SSS")

    const appointmentData = {
      DoctorID: doctorId.toString(),
      AppDate: appointmentDate,
      Patient: fullName,
      PatientID: "9999",
      MobileNo: mobile,
      UpdatedBy: "2",
      RoomID: "3",
      AppointmentReasonsID: "5",
      StDate: startTime,
      EndDate: endTime,
      Description: description || "Appointment",
      NonArabic: "1",
      HowToKnow: "4",
      StatusID: "1",
      BranchID: "22",
      Fname: firstName,
      MName: middleName,
      LName: lastName,
    }

    const response = await fetch(`${API_BASE_URL}/api/ApiAppointmentController/AddAppointmentForWeb`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "EngMostafaSafwat",
      },
      body: JSON.stringify(appointmentData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", errorText)
      throw new Error("Failed to book appointment")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Book appointment API error:", error)
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 })
  }
}
