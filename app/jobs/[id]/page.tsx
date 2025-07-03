import { JobDetailView } from "@/components/jobs/job-detail-view"

interface JobDetailPageProps {
  params: { id: string }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <JobDetailView jobId={params.id} />
    </div>
  )
}
