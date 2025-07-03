// Admin authentication utilities
export const ADMIN_PHONE = "9999999999" // Default admin phone number

export function isAdminUser(phone: string): boolean {
  return phone === ADMIN_PHONE
}

export function checkAdminAccess(): boolean {
  if (typeof window === "undefined") return false

  try {
    const userSession = localStorage.getItem("user_session")
    if (!userSession) return false

    const session = JSON.parse(userSession)
    return isAdminUser(session.phone)
  } catch {
    return false
  }
}

export function requireAdmin(): void {
  if (!checkAdminAccess()) {
    window.location.href = "/auth/login?admin=true"
  }
}
