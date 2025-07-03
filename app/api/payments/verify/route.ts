import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { applicationId, transactionId, amount } = await request.json()

    if (!applicationId || !transactionId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get application details
    const { data: application } = await supabase
      .from("job_applications")
      .select("*, users(*)")
      .eq("id", applicationId)
      .single()

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: application.user_id,
        application_id: applicationId,
        amount,
        payment_method: "UPI",
        transaction_id: transactionId,
        status: "completed",
      })
      .select()
      .single()

    if (paymentError) {
      console.error("Payment creation error:", paymentError)
      return NextResponse.json({ error: "Failed to record payment" }, { status: 500 })
    }

    // Update application payment status
    await supabase
      .from("job_applications")
      .update({
        payment_status: "completed",
        payment_id: payment.id,
      })
      .eq("id", applicationId)

    // Send confirmation (email/SMS)
    // This would integrate with your notification service

    return NextResponse.json({
      message: "Payment verified successfully",
      payment,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
