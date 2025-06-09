import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"

// Mock user database - in production, this would be a real database
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, gender } = await request.json()

    // Validation
    if (!name || !email || !password || !phone || !gender) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Phone number must be exactly 10 digits" }, { status: 400 })
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      gender: gender.toLowerCase(),
      role: "patient",
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
