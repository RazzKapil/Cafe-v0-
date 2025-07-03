import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"
import { SMSService } from "@/lib/sms-service"

export async function POST(request: NextRequest) {
  try {
    const { name, father_name, mother_name, phone, email } = await request.json()

    // Validate required fields
    if (!name || !father_name || !mother_name || !phone) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 })
    }

    // Validate phone number format
    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("phone", phone).single()

    if (existingUser) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 409 })
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        name,
        father_name,
        mother_name,
        phone,
        email: email || null,
        is_verified: false,
      })
      .select()
      .single()

    if (userError) {
      console.error("User creation error:", userError)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
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
      // Don't fail the registration, just log the error
    }

    return NextResponse.json({
      message: "User registered successfully. OTP sent to your phone.",
      userId: user.id,
      demo_mode: true, // Indicate this is demo mode
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
