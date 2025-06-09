import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, authenticateDoctor, authenticateAdmin, createSession } from "@/lib/simple-auth"

export async function POST(request: NextRequest) {
  try {
    const { type, email, name, password } = await request.json()

    let user = null

    switch (type) {
      case "patient":
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }
        user = authenticateUser(email, password)
        break

      case "doctor":
        if (!name || !password) {
          return NextResponse.json({ error: "Name and password are required" }, { status: 400 })
        }
        user = authenticateDoctor(name, password)
        break

      case "admin":
        if (!email || !password) {
          return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }
        user = authenticateAdmin(email, password)
        break

      default:
        return NextResponse.json({ error: "Invalid login type" }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = createSession(user)

    const response = NextResponse.json({ user }, { status: 200 })

    // Set secure cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
