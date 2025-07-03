"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, CreditCard, FileText, IndianRupee, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalUsers: number
  totalApplications: number
  totalPayments: number
  pendingPayments: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalApplications: 0,
    totalPayments: 0,
    pendingPayments: 0,
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
    fetchDashboardData()
    fetchSettings()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoadingStats(true)
    setStatsError(null)
    try {
      const response = await fetch("/api/admin/dashboard")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()

      if (data.stats) {
        setStats(data.stats)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setStatsError("Failed to load dashboard statistics")
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchSettings = async () => {
    setIsLoadingSettings(true)
    try {
      const response = await fetch("/api/admin/settings")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
      toast({
        title: "Error",
        description: "Failed to load admin settings",
        variant: "destructive",
      })
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
  }: {
    title: string
    value: number
    description: string
    icon: any
    isLoading: boolean
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="secondary">Cyber Cafe Management</Badge>
      </div>

      {/* Error Message */}
      {statsError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{statsError}</span>
              <Button variant="outline" size="sm" onClick={fetchDashboardData} className="ml-auto bg-transparent">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered users"
          icon={Users}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          description="Job applications"
          icon={FileText}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Total Payments"
          value={stats.totalPayments}
          description="Completed payments"
          icon={IndianRupee}
          isLoading={isLoadingStats}
        />
        <StatCard
          title="Pending"
          value={stats.pendingPayments}
          description="Pending payments"
          icon={CreditCard}
          isLoading={isLoadingStats}
        />
      </div>

      {/* Admin Tabs */}
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure UPI payment details</CardDescription>
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
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
                        </div>
                        <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
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
                      <Switch
                        checked={settings.payment_enabled}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, payment_enabled: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send email confirmations</p>
                      </div>
                      <Switch
                        checked={settings.email_notifications}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, email_notifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send SMS confirmations</p>
                      </div>
                      <Switch
                        checked={settings.sms_notifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, sms_notifications: checked }))}
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

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">User Management</h3>
                <p className="text-muted-foreground">User management interface will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>View and manage payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Payment Management</h3>
                <p className="text-muted-foreground">Payment management interface will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
