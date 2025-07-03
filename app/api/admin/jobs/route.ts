import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

export async function GET() {
  try {
    const supabase = createServerClient()

    // First, let's try to get the jobs with basic error handling
    const { data: jobs, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      // Return empty array instead of failing
      return NextResponse.json({
        jobs: [],
        error: "Database connection issue",
        details: error.message,
      })
    }

    // Transform jobs safely, handling missing fields
    const transformedJobs = (jobs || []).map((job) => ({
      id: job.id || "",
      title: job.title || "Untitled Job",
      organization: job.organization || "Unknown Organization",
      location: job.location || "Not specified",
      qualification: job.qualification || "Not specified",
      experience: job.experience || "Not specified",
      salary: job.salary || "Not specified",
      lastDate: job.last_date || new Date().toISOString().split("T")[0],
      applicationFee: Number(job.application_fee) || 0,
      description: job.description || "No description available",
      eligibility: Array.isArray(job.eligibility) ? job.eligibility : ["Basic eligibility criteria apply"],
      importantDates: {
        applicationStart:
          job.application_start || job.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        applicationEnd: job.last_date || new Date().toISOString().split("T")[0],
        examDate: job.exam_date || undefined,
      },
      externalUrl: job.external_url || "",
      category: job.category || "Government",
      posts: Number(job.posts) || 1,
    }))

    return NextResponse.json({
      success: true,
      jobs: transformedJobs,
      count: transformedJobs.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        jobs: [],
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

    // Insert with only basic required fields
    const { data: job, error } = await supabase
      .from("jobs")
      .insert({
        title: jobData.title || "New Job",
        organization: jobData.organization || "Organization",
        location: jobData.location || "Location",
        qualification: jobData.qualification || "Qualification required",
        experience: jobData.experience || "Not specified",
        salary: jobData.salary || "Salary not specified",
        last_date: jobData.lastDate || new Date().toISOString().split("T")[0],
        application_fee: Number(jobData.applicationFee) || 0,
        external_url: jobData.externalUrl || "",
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("Job creation error:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create job",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      job,
      message: "Job created successfully",
    })
  } catch (error) {
    console.error("Job creation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
