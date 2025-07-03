import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("is_active", true)
      .gte("last_date", new Date().toISOString().split("T")[0])
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Jobs fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
    }

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Jobs API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json()
    const supabase = createServerClient()

    const { data: job, error } = await supabase.from("jobs").insert(jobData).select().single()

    if (error) {
      console.error("Job creation error:", error)
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error("Job creation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
