"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Copy, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AdminSettings } from "@/types"

interface PaymentFormProps {
  amount: number
  applicationId: string
  onPaymentComplete: (paymentId: string) => void
}

export function PaymentForm({ amount, applicationId, onPaymentComplete }: PaymentFormProps) {
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null)
  const [paymentId, setPaymentId] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdminSettings()
  }, [])

  const fetchAdminSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()
      if (data.settings) {
        setAdminSettings(data.settings)
      }
    } catch (error) {
      console.error("Error fetching admin settings:", error)
      toast({
        title: "Error",
        description: "Failed to load payment settings",
        variant: "destructive",
      })
    }
  }

  const copyUPIId = () => {
    if (adminSettings?.upi_id) {
      navigator.clipboard.writeText(adminSettings.upi_id)
      toast({
        title: "UPI ID Copied",
        description: "UPI ID has been copied to clipboard",
      })
    } else {
      toast({
        title: "Error",
        description: "UPI ID not available",
        variant: "destructive",
      })
    }
  }

  const handlePaymentVerification = async () => {
    if (!paymentId.trim()) {
      toast({
        title: "Error",
        description: "Please enter transaction ID",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          transactionId: paymentId,
          amount,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Payment Verified",
          description: "Your payment has been recorded successfully",
        })
        onPaymentComplete(paymentId)
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "Payment verification failed",
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
      setIsVerifying(false)
    }
  }

  if (!adminSettings) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Loading Payment Details...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!adminSettings.upi_id) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Payment Not Configured</CardTitle>
          <CardDescription>Payment system is not set up by admin</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">Please contact the administrator to configure payment settings.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Payment Required
        </CardTitle>
        <CardDescription>Complete payment to submit your application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">₹{amount}</div>
          <p className="text-sm text-gray-600">Application Fee</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-2">Payment Instructions:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Open your UPI app (PhonePe, Paytm, GPay, etc.)</li>
              <li>Send ₹{amount} to the UPI ID below</li>
              <li>Copy the transaction ID from your app</li>
              <li>Enter the transaction ID below and verify</li>
            </ol>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">UPI ID:</label>
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
              <code className="flex-1 font-mono">{adminSettings.upi_id}</code>
              <Button size="sm" variant="outline" onClick={copyUPIId}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Merchant Name:</label>
            <div className="p-3 border rounded-lg bg-gray-50">
              <span className="font-medium">{adminSettings.merchant_name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentId" className="text-sm font-medium">
              Transaction ID:
            </label>
            <input
              id="paymentId"
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              placeholder="Enter transaction ID from your UPI app"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <Button onClick={handlePaymentVerification} disabled={isVerifying || !paymentId.trim()} className="w-full">
            {isVerifying ? "Verifying..." : "Verify Payment"}
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <CheckCircle className="h-4 w-4 inline mr-1" />
          Your payment will be verified within 5 minutes
        </div>
      </CardContent>
    </Card>
  )
}
