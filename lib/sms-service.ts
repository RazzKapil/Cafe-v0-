// Mock SMS service - replace with real SMS provider in production
export class SMSService {
  static async sendOTP(phone: string, otp: string): Promise<boolean> {
    try {
      // In development, we'll show the OTP in a more visible way
      console.log(`📱 SMS to ${phone}: Your OTP is ${otp}`)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, we'll store the OTP in localStorage so users can see it
      if (typeof window !== "undefined") {
        const otpData = {
          phone,
          otp,
          timestamp: Date.now(),
        }
        localStorage.setItem("demo_otp", JSON.stringify(otpData))
      }

      return true
    } catch (error) {
      console.error("SMS sending failed:", error)
      return false
    }
  }

  static getDemoOTP(phone: string): string | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem("demo_otp")
      if (!stored) return null

      const otpData = JSON.parse(stored)
      if (otpData.phone === phone && Date.now() - otpData.timestamp < 300000) {
        // 5 minutes
        return otpData.otp
      }
    } catch (error) {
      console.error("Error getting demo OTP:", error)
    }

    return null
  }
}
