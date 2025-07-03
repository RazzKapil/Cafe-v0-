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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Settings,
  FileText,
  CreditCard,
  Briefcase,
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
  createdAt: string
}

// Initial sample jobs
const INITIAL_JOBS: SimpleJob[] = [
  {
    id: "job-1",
    title: "Staff Selection Commission - Multi Tasking Staff",
    organization: "Staff Selection Commission",
    location: "All India",
    qualification: "10th Pass from recognized board",
    experience: "No experience required",
    salary: "₹18,000 - ₹22,000 per month",
    lastDate: "2024-03-15",
    applicationFee: 100,
    externalUrl: "https://ssc.nic.in",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    title: "Railway Recruitment Board - Assistant Loco Pilot",
    organization: "Indian Railways",
    location: "All India",
    qualification: "ITI/Diploma in relevant trade",
    experience: "0-3 years experience",
    salary: "₹35,000 - ₹40,000 per month",
    lastDate: "2024-03-20",
    applicationFee: 500,
    externalUrl: "https://rrbcdg.gov.in",
    createdAt: new Date().toISOString(),
  },
  {
    id: "job-3",
    title: "IBPS - Probationary Officer",
    organization: "Institute of Banking Personnel Selection",
    location: "All India",
    qualification: "Graduate in any discipline",
    experience: "Fresher",
    salary: "₹40,000 - ₹50,000 per month",
    lastDate: "2024-03-25",
    applicationFee: 850,
    externalUrl: "https://ibps.in",
    createdAt: new Date().toISOString(),
  },
]

export function SimpleAdminDashboard() {
  const [jobs, setJobs] = useState<SimpleJob[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<SimpleJob | null>(null)
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
  const [settings, setSettings] = useState({
    upi_id: "admin@paytm",
    merchant_name: "Cyber Cafe",
    payment_enabled: true,
    email_notifications: true,
    sms_notifications: true,
  })
  const { toast } = useToast()

  // Load jobs from localStorage or use initial jobs
  useEffect(() => {
    const savedJobs = localStorage.getItem("admin_jobs")
    if (savedJobs) {
      try {
        setJobs(JSON.parse(savedJobs))
      } catch (error) {
        console.error("Error loading saved jobs:", error)
        setJobs(INITIAL_JOBS)
      }
    } else {
      setJobs(INITIAL_JOBS)
    }

    // Load settings
    const savedSettings = localStorage.getItem("admin_settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }
  }, [])

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem("admin_jobs", JSON.stringify(jobs))
  }, [jobs])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingJob) {
      // Update existing job
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingJob.id
            ? {
                ...job,
                ...formData,
              }
            : job,
        ),
      )
      toast({
        title: "Job Updated",
        description: "Job has been updated successfully",
      })
    } else {
      // Add new job
      const newJob: SimpleJob = {
        id: `job-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      }
      setJobs((prev) => [newJob, ...prev])
      toast({
        title: "Job Created",
        description: "Job has been created successfully",
      })
    }

    setIsDialogOpen(false)
    resetForm()
  }

  const handleDeleteJob = (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    setJobs((prev) => prev.filter((job) => job.id !== jobId))
    toast({
      title: "Job Deleted",
      description: "Job has been deleted successfully",
    })
  }

  const handleSaveSettings = () => {
    localStorage.setItem("admin_settings", JSON.stringify(settings))
    toast({
      title: "Settings Saved",
      description: "Settings have been saved successfully",
    })
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

  const activeJobs = jobs.filter((job) => getDaysLeft(job.lastDate) > 0)
  const expiredJobs = jobs.filter((job) => getDaysLeft(job.lastDate) <= 0)
  const urgentJobs = jobs.filter((job) => getDaysLeft(job.lastDate) <= 7 && getDaysLeft(job.lastDate) > 0)

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    color = "text-muted-foreground",
  }: {
    title: string
    value: number
    description: string
    icon: any
    color?: string
  }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your cyber cafe job portal</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Demo Mode</Badge>
          <Button variant="outline" onClick={() => window.open("/dashboard", "_blank")} className="bg-transparent">
            View Portal
          </Button>
        </div>
      </div>

      {/* Demo Mode Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Demo Mode Active:</strong> Data is stored locally in your browser. In production, this would connect
          to a database.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard title="Total Jobs" value={jobs.length} description="All job postings" icon={Briefcase} />
        <StatCard
          title="Active Jobs"
          value={activeJobs.length}
          description="Currently open"
          icon={CheckCircle}
          color="text-green-600"
        />
        <StatCard
          title="Expired Jobs"
          value={expiredJobs.length}
          description="Past deadline"
          icon={XCircle}
          color="text-red-600"
        />
        <StatCard
          title="Closing Soon"
          value={urgentJobs.length}
          description="Within 7 days"
          icon={AlertCircle}
          color="text-orange-600"
        />
        <StatCard title="Applications" value={0} description="Demo mode" icon={FileText} />
        <StatCard title="Payments" value={0} description="Demo mode" icon={IndianRupee} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button onClick={handleAddJob} className="h-20 flex-col gap-2">
              <Plus className="h-6 w-6" />
              Add New Job
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("/dashboard", "_blank")}
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <Eye className="h-6 w-6" />
              View Portal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setJobs(INITIAL_JOBS)
                toast({ title: "Data Reset", description: "Jobs reset to initial sample data" })
              }}
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <RefreshCw className="h-6 w-6" />
              Reset Data
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const settingsTab = document.querySelector('[data-value="settings"]') as HTMLElement
                settingsTab?.click()
              }}
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <Settings className="h-6 w-6" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">Job Management</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="settings" data-value="settings">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Job Management ({jobs.length})</CardTitle>
                  <CardDescription>Manage all job openings</CardDescription>
                </div>
                <Button onClick={handleAddJob}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Job
                </Button>
              </div>
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
                            onClick={() => {
                              toast({
                                title: "Demo Mode",
                                description: "Job detail view would open here in production",
                              })
                            }}
                            className="bg-transparent"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditJob(job)}
                            className="bg-transparent"
                          >
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
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>View and manage job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Application Management</h3>
                <p className="text-muted-foreground mb-4">
                  In production, this would show all job applications with filtering and management options.
                </p>
                <Button variant="outline" className="bg-transparent">
                  Demo Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>View and manage payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Payment Management</h3>
                <p className="text-muted-foreground mb-4">
                  In production, this would show payment transactions, verification status, and refund management.
                </p>
                <Button variant="outline" className="bg-transparent">
                  Demo Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure payment and notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="upi_id">UPI ID</Label>
                  <Input
                    id="upi_id"
                    value={settings.upi_id}
                    onChange={(e) => setSettings((prev) => ({ ...prev, upi_id: e.target.value }))}
                    placeholder="your-upi@paytm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="merchant_name">Merchant Name</Label>
                  <Input
                    id="merchant_name"
                    value={settings.merchant_name}
                    onChange={(e) => setSettings((prev) => ({ ...prev, merchant_name: e.target.value }))}
                    placeholder="Cyber Cafe"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow users to make payments</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.payment_enabled}
                    onChange={(e) => setSettings((prev) => ({ ...prev, payment_enabled: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email confirmations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={(e) => setSettings((prev) => ({ ...prev, email_notifications: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send SMS confirmations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.sms_notifications}
                    onChange={(e) => setSettings((prev) => ({ ...prev, sms_notifications: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
