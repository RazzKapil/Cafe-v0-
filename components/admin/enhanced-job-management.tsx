"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SimpleJob {
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
}

export function EnhancedJobManagement() {
  const [jobs, setJobs] = useState<SimpleJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<SimpleJob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    location: "",
    qualification: "",
    experience: "",
    salary: "",
    lastDate: "",
    applicationFee: 0,
    externalUrl: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Try the main API first, then fallback to basic API
      let response = await fetch("/api/admin/jobs")

      if (!response.ok) {
        console.log("Main API failed, trying fallback...")
        response = await fetch("/api/admin/jobs-basic")
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (data.success) {
        setJobs(data.jobs || [])
        setDataSource(data.source || "database")

        if (data.source === "sample_data") {
          toast({
            title: "Using Sample Data",
            description: "Database not configured. Showing sample jobs for demo.",
          })
        }
      } else {
        throw new Error(data.error || "Failed to fetch jobs")
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch jobs")

      // Set sample data as ultimate fallback
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
        },
      ])
      setDataSource("fallback")

      toast({
        title: "Connection Error",
        description: "Using fallback data. Please check your database connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      organization: "",
      location: "",
      qualification: "",
      experience: "",
      salary: "",
      lastDate: "",
      applicationFee: 0,
      externalUrl: "",
    })
    setEditingJob(null)
  }

  const handleAddJob = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEditJob = (job: SimpleJob) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      organization: job.organization,
      location: job.location,
      qualification: job.qualification,
      experience: job.experience,
      salary: job.salary,
      lastDate: job.lastDate,
      applicationFee: job.applicationFee,
      externalUrl: job.externalUrl,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingJob ? `/api/admin/jobs/${editingJob.id}` : "/api/admin/jobs-basic"
      const method = editingJob ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success || response.ok) {
        toast({
          title: editingJob ? "Job Updated" : "Job Created",
          description: result.message || `Job has been ${editingJob ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchJobs()
      } else {
        throw new Error(result.error || "Failed to save job")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save job",
        variant: "destructive",
      })
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Job Deleted",
          description: "Job has been deleted successfully",
        })
        fetchJobs()
      } else {
        throw new Error("Failed to delete job")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN")
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
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
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
          <h2 className="text-2xl font-bold">Job Management</h2>
          <p className="text-gray-600">Manage job openings and applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchJobs} className="bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleAddJob}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>
      </div>

      {/* Data Source Alert */}
      {dataSource && (
        <Alert
          className={`${dataSource === "sample_data" || dataSource === "fallback" ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"}`}
        >
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Data Source:</strong>{" "}
            {dataSource === "database"
              ? "Connected to database"
              : dataSource === "sample_data"
                ? "Using sample data (database not configured)"
                : dataSource === "fallback"
                  ? "Using fallback data (connection failed)"
                  : "Unknown source"}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span className="text-red-600">{error}</span>
              <Button variant="outline" size="sm" onClick={fetchJobs} className="bg-transparent">
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{jobs.filter((job) => getDaysLeft(job.lastDate) > 0).length}</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold">{jobs.filter((job) => getDaysLeft(job.lastDate) <= 0).length}</div>
                <div className="text-sm text-gray-600">Expired Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {jobs.filter((job) => getDaysLeft(job.lastDate) <= 7 && getDaysLeft(job.lastDate) > 0).length}
                </div>
                <div className="text-sm text-gray-600">Closing Soon</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs ({jobs.length})</CardTitle>
          <CardDescription>Manage all job openings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job) => {
              const daysLeft = getDaysLeft(job.lastDate)
              const isExpired = daysLeft <= 0
              const isUrgent = daysLeft <= 7 && daysLeft > 0

              return (
                <div
                  key={job.id}
                  className={`border rounded-lg p-4 ${
                    isExpired ? "bg-red-50 border-red-200" : isUrgent ? "bg-orange-50 border-orange-200" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge variant={isExpired ? "destructive" : isUrgent ? "secondary" : "default"}>
                          {isExpired ? "Expired" : `${daysLeft} days left`}
                        </Badge>
                      </div>

                      <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.organization}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Last Date: {formatDate(job.lastDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          Fee: ₹{job.applicationFee}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/jobs/${job.id}`, "_blank")}
                        className="bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditJob(job)} className="bg-transparent">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        className="bg-transparent text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {jobs.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs found</h3>
                <p className="text-gray-500 mb-4">Start by adding your first job opening</p>
                <Button onClick={handleAddJob}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Job
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Job Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingJob ? "Edit Job" : "Add New Job"}</DialogTitle>
            <DialogDescription>{editingJob ? "Update job information" : "Create a new job opening"}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Staff Selection Commission - MTS"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData((prev) => ({ ...prev, organization: e.target.value }))}
                  placeholder="e.g., Staff Selection Commission"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., All India"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range *</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData((prev) => ({ ...prev, salary: e.target.value }))}
                  placeholder="e.g., ₹18,000 - ₹22,000 per month"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastDate">Application Last Date *</Label>
                <Input
                  id="lastDate"
                  type="date"
                  value={formData.lastDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationFee">Application Fee (₹)</Label>
                <Input
                  id="applicationFee"
                  type="number"
                  min="0"
                  value={formData.applicationFee}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, applicationFee: Number.parseFloat(e.target.value) || 0 }))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification *</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => setFormData((prev) => ({ ...prev, qualification: e.target.value }))}
                placeholder="e.g., Matriculation (10th Pass) from recognized board"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g., No experience required"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="externalUrl">Official Website URL</Label>
              <Input
                id="externalUrl"
                type="url"
                value={formData.externalUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, externalUrl: e.target.value }))}
                placeholder="https://example.gov.in"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="bg-transparent">
                Cancel
              </Button>
              <Button type="submit">{editingJob ? "Update Job" : "Create Job"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
