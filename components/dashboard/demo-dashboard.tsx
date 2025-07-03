"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, GraduationCap, IndianRupee, Users, Search, Database } from "lucide-react"

interface DemoJob {
  id: string
  title: string
  organization: string
  location: string
  qualification: string
  experience: string
  salary: string
  lastDate: string
  applicationFee: number
  externalUrl: string
  description: string
  eligibility: string[]
  category: string
  posts: number
}

export function DemoDashboard() {
  const [jobs, setJobs] = useState<DemoJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/demo/jobs")
      const data = await response.json()
      if (data.success) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      // Fallback to hardcoded data
      setJobs([
        {
          id: "fallback-1",
          title: "Sample Government Job",
          organization: "Government Department",
          location: "All India",
          qualification: "Graduate",
          experience: "0-2 years",
          salary: "₹25,000 - ₹30,000",
          lastDate: "2024-03-30",
          applicationFee: 200,
          externalUrl: "",
          description: "Sample job description",
          eligibility: ["Basic eligibility criteria"],
          category: "Government",
          posts: 100,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
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
      <div className="space-y-6">
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Government Job Listings</h2>
          <p className="text-gray-600">Latest opportunities available</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {jobs.length} Active Jobs
        </Badge>
      </div>

      {/* Demo Mode Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode:</strong> This is a demonstration of the job portal. In production, jobs would be fetched
          from live government job sites.
        </AlertDescription>
      </Alert>

      {/* Job Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => {
          const daysLeft = getDaysLeft(job.lastDate)
          const isUrgent = daysLeft <= 7

          return (
            <Card
              key={job.id}
              className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                isUrgent ? "border-l-red-500 bg-red-50" : "border-l-blue-500"
              }`}
              onClick={() => {
                alert(`In production, this would open the job application form for: ${job.title}`)
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg line-clamp-2 hover:text-blue-600">{job.title}</CardTitle>
                  <Badge variant={isUrgent ? "destructive" : "secondary"} className="text-xs">
                    {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.organization} • {job.location}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span className="line-clamp-1">{job.qualification}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-600" />
                    <span>Last Date: {formatDate(job.lastDate)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <span>{job.posts} Posts</span>
                  </div>

                  {job.applicationFee > 0 && (
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-orange-600" />
                      <span>Fee: ₹{job.applicationFee}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {job.category}
                  </Badge>
                  <div className="text-sm font-semibold text-green-600">{job.salary}</div>
                </div>

                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    alert(`Demo: Application form would open for ${job.title}`)
                  }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs found</h3>
            <p className="text-gray-500">Check back later for new opportunities</p>
          </div>
        </div>
      )}
    </div>
  )
}
