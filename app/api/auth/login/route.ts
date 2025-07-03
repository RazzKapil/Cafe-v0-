import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"
import { SMSService } from "@/lib/sms-service"

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user exists
    const { data: user } = await supabase.from("users").select("id, is_verified").eq("phone", phone).single()

    if (!user) {
      return NextResponse.json({ error: "Phone number not registered" }, { status: 404 })
    }

    // Generate and send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Delete any existing OTP for this phone
    await supabase.from("otp_verifications").delete().eq("phone", phone)

    const { error: otpError } = await supabase.from("otp_verifications").insert({
      phone,
      otp,
      expires_at: expiresAt.toISOString(),
      is_used: false,
    })

    if (otpError) {
      console.error("OTP creation error:", otpError)
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 })
    }

    // Send SMS
    const smsSent = await SMSService.sendOTP(phone, otp)

    if (!smsSent) {
      console.error("SMS sending failed")
    }

    return NextResponse.json({
      message: "OTP sent successfully",
      userId: user.id,
      demo_mode: true,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
