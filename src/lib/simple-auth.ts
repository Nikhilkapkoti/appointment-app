// Simple authentication without bcrypt for Next.js compatibility
interface User {
  id: string
  email?: string
  name: string
  phone?: string
  gender?: string
  role: string
  specialization?: string
  rating?: number
  isActive?: boolean
}

// Mock user database with plain text passwords for demo
const users: (User & { password: string })[] = [
  {
    id: "1",
    email: "user@example.com",
    password: "password",
    name: "John Doe",
    phone: "9876543210",
    gender: "male",
    role: "patient",
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "password",
    name: "Admin User",
    role: "admin",
  },
]

// Mock doctor database - expanded list
const doctors: (User & { password: string })[] = [
  {
    id: "1",
    name: "Dr. John Smith",
    password: "password",
    specialization: "Cardiologist",
    rating: 4.5,
    isActive: true,
    role: "doctor",
  },
  {
    id: "2",
    name: "Dr. Jane Doe",
    password: "password",
    specialization: "Dermatologist",
    rating: 4.8,
    isActive: true,
    role: "doctor",
  },
  {
    id: "3",
    name: "Dr. Mike Johnson",
    password: "password",
    specialization: "Orthopedic",
    rating: 4.2,
    isActive: false,
    role: "doctor",
  },
  {
    id: "4",
    name: "Dr. Sarah Wilson",
    password: "password",
    specialization: "Pediatrician",
    rating: 4.9,
    isActive: true,
    role: "doctor",
  },
  {
    id: "5",
    name: "Dr. Robert Chen",
    password: "password",
    specialization: "Neurologist",
    rating: 4.7,
    isActive: true,
    role: "doctor",
  },
  {
    id: "6",
    name: "Dr. Emily Rodriguez",
    password: "password",
    specialization: "Gynecologist",
    rating: 4.6,
    isActive: true,
    role: "doctor",
  },
  {
    id: "7",
    name: "Dr. David Kumar",
    password: "password",
    specialization: "Ophthalmologist",
    rating: 4.4,
    isActive: true,
    role: "doctor",
  },
  {
    id: "8",
    name: "Dr. Lisa Thompson",
    password: "password",
    specialization: "Psychiatrist",
    rating: 4.8,
    isActive: true,
    role: "doctor",
  },
  {
    id: "9",
    name: "Dr. Ahmed Hassan",
    password: "password",
    specialization: "Gastroenterologist",
    rating: 4.5,
    isActive: true,
    role: "doctor",
  },
  {
    id: "10",
    name: "Dr. Maria Garcia",
    password: "password",
    specialization: "Endocrinologist",
    rating: 4.7,
    isActive: true,
    role: "doctor",
  },
  {
    id: "11",
    name: "Dr. James Park",
    password: "password",
    specialization: "Urologist",
    rating: 4.3,
    isActive: true,
    role: "doctor",
  },
  {
    id: "12",
    name: "Dr. Rachel Green",
    password: "password",
    specialization: "Rheumatologist",
    rating: 4.6,
    isActive: false,
    role: "doctor",
  },
  {
    id: "13",
    name: "Dr. Kevin Lee",
    password: "password",
    specialization: "Pulmonologist",
    rating: 4.4,
    isActive: true,
    role: "doctor",
  },
  {
    id: "14",
    name: "Dr. Anna Petrov",
    password: "password",
    specialization: "Oncologist",
    rating: 4.9,
    isActive: true,
    role: "doctor",
  },
  {
    id: "15",
    name: "Dr. Michael Brown",
    password: "password",
    specialization: "Anesthesiologist",
    rating: 4.5,
    isActive: true,
    role: "doctor",
  },
  {
    id: "16",
    name: "Dr. Priya Sharma",
    password: "password",
    specialization: "Radiologist",
    rating: 4.7,
    isActive: true,
    role: "doctor",
  },
  {
    id: "17",
    name: "Dr. Thomas Anderson",
    password: "password",
    specialization: "Emergency Medicine",
    rating: 4.6,
    isActive: true,
    role: "doctor",
  },
  {
    id: "18",
    name: "Dr. Jennifer Liu",
    password: "password",
    specialization: "Plastic Surgeon",
    rating: 4.8,
    isActive: true,
    role: "doctor",
  },
]

export function authenticateUser(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export function authenticateDoctor(name: string, password: string): User | null {
  const doctor = doctors.find((d) => d.name.toLowerCase() === name.toLowerCase() && d.password === password)
  if (doctor) {
    const { password: _, ...doctorWithoutPassword } = doctor
    return doctorWithoutPassword
  }
  return null
}

export function authenticateAdmin(email: string, password: string): User | null {
  const admin = users.find((u) => u.email === email && u.password === password && u.role === "admin")
  if (admin) {
    const { password: _, ...adminWithoutPassword } = admin
    return adminWithoutPassword
  }
  return null
}

// Simple session management
export function createSession(user: User): string {
  const sessionData = {
    user,
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  return btoa(JSON.stringify(sessionData))
}

export function validateSession(token: string): User | null {
  try {
    const sessionData = JSON.parse(atob(token))
    if (sessionData.expires > Date.now()) {
      return sessionData.user
    }
  } catch (error) {
    console.error("Invalid session token:", error)
  }
  return null
}

export function getUserByEmail(email: string) {
  return users.find((user) => user.email === email)
}

export function getDoctorByName(name: string) {
  return doctors.find((doctor) => doctor.name.toLowerCase() === name.toLowerCase())
}

// Add a function to register a new doctor
export function registerDoctor(doctorData: {
  name: string
  password: string
  specialization: string
  email: string
  isActive?: boolean
}): User {
  const newDoctor = {
    id: `${doctors.length + 1}`,
    name: doctorData.name,
    password: doctorData.password, // In a real app, this would be hashed
    specialization: doctorData.specialization,
    email: doctorData.email,
    rating: 0,
    isActive: doctorData.isActive ?? true,
    role: "doctor" as const,
  }

  doctors.push(newDoctor)

  // Return doctor without password
  const { password: _, ...doctorWithoutPassword } = newDoctor
  return doctorWithoutPassword
}
