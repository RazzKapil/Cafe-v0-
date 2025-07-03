import { OTPVerification } from "@/components/auth/otp-verification"

interface VerifyPageProps {
  searchParams: { phone?: string }
}

export default function VerifyPage({ searchParams }: VerifyPageProps) {
  const phone = searchParams.phone || ""

  if (!phone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Invalid Request</h1>
          <p className="text-gray-600">Phone number is required for verification</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <OTPVerification phone={phone} />
    </div>
  )
}
