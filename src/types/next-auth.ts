declare module "next-auth" {
  interface User {
    id: string
    email?: string
    name?: string
    phone?: string
    gender?: string
    role: string
    specialization?: string
    rating?: number
    isActive?: boolean
  }

  interface Session {
    user: {
      id: string
      email?: string
      name?: string
      phone?: string
      gender?: string
      role: string
      specialization?: string
      rating?: number
      isActive?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    phone?: string
    gender?: string
    specialization?: string
    rating?: number
    isActive?: boolean
  }
}
