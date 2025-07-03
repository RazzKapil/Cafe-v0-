import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: settings, error } = await supabase.from("admin_settings").select("*").limit(1).single()

    // If no settings exist, return default settings
    if (error && error.code === "PGRST116") {
      const defaultSettings = {
        upi_id: "",
        merchant_name: "Cyber Cafe",
        payment_enabled: true,
        email_notifications: true,
        sms_notifications: true,
      }
      return NextResponse.json({ settings: defaultSettings })
    }

    if (error) {
      console.error("Settings fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json()
    const supabase = createServerClient()

    const { data: settings, error } = await supabase.from("admin_settings").upsert(settingsData).select().single()

    if (error) {
      console.error("Settings update error:", error)
      return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
