import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function GET() {
  try {
    const supabase = createServerClient()

    // First, let's check what columns exist in the jobs table
    const { data: jobs, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Jobs fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch jobs", details: error.message }, { status: 500 })
    }

    // Transform jobs to match expected format, handling missing columns gracefully
    const transformedJobs = (jobs || []).map((job) => ({
      id: job.id,
      title: job.title || "Untitled Job",
      organization: job.organization || "Unknown Organization",
      location: job.location || "Not specified",
      qualification: job.qualification || "Not specified",
      experience: job.experience || "Not specified",
      salary: job.salary || "Not specified",
      lastDate: job.last_date || new Date().toISOString().split("T")[0],
      applicationFee: Number(job.application_fee) || 0,
      description: job.description || "No description available",
      eligibility: ["Basic eligibility criteria apply"],
      importantDates: {
        applicationStart: job.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        applicationEnd: job.last_date || new Date().toISOString().split("T")[0],
        examDate: undefined,
      },
      externalUrl: job.external_url || "",
      category: "Government",
      posts: 1,
    }))

    return NextResponse.json({
      success: true,
      jobs: transformedJobs,
      count: transformedJobs.length,
    })
  } catch (error) {
    console.error("Jobs API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json()
    const supabase = createServerClient()

    // Insert with only the columns that exist in the current schema
    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        title: jobData.title,
        organization: jobData.organization,
        location: jobData.location,
        qualification: jobData.qualification,
        experience: jobData.experience || "Not specified",
        salary: jobData.salary,
        last_date: jobData.lastDate,
        application_fee: Number(jobData.applicationFee) || 0,
        external_url: jobData.externalUrl || "",
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Job creation error:", error)
      return NextResponse.json({ error: "Failed to create job", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error("Job creation API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
