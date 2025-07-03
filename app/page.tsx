import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CreditCard, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Cyber Cafe Portal</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">Government Job Portal</h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Apply for government jobs with ease. Complete registration, document upload, and secure payment processing.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link href="/auth/register">
                <Button size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  View Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600" />
                <CardTitle>Easy Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simple registration with name, father's name, mother's name, and phone verification
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-green-600" />
                <CardTitle>Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse and apply for government jobs with integrated Sarkari Naukri listings
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CreditCard className="h-8 w-8 text-purple-600" />
                <CardTitle>Secure Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>UPI-based payment system with admin-configured payment gateway</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600" />
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Email and SMS confirmations for all applications and payments</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admin Access */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access</h2>
            <p className="text-gray-600 mb-6">Manage users, configure payments, and monitor applications</p>
            <Link href="/admin">
              <Button variant="outline" size="lg">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Cyber Cafe Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
