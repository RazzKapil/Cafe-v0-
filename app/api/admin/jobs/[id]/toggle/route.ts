import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { isActive } = await request.json()
    const supabase = createServerClient()

    const { data: job, error } = await supabase
      .from("jobs")
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Job status update error:", error)
      return NextResponse.json({ error: "Failed to update job status" }, { status: 500 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error("Job status API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
