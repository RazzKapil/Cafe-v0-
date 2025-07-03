import { SimpleAdminDashboard } from "@/components/admin/simple-admin-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cyber Cafe Admin</h1>
              <p className="text-gray-600">Complete job portal management system</p>
            </div>
            <div className="text-sm text-gray-600">
              Admin User •{" "}
              <a href="/" className="text-blue-600 hover:underline">
                View Portal
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <SimpleAdminDashboard />
        </div>
      </main>
    </div>
  )
}
