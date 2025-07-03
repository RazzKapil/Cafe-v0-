"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, GraduationCap, IndianRupee } from "lucide-react"
import type { Job } from "@/types"

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs")
      const data = await response.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = (jobId: string) => {
    window.location.href = `/jobs/${jobId}/apply`
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Available Jobs</h2>
        <Badge variant="secondary">{jobs.length} Active Jobs</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.organization} • {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  <span>{job.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <span>Last Date: {new Date(job.last_date).toLocaleDateString()}</span>
                </div>
                {job.application_fee > 0 && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                    <span>Fee: ₹{job.application_fee}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleApply(job.id)} className="flex-1">
                  Apply Now
                </Button>
                {job.external_url && (
                  <Button variant="outline" onClick={() => window.open(job.external_url, "_blank")}>
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600">No jobs available</h3>
          <p className="text-gray-500">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  )
}
