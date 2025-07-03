import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    if (usersError) {
      console.error("Error fetching users count:", usersError)
    }

    // Get total applications count
    const { count: totalApplications, error: applicationsError } = await supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })

    if (applicationsError) {
      console.error("Error fetching applications count:", applicationsError)
    }

    // Get total completed payments count
    const { count: totalPayments, error: paymentsError } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")

    if (paymentsError) {
      console.error("Error fetching payments count:", paymentsError)
    }

    // Get pending payments count
    const { count: pendingPayments, error: pendingError } = await supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    if (pendingError) {
      console.error("Error fetching pending payments count:", pendingError)
    }

    const stats = {
      totalUsers: totalUsers || 0,
      totalApplications: totalApplications || 0,
      totalPayments: totalPayments || 0,
      pendingPayments: pendingPayments || 0,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
