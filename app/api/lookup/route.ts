import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ApiLookUpController/GetLookupCalenderForWeb?branchId=22`, {
      headers: {
        apikey: "EngMostafaSafwat",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch lookup data")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Lookup API error:", error)
    return NextResponse.json({ error: "Failed to fetch lookup data" }, { status: 500 })
  }
}
