"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, MessageSquare, RefreshCw } from "lucide-react"
import { SMSService } from "@/lib/sms-service"

interface OTPVerificationProps {
  phone: string
}

export function OTPVerification({ phone }: OTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [showDemoOTP, setShowDemoOTP] = useState(false)
  const [demoOTP, setDemoOTP] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  useEffect(() => {
    // Check for demo OTP
    const checkDemoOTP = () => {
      const demoOtp = SMSService.getDemoOTP(phone)
      setDemoOTP(demoOtp)
    }

    checkDemoOTP()
    const interval = setInterval(checkDemoOTP, 1000)
    return () => clearInterval(interval)
  }, [phone])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Verification Successful",
          description: "Your account has been verified",
        })
        // Clear demo OTP
        localStorage.removeItem("demo_otp")
        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "Invalid OTP",
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

  const handleResendOTP = async () => {
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      if (response.ok) {
        setTimeLeft(300)
        setOtp("")
        toast({
          title: "OTP Resent",
          description: "New OTP sent to your phone number",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOTPInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtp(value)
  }

  const fillDemoOTP = () => {
    if (demoOTP) {
      setOtp(demoOTP)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verify Phone Number</CardTitle>
          <CardDescription>
            Enter the 6-digit OTP sent to <strong>{phone}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={handleOTPInputChange}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
                autoComplete="one-time-code"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center space-y-2">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Resend OTP in <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOTP}
                  className="w-full bg-transparent"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend OTP
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Demo Mode Alert */}
      <Alert className="max-w-md mx-auto border-blue-200 bg-blue-50">
        <MessageSquare className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-semibold text-blue-800">Demo Mode Active</p>
            <p className="text-sm text-blue-700">In production, OTP would be sent via SMS. For demo purposes:</p>
            {demoOTP && (
              <div className="flex items-center gap-2 p-2 bg-white rounded border">
                <span className="text-sm">Your OTP:</span>
                <code className="font-mono font-bold text-lg">{showDemoOTP ? demoOTP : "••••••"}</code>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowDemoOTP(!showDemoOTP)}>
                  {showDemoOTP ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={fillDemoOTP} className="bg-transparent">
                  Use This OTP
                </Button>
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
