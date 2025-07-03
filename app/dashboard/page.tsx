import { DemoDashboard } from "@/components/dashboard/demo-dashboard"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Portal Dashboard</h1>
              <p className="text-gray-600 mt-1">Find and apply for government jobs</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <a href="/admin" className="text-blue-600 hover:underline text-sm">
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <DemoDashboard />
        </div>
      </main>
    </div>
  )
}
