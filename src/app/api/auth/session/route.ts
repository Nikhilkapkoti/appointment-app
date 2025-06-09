import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/simple-auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const user = validateSession(token)

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Session validation error:", error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
