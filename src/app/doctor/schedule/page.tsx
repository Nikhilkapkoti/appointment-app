"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScheduleCalendar from '@/components/schedule-calendar'
import { OptimizationEngine } from "@/components/optimization-engine"
import { NavBar } from "@/components/nav-bar"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Users, AlertTriangle, Zap } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialization: string
  isActive: boolean
}

interface WeeklySchedule {
  doctorId: string
  schedule: Array<{
    day: string
    isAvailable: boolean
    timeSlots: Array<{
      start: string
      end: string
      id: string
    }>
  }>
}

export default function ScheduleManagementPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "doctor")) {
      router.push("/unauthorized")
    }
  }, [user, loading, router])

  const mockDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. John Smith",
      specialization: "Cardiologist",
      isActive: true,
    },
    {
      id: "2",
      name: "Dr. Jane Doe",
      specialization: "Dermatologist",
      isActive: true,
    },
    {
      id: "3",
      name: "Dr. Mike Johnson",
      specialization: "Orthopedic",
      isActive: false,
    },
  ]

  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("")
  const [schedules, setSchedules] = useState<Record<string, WeeklySchedule>>({})

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "doctor") {
    return null
  }

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId)

  const handleScheduleUpdate = (schedule: WeeklySchedule) => {
    setSchedules((prev) => ({
      ...prev,
      [schedule.doctorId]: schedule,
    }))

    // Here you would typically save to your backend
    console.log("Schedule updated for doctor:", schedule.doctorId, schedule)
  }

  const getScheduleStats = () => {
    const totalDoctors = doctors.length
    const activeDoctors = doctors.filter((d) => d.isActive).length
    const doctorsWithSchedules = Object.keys(schedules).length
    const doctorsWithoutSchedules = activeDoctors - doctorsWithSchedules

    return {
      totalDoctors,
      activeDoctors,
      doctorsWithSchedules,
      doctorsWithoutSchedules,
    }
  }

  const stats = getScheduleStats()

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Calendar className="h-8 w-8" />
                <span>Schedule Management</span>
              </h1>
              <p className="text-muted-foreground">Manage doctor availability and optimize schedules</p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalDoctors}</p>
                    <p className="text-sm text-muted-foreground">Total Doctors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.activeDoctors}</p>
                    <p className="text-sm text-muted-foreground">Active Doctors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.doctorsWithSchedules}</p>
                    <p className="text-sm text-muted-foreground">With Schedules</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.doctorsWithoutSchedules}</p>
                    <p className="text-sm text-muted-foreground">Missing Schedules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="schedules" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedules">Schedule Management</TabsTrigger>
              <TabsTrigger value="optimization">
                <Zap className="mr-2 h-4 w-4" />
                Optimization Engine
              </TabsTrigger>
            </TabsList>

            {/* Schedule Management Tab */}
            <TabsContent value="schedules" className="space-y-6">
              {/* Doctor Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Doctor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                      <SelectTrigger className="w-full max-w-sm">
                        <SelectValue placeholder="Choose a doctor to manage schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            <div className="flex items-center space-x-2">
                              <span>{doctor.name}</span>
                              <Badge variant={doctor.isActive ? "default" : "secondary"} className="text-xs">
                                {doctor.specialization}
                              </Badge>
                              {!doctor.isActive && (
                                <Badge variant="outline" className="text-xs">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedDoctor && (
                      <div className="flex items-center space-x-2">
                        <Badge variant={selectedDoctor.isActive ? "default" : "secondary"}>
                          {selectedDoctor.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {schedules[selectedDoctorId] && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Schedule Configured
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Management */}
              {selectedDoctor && (
                <Card>
                  <CardContent className="pt-6">
                    <ScheduleCalendar
                      doctorId={selectedDoctor.id}
                      doctorName={selectedDoctor.name}
                      onScheduleUpdate={handleScheduleUpdate}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Quick Overview */}
              {Object.keys(schedules).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(schedules).map(([doctorId, schedule]) => {
                        const doctor = doctors.find((d) => d.id === doctorId)
                        if (!doctor) return null

                        const availableDays = schedule.schedule.filter((d) => d.isAvailable).length
                        const totalSlots = schedule.schedule.reduce((acc, day) => acc + day.timeSlots.length, 0)

                        return (
                          <div key={doctorId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{availableDays} days/week</p>
                              <p className="text-sm text-muted-foreground">{totalSlots} time slots</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Optimization Engine Tab */}
            <TabsContent value="optimization">
              <OptimizationEngine />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
