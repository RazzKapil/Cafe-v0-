"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Login Successful",
          description: "OTP sent to your phone number",
        })
        // Redirect to OTP verification
        window.location.href = `/auth/verify?phone=${phone}`
      } else {
        toast({
          title: "Login Failed",
          description: result.error || "Phone number not registered",
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login - Cyber Cafe</CardTitle>
        <CardDescription>Enter your phone number to login</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit phone number"
              pattern="[0-9]{10}"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
