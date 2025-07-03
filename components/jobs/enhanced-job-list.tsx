"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, GraduationCap, IndianRupee, Users, Search, Filter } from "lucide-react"
import { JobScraperService, type JobListing } from "@/lib/job-scraper"

export function EnhancedJobList() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchQuery, selectedCategory])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const jobData = await JobScraperService.fetchActiveJobs()
      setJobs(jobData)
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterJobs = async () => {
    if (!searchQuery && selectedCategory === "all") {
      setFilteredJobs(jobs)
      return
    }

    const filtered = await JobScraperService.searchJobs(searchQuery, selectedCategory)
    setFilteredJobs(filtered)
  }

  const handleJobClick = (jobId: string) => {
    window.location.href = `/jobs/${jobId}`
  }

  const getUniqueCategories = () => {
    const categories = jobs.map((job) => job.category)
    return [...new Set(categories)]
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
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse flex-1"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
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
          <p className="text-gray-600">Latest opportunities from Sarkari Result</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {filteredJobs.length} Active Jobs
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search jobs, organizations, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {getUniqueCategories().map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Job Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => {
          const daysLeft = getDaysLeft(job.lastDate)
          const isUrgent = daysLeft <= 7

          return (
            <Card
              key={job.id}
              className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${
                isUrgent ? "border-l-red-500 bg-red-50" : "border-l-blue-500"
              }`}
              onClick={() => handleJobClick(job.id)}
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
                    handleJobClick(job.id)
                  }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredJobs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search criteria"
                : "Check back later for new opportunities"}
            </p>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="mt-4 bg-transparent"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
