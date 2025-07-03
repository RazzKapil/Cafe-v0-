import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verify OTP
    const { data: otpRecord } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", phone)
      .eq("otp", otp)
      .eq("is_used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    // Mark OTP as used
    await supabase.from("otp_verifications").update({ is_used: true }).eq("id", otpRecord.id)

    // Update user verification status
    const { data: user } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("phone", phone)
      .select()
      .single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set(
      "user_session",
      JSON.stringify({
        userId: user.id,
        phone: user.phone,
        verified: true,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    )

    return NextResponse.json({
      message: "Verification successful",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        is_verified: user.is_verified,
      },
    })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
