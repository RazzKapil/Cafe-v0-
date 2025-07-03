import { JobApplicationForm } from "@/components/jobs/job-application-form"

interface JobApplicationPageProps {
  params: { id: string }
}

export default function JobApplicationPage({ params }: JobApplicationPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <JobApplicationForm jobId={params.id} />
    </div>
  )
}
