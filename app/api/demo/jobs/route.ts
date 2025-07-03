import { NextResponse } from "next/server"

// Demo jobs data
const DEMO_JOBS = [
  {
    id: "demo-1",
    title: "Staff Selection Commission - Multi Tasking Staff",
    organization: "Staff Selection Commission",
    location: "All India",
    qualification: "10th Pass from recognized board",
    experience: "No experience required",
    salary: "₹18,000 - ₹22,000 per month",
    lastDate: "2024-03-15",
    applicationFee: 100,
    externalUrl: "https://ssc.nic.in",
    description: "Staff Selection Commission invites applications for Multi Tasking Staff positions.",
    eligibility: ["Age: 18-25 years", "Education: 10th pass", "Physical fitness required"],
    category: "Central Government",
    posts: 8000,
  },
  {
    id: "demo-2",
    title: "Railway Recruitment Board - Assistant Loco Pilot",
    organization: "Indian Railways",
    location: "All India",
    qualification: "ITI/Diploma in relevant trade",
    experience: "0-3 years experience",
    salary: "₹35,000 - ₹40,000 per month",
    lastDate: "2024-03-20",
    applicationFee: 500,
    externalUrl: "https://rrbcdg.gov.in",
    description: "Indian Railways is recruiting Assistant Loco Pilots for various railway zones.",
    eligibility: ["Age: 18-28 years", "ITI or Diploma required", "Medical fitness required"],
    category: "Railway",
    posts: 5000,
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    jobs: DEMO_JOBS,
    count: DEMO_JOBS.length,
    message: "Demo data loaded successfully",
  })
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Job creation successful (demo mode)",
  })
}
