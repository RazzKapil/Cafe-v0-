export interface User {
  id: string
  name: string
  father_name: string
  mother_name: string
  phone: string
  email?: string
  is_verified: boolean
  created_at: string
}

export interface Job {
  id: string
  title: string
  organization: string
  location: string
  qualification: string
  experience: string
  salary: string
  last_date: string
  application_fee: number
  external_url?: string
  is_active: boolean
  created_at: string
}

export interface JobApplication {
  id: string
  user_id: string
  job_id: string
  application_data: any
  documents: any
  payment_status: "pending" | "completed" | "failed"
  payment_id?: string
  status: "submitted" | "under_review" | "approved" | "rejected"
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  application_id: string
  amount: number
  payment_method: string
  transaction_id?: string
  status: "pending" | "completed" | "failed"
  created_at: string
}

export interface AdminSettings {
  id: string
  upi_id: string
  merchant_name: string
  payment_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
}

export interface OTPVerification {
  id: string
  phone: string
  otp: string
  expires_at: string
  is_used: boolean
}
