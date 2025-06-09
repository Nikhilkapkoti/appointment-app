"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, Stethoscope, Shield } from "lucide-react"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"

interface PatientLoginForm {
  email: string
  password: string
}

interface DoctorLoginForm {
  name: string
  password: string
}

interface AdminLoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("patient")

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { login } = useAuth()

  const patientForm = useForm<PatientLoginForm>()
  const doctorForm = useForm<DoctorLoginForm>()
  const adminForm = useForm<AdminLoginForm>()

  const handlePatientLogin = async (data: PatientLoginForm) => {
    setIsLoading(true)
    setError("")

    try {
      const success = await login("patient", data)
      if (success) {
        router.push(callbackUrl)
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDoctorLogin = async (data: DoctorLoginForm) => {
    setIsLoading(true)
    setError("")

    try {
      const success = await login("doctor", data)
      if (success) {
        router.push("/doctor/dashboard")
      } else {
        setError("Invalid doctor name or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async (data: AdminLoginForm) => {
    setIsLoading(true)
    setError("")

    try {
      const success = await login("admin", data)
      if (success) {
        router.push("/admin/bookings")
      } else {
        setError("Invalid admin credentials")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="patient" className="text-xs">
                    <User className="h-4 w-4 mr-1" />
                    Patient
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="text-xs">
                    <Stethoscope className="h-4 w-4 mr-1" />
                    Doctor
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Patient Login */}
                <TabsContent value="patient">
                  <form onSubmit={patientForm.handleSubmit(handlePatientLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="patient-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          {...patientForm.register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                        />
                      </div>
                      {patientForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{patientForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="patient-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...patientForm.register("password", {
                            required: "Password is required",
                          })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {patientForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{patientForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In as Patient"}
                    </Button>
                  </form>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">Demo: user@example.com / password</p>
                  </div>
                </TabsContent>

                {/* Doctor Login */}
                <TabsContent value="doctor">
                  <form onSubmit={doctorForm.handleSubmit(handleDoctorLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-name">Doctor Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="doctor-name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10"
                          {...doctorForm.register("name", {
                            required: "Doctor name is required",
                          })}
                        />
                      </div>
                      {doctorForm.formState.errors.name && (
                        <p className="text-sm text-destructive">{doctorForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctor-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="doctor-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...doctorForm.register("password", {
                            required: "Password is required",
                          })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {doctorForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{doctorForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In as Doctor"}
                    </Button>
                  </form>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground text-center mb-1">Demo credentials:</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Dr. John Smith / password</p>
                      <p>Dr. Jane Doe / password</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Admin Login */}
                <TabsContent value="admin">
                  <form onSubmit={adminForm.handleSubmit(handleAdminLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="Enter admin email"
                          className="pl-10"
                          {...adminForm.register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                        />
                      </div>
                      {adminForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{adminForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter admin password"
                          className="pl-10 pr-10"
                          {...adminForm.register("password", {
                            required: "Password is required",
                          })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {adminForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{adminForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In as Admin"}
                    </Button>
                  </form>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">Demo: admin@example.com / password</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {"Don't have an account? "}
                  <Link href="/auth/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
