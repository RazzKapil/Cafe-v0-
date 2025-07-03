import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/database"

// Fallback sample data in case database is not accessible
const SAMPLE_JOBS = [
  {
    id: "sample-1",
    title: "Staff Selection Commission - Multi Tasking Staff",
    organization: "Staff Selection Commission",
    location: "All India",
    qualification: "10th Pass",
    experience: "No experience required",
    salary: "₹18,000 - ₹22,000",
    lastDate: "2024-03-15",
    applicationFee: 100,
    externalUrl: "https://ssc.nic.in",
  },
  {
    id: "sample-2",
    title: "Railway Recruitment Board - Assistant Loco Pilot",
    organization: "Indian Railways",
    location: "All India",
    qualification: "ITI/Diploma",
    experience: "0-3 years",
    salary: "₹35,000 - ₹40,000",
    lastDate: "2024-03-20",
    applicationFee: 500,
    externalUrl: "https://rrbcdg.gov.in",
  },
]

export async function GET() {
  try {
    const supabase = createServerClient()

    // Try to connect to database
    const { data: jobs, error } = await supabase
      .from("jobs")
      .select(
        "id, title, organization, location, qualification, experience, salary, last_date, application_fee, external_url, created_at",
      )
      .limit(50)

    if (error) {
      console.log("Database not accessible, using sample data:", error.message)
      // Return sample data if database is not accessible
      return NextResponse.json({
        success: true,
        jobs: SAMPLE_JOBS,
        count: SAMPLE_JOBS.length,
        source: "sample_data",
        message: "Using sample data - database not configured",
      })
    }

    // Transform database jobs
    const transformedJobs = (jobs || []).map((job) => ({
      id: job.id,
      title: job.title || "Untitled Job",
      organization: job.organization || "Unknown",
      location: job.location || "Not specified",
      qualification: job.qualification || "Not specified",
      experience: job.experience || "Not specified",
      salary: job.salary || "Not specified",
      lastDate: job.last_date || new Date().toISOString().split("T")[0],
      applicationFee: Number(job.application_fee) || 0,
      externalUrl: job.external_url || "",
    }))

    return NextResponse.json({
      success: true,
      jobs: transformedJobs.length > 0 ? transformedJobs : SAMPLE_JOBS,
      count: transformedJobs.length > 0 ? transformedJobs.length : SAMPLE_JOBS.length,
      source: transformedJobs.length > 0 ? "database" : "sample_data",
    })
  } catch (error) {
    console.error("API Error:", error)

    // Return sample data as fallback
    return NextResponse.json({
      success: true,
      jobs: SAMPLE_JOBS,
      count: SAMPLE_JOBS.length,
      source: "sample_data",
      error: "Database connection failed, using sample data",
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json()

    // For now, just return success with the data
    // In a real implementation, this would save to database
    const newJob = {
      id: `job-${Date.now()}`,
      ...jobData,
      lastDate: jobData.lastDate || new Date().toISOString().split("T")[0],
      applicationFee: Number(jobData.applicationFee) || 0,
    }

    return NextResponse.json({
      success: true,
      job: newJob,
      message: "Job created successfully (demo mode)",
    })
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create job",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
