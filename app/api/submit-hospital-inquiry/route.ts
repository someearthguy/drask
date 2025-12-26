import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] Hospital inquiry API called")
    const body = await request.json()
    console.log("[v0] Request body:", body)
    const { hospitalName, contactPerson, email, phone, city, message } = body

    // Basic validation
    if (!hospitalName || !contactPerson || !email || !phone || !city || !message) {
      console.log("[v0] Validation failed - missing fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    console.log("[v0] Creating Supabase client")
    const supabase = await createServerClient()

    console.log("[v0] Inserting into hospital_inquiries table")
    const { data, error } = await supabase
      .from("hospital_inquiries")
      .insert([
        {
          hospital_name: hospitalName,
          contact_person: contactPerson,
          email,
          phone,
          city,
          message,
          source: "website",
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: error.message || "Failed to submit inquiry" }, { status: 500 })
    }

    console.log("[v0] Successfully inserted:", data)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
