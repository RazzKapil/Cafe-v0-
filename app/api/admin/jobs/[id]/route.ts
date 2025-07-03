import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobData = await request.json()
    const supabase = createServerClient()

    const { data: job, error } = await supabase
      .from("jobs")
      .update({
        title: jobData.title,
        organization: jobData.organization,
        location: jobData.location,
        qualification: jobData.qualification,
        experience: jobData.experience,
        salary: jobData.salary,
        last_date: jobData.lastDate,
        application_fee: jobData.applicationFee,
        description: jobData.description,
        eligibility: jobData.eligibility,
        external_url: jobData.externalUrl,
        category: jobData.category,
        posts: jobData.posts,
        application_start: jobData.importantDates?.applicationStart,
        exam_date: jobData.importantDates?.examDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Job update error:", error)
      return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error("Job update API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.from("jobs").delete().eq("id", params.id)

    if (error) {
      console.error("Job deletion error:", error)
      return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
    }

    return NextResponse.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Job deletion API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
