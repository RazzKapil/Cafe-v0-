"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  MapPin,
  GraduationCap,
  IndianRupee,
  Users,
  ExternalLink,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { JobScraperService, type JobListing } from "@/lib/job-scraper"

interface JobDetailViewProps {
  jobId: string
}

export function JobDetailView({ jobId }: JobDetailViewProps) {
  const [job, setJob] = useState<JobListing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobDetails()
  }, [jobId])

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true)
      const jobData = await JobScraperService.fetchJobById(jobId)
      if (jobData) {
        setJob(jobData)
      } else {
        setError("Job not found")
      }
    } catch (error) {
      console.error("Error fetching job details:", error)
      setError("Failed to load job details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyClick = () => {
    window.location.href = `/jobs/${jobId}/apply`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getDaysLeft = (dateString: string) => {
    const today = new Date()
    const lastDate = new Date(dateString)
    const diffTime = lastDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Job not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const daysLeft = getDaysLeft(job.lastDate)
  const isUrgent = daysLeft <= 7
  const isExpired = daysLeft < 0

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => window.history.back()} className="bg-transparent">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
              <CardDescription className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {job.organization} • {job.location}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge
                variant={isExpired ? "destructive" : isUrgent ? "destructive" : "secondary"}
                className="text-sm mb-2"
              >
                {isExpired ? "Expired" : `${daysLeft} days left`}
              </Badge>
              <div className="text-lg font-bold text-green-600">{job.salary}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Info */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{job.posts}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <IndianRupee className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">₹{job.applicationFee}</div>
                <div className="text-sm text-gray-600">Application Fee</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-lg font-bold">{formatDate(job.lastDate).split(" ")[0]}</div>
                <div className="text-sm text-gray-600">Last Date</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-lg font-bold">{job.category}</div>
                <div className="text-sm text-gray-600">Category</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold">Education</div>
                    <div className="text-gray-700">{job.qualification}</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  {job.eligibility.map((criteria, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{criteria}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Application Start</span>
                  <span className="text-gray-700">{formatDate(job.importantDates.applicationStart)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Application End</span>
                  <span className="text-gray-700">{formatDate(job.importantDates.applicationEnd)}</span>
                </div>
                {job.importantDates.examDate && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Exam Date</span>
                      <span className="text-gray-700">{formatDate(job.importantDates.examDate)}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Apply Section */}
          <Card className={isExpired ? "opacity-60" : ""}>
            <CardHeader>
              <CardTitle>Apply for this Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isExpired ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Application deadline has passed</AlertDescription>
                </Alert>
              ) : (
                <>
                  {isUrgent && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Hurry!</strong> Only {daysLeft} days left to apply
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Application fee: <strong>₹{job.applicationFee}</strong>
                    </div>
                    <Button onClick={handleApplyClick} className="w-full" size="lg">
                      Apply Now
                    </Button>
                  </div>
                </>
              )}

              <Button
                variant="outline"
                onClick={() => window.open(job.externalUrl, "_blank")}
                className="w-full bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Website
              </Button>
            </CardContent>
          </Card>

          {/* Quick Facts */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{job.experience}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{job.location}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <Badge variant="outline">{job.category}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
