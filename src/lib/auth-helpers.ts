import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { validateSession } from "@/lib/simple-auth"

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  return validateSession(token)
}

export async function requireAuth(allowedRoles?: string[]) {
  const user = await getSession()

  if (!user) {
    redirect("/auth/login")
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

export async function requirePatientAuth() {
  return await requireAuth(["patient"])
}

export async function requireDoctorAuth() {
  return await requireAuth(["doctor"])
}

export async function requireAdminAuth() {
  return await requireAuth(["admin"])
}
