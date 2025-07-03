"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert } from "@/components/ui/alert"
import { Users, CreditCard, FileText, IndianRupee, Briefcase, AlertCircle, Settings, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAccess } from "@/lib/admin-auth"
import { EnhancedJobManagement } from "./enhanced-job-management"

interface DashboardStats {
  totalUsers: number
  totalApplications: number
  totalPayments: number
  pendingPayments: number
  totalJobs: number
  activeJobs: number
}

export function EnhancedAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalApplications: 0,
    totalPayments: 0,
    pendingPayments: 0,
    totalJobs: 0,
    activeJobs: 0,
  })
  const [settings, setSettings] = useState({
    upi_id: "",
    merchant_name: "",
    payment_enabled: true,
    email_notifications: true,
    sms_notifications: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check admin access
    if (!checkAdminAccess()) {
      window.location.href = "/auth/login?admin=true"
      return
    }

    fetchDashboardData()
    fetchSettings()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoadingStats(true)
    setStatsError(null)
    try {
      const dashboardResponse = await fetch("/api/admin/dashboard")

      if (!dashboardResponse.ok) {
        throw new Error(`Dashboard API error: ${dashboardResponse.status}`)
      }

      const dashboardData = await dashboardResponse.json()

      // Try to fetch jobs, but don't fail if it doesn't work
      let jobs = []
      let activeJobs = 0

      try {
        const jobsResponse = await fetch("/api/admin/jobs")
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json()
          jobs = jobsData.jobs || []
          activeJobs = jobs.filter((job: any) => new Date(job.lastDate) > new Date()).length
        }
      } catch (jobError) {
        console.error("Error fetching jobs for stats:", jobError)
        // Continue without job stats
      }

      setStats({
        ...dashboardData.stats,
        totalJobs: jobs.length,
        activeJobs,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setStatsError("Failed to load dashboard statistics")
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchSettings = async () => {
    setIsLoadingSettings(true)
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      if (data.settings) {
        setSettings({
          upi_id: data.settings.upi_id || "",
          merchant_name: data.settings.merchant_name || "",
          payment_enabled: data.settings.payment_enabled ?? true,
          email_notifications: data.settings.email_notifications ?? true,
          sms_notifications: data.settings.sms_notifications ?? true,
        })
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Settings Saved",
          description: "Admin settings have been updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const StatCard = ({
    title,
    value,
    description,
    icon: Icon,
    isLoading,
    color = "text-muted-foreground",
  }: {
    title: string
    value: number
    description: string
    icon: any
    isLoading: boolean
    color?: string
  }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your cyber cafe job portal</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Admin Panel</Badge>
          <Button variant="outline" onClick={() => window.open("/dashboard", "_blank")} className="bg-transparent">
            View Portal
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {statsError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <div className="flex items-center justify-between">
            <span className="text-red-600">{statsError}</span>
            <Button variant="outline" size="sm" onClick={fetchDashboardData} className="bg-transparent">
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered users"
          icon={Users}
          isLoading={isLoadingStats}
          color="text-blue-600"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          description="Currently open"
          icon={Briefcase}
          isLoading={isLoadingStats}
          color="text-green-600"
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          description="Job applications"
          icon={FileText}
          isLoading={isLoadingStats}
          color="text-purple-600"
        />
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          description="All job postings"
          icon={Briefcase}
          isLoading={isLoadingStats}
          color="text-orange-600"
        />
        <StatCard
          title="Payments"
          value={stats.totalPayments}
          description="Completed"
          icon={IndianRupee}
          isLoading={isLoadingStats}
          color="text-green-600"
        />
        <StatCard
          title="Pending"
          value={stats.pendingPayments}
          description="Pending payments"
          icon={CreditCard}
          isLoading={isLoadingStats}
          color="text-red-600"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              onClick={() => {
                const event = new CustomEvent("openAddJobDialog")
                window.dispatchEvent(event)
              }}
              className="h-20 flex-col gap-2"
            >
              <Plus className="h-6 w-6" />
              Add New Job
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("/dashboard", "_blank")}
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <FileText className="h-6 w-6" />
              View Applications
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchDashboardData()}
              className="h-20 flex-col gap-2 bg-transparent"
            >
              <AlertCircle className="h-6 w-6" />
              Refresh Data
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

      {/* Admin Tabs */}
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
          <EnhancedJobManagement />
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
                  View applications, approve/reject candidates, and manage the hiring process
                </p>
                <Button variant="outline" className="bg-transparent">
                  Coming Soon
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
                <p className="text-muted-foreground mb-4">Track payments, verify transactions, and manage refunds</p>
                <Button variant="outline" className="bg-transparent">
                  Coming Soon
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
              {isLoadingSettings ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">UPI ID</label>
                      <input
                        type="text"
                        value={settings.upi_id}
                        onChange={(e) => setSettings((prev) => ({ ...prev, upi_id: e.target.value }))}
                        placeholder="your-upi@paytm"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Merchant Name</label>
                      <input
                        type="text"
                        value={settings.merchant_name}
                        onChange={(e) => setSettings((prev) => ({ ...prev, merchant_name: e.target.value }))}
                        placeholder="Cyber Cafe"
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Enable Payments</label>
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
                        <label className="text-sm font-medium">Email Notifications</label>
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
                        <label className="text-sm font-medium">SMS Notifications</label>
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

                  <Button onClick={handleSaveSettings} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
