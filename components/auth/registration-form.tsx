"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    father_name: "",
    mother_name: "",
    phone: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    }
    if (!formData.father_name.trim()) {
      newErrors.father_name = "Father's name is required"
    }
    if (!formData.mother_name.trim()) {
      newErrors.mother_name = "Mother's name is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast({
          title: "Registration Successful!",
          description: "OTP has been sent to your phone number",
        })

        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = `/auth/verify?phone=${formData.phone}`
        }, 2000)
      } else {
        if (response.status === 409) {
          setErrors({ phone: "This phone number is already registered" })
        } else {
          toast({
            title: "Registration Failed",
            description: result.error || "Something went wrong",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Registration Successful!</h3>
              <p className="text-sm text-gray-600 mt-2">
                OTP has been sent to <strong>{formData.phone}</strong>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to verification...
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register - Cyber Cafe</CardTitle>
        <CardDescription>Create your account to access job portal services</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="father_name">Father's Name *</Label>
            <Input
              id="father_name"
              name="father_name"
              type="text"
              required
              value={formData.father_name}
              onChange={handleChange}
              placeholder="Enter father's name"
              className={errors.father_name ? "border-red-500" : ""}
            />
            {errors.father_name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.father_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mother_name">Mother's Name *</Label>
            <Input
              id="mother_name"
              name="mother_name"
              type="text"
              required
              value={formData.mother_name}
              onChange={handleChange}
              placeholder="Enter mother's name"
              className={errors.mother_name ? "border-red-500" : ""}
            />
            {errors.mother_name && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.mother_name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </div>
        </form>

        <Alert className="mt-4 border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Demo Mode:</strong> OTP will be displayed on the verification screen for testing purposes.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
