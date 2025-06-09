"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Calendar,
  Clock,
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Shield,
} from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { getAllBookings, updateBookingStatus, type Booking } from "@/lib/booking-service"
import { toast } from "sonner"
import { Timestamp } from "firebase/firestore"

// Use the Booking interface from booking-service.ts, but create a DisplayBooking for rendering
interface DisplayBooking {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  patientGender: string
  patientAge: number
  doctorName: string
  doctorSpecialization: string
  date: string
  time: string
  healthIssue: string
  status: "Pending" | "Confirmed" | "Rejected" | "Completed" | "Cancelled"
  createdAt: string
  updatedAt?: string
  notes?: string
}

interface Doctor {
  id: string
  name: string
  specialization: string
  rating: number
  isActive: boolean
  totalBookings: number
}

interface Patient {
  id: string
  name: string
  email: string
  phone: string
  gender: string
  totalBookings: number
  lastBooking: string
}

interface NewDoctorForm {
  name: string
  specialization: string
  email: string
  password: string
  bio: string
  isActive: boolean
}

export default function AdminPanel() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/unauthorized")
    }
  }, [user, loading, router])

  // Mock data for doctors and patients
  const mockDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. John Smith",
      specialization: "Cardiologist",
      rating: 4.5,
      isActive: true,
      totalBookings: 15,
    },
    {
      id: "2",
      name: "Dr. Jane Doe",
      specialization: "Dermatologist",
      rating: 4.8,
      isActive: true,
      totalBookings: 12,
    },
    {
      id: "3",
      name: "Dr. Mike Johnson",
      specialization: "Orthopedic",
      rating: 4.2,
      isActive: false,
      totalBookings: 8,
    },
    {
      id: "4",
      name: "Dr. Sarah Wilson",
      specialization: "Pediatrician",
      rating: 4.9,
      isActive: true,
      totalBookings: 22,
    },
    {
      id: "5",
      name: "Dr. Robert Chen",
      specialization: "Neurologist",
      rating: 4.7,
      isActive: true,
      totalBookings: 18,
    },
    {
      id: "6",
      name: "Dr. Emily Rodriguez",
      specialization: "Gynecologist",
      rating: 4.6,
      isActive: true,
      totalBookings: 14,
    },
    {
      id: "7",
      name: "Dr. David Kumar",
      specialization: "Ophthalmologist",
      rating: 4.4,
      isActive: true,
      totalBookings: 11,
    },
    {
      id: "8",
      name: "Dr. Lisa Thompson",
      specialization: "Psychiatrist",
      rating: 4.8,
      isActive: true,
      totalBookings: 16,
    },
    {
      id: "9",
      name: "Dr. Ahmed Hassan",
      specialization: "Gastroenterologist",
      rating: 4.5,
      isActive: true,
      totalBookings: 13,
    },
    {
      id: "10",
      name: "Dr. Maria Garcia",
      specialization: "Endocrinologist",
      rating: 4.7,
      isActive: true,
      totalBookings: 19,
    },
    {
      id: "11",
      name: "Dr. James Park",
      specialization: "Urologist",
      rating: 4.3,
      isActive: true,
      totalBookings: 9,
    },
    {
      id: "12",
      name: "Dr. Rachel Green",
      specialization: "Rheumatologist",
      rating: 4.6,
      isActive: false,
      totalBookings: 7,
    },
    {
      id: "13",
      name: "Dr. Kevin Lee",
      specialization: "Pulmonologist",
      rating: 4.4,
      isActive: true,
      totalBookings: 10,
    },
    {
      id: "14",
      name: "Dr. Anna Petrov",
      specialization: "Oncologist",
      rating: 4.9,
      isActive: true,
      totalBookings: 25,
    },
    {
      id: "15",
      name: "Dr. Michael Brown",
      specialization: "Anesthesiologist",
      rating: 4.5,
      isActive: true,
      totalBookings: 12,
    },
    {
      id: "16",
      name: "Dr. Priya Sharma",
      specialization: "Radiologist",
      rating: 4.7,
      isActive: true,
      totalBookings: 17,
    },
    {
      id: "17",
      name: "Dr. Thomas Anderson",
      specialization: "Emergency Medicine",
      rating: 4.6,
      isActive: true,
      totalBookings: 21,
    },
    {
      id: "18",
      name: "Dr. Jennifer Liu",
      specialization: "Plastic Surgeon",
      rating: 4.8,
      isActive: true,
      totalBookings: 15,
    },
  ]

  const mockPatients: Patient[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "9876543210",
      gender: "Male",
      totalBookings: 3,
      lastBooking: "2025-06-07",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "9876543211",
      gender: "Female",
      totalBookings: 2,
      lastBooking: "2025-06-08",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "9876543212",
      gender: "Male",
      totalBookings: 1,
      lastBooking: "2025-06-09",
    },
  ]

  const [bookings, setBookings] = useState<DisplayBooking[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [selectedBooking, setSelectedBooking] = useState<DisplayBooking | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [doctorFilter, setDoctorFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [isAddingDoctor, setIsAddingDoctor] = useState(false)
  const doctorForm = useForm<NewDoctorForm>({
    defaultValues: {
      isActive: true,
    },
  })

  const handleAddDoctor = (data: NewDoctorForm) => {
    const newDoctor: Doctor = {
      id: `dr-${Date.now()}`,
      name: data.name,
      specialization: data.specialization,
      rating: 0,
      isActive: data.isActive,
      totalBookings: 0,
    }
    setDoctors((prev) => [...prev, newDoctor])
    doctorForm.reset()
    setIsAddingDoctor(false)
  }

  // Fetch bookings from Firebase
  useEffect(() => {
    async function fetchBookings() {
      try {
        const fetchedBookings: Booking[] = await getAllBookings()
        const displayBookings: DisplayBooking[] = fetchedBookings.map((booking) => ({
          id: booking.id || "",
          patientName: booking.patientName,
          patientEmail: booking.patientEmail || "N/A",
          patientPhone: booking.patientPhone,
          patientGender: booking.patientGender,
          patientAge: booking.patientAge,
          doctorName: booking.doctorName,
          doctorSpecialization: booking.specialization,
          date: booking.date,
          time: booking.time,
          healthIssue: booking.healthIssue,
          status: booking.status,
          createdAt: (booking.createdAt instanceof Timestamp
            ? booking.createdAt.toDate()
            : new Date(booking.createdAt)
          ).toISOString().split("T")[0],
          updatedAt: booking.updatedAt
            ? (booking.updatedAt instanceof Timestamp
                ? booking.updatedAt.toDate()
                : new Date(booking.updatedAt)
              ).toISOString().split("T")[0]
            : undefined,
          notes: booking.notes,
        }))
        setBookings(displayBookings)
      } catch (error) {
        setFetchError("Failed to load bookings. Please try again.")
        toast.error("Failed to Load Bookings", {
          description: "Please try again later.",
        })
      } finally {
        setFetchLoading(false)
      }
    }
    fetchBookings()
  }, [])

  if (loading || fetchLoading) {
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

  if (!user || user.role !== "admin") {
    return null
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6" />
                  <span>Admin Panel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">Error loading bookings</h3>
                  <p className="text-muted-foreground mb-4">{fetchError}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status.toLowerCase() === statusFilter
    const matchesDoctor = doctorFilter === "all" || booking.doctorName === doctorFilter

    return matchesSearch && matchesStatus && matchesDoctor
  })

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Statistics
  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "Pending").length,
    confirmedBookings: bookings.filter((b) => b.status === "Confirmed").length,
    completedBookings: bookings.filter((b) => b.status === "Completed").length,
    totalDoctors: doctors.length,
    activeDoctors: doctors.filter((d) => d.isActive).length,
    totalPatients: patients.length,
  }

  const handleStatusChange = async (bookingId: string, newStatus: DisplayBooking["status"]) => {
    try {
      await updateBookingStatus(bookingId, newStatus)
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: newStatus,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : booking
        )
      )
      toast.success("Booking Updated", {
        description: `Booking status changed to ${newStatus}.`,
      })
    } catch (error) {
      toast.error("Failed to Update Booking", {
        description: "Please try again.",
      })
    }
  }

  const handleDoctorStatusToggle = (doctorId: string) => {
    setDoctors((prev) =>
      prev.map((doctor) => (doctor.id === doctorId ? { ...doctor, isActive: !doctor.isActive } : doctor)),
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: "text-yellow-600 border-yellow-600",
      Confirmed: "text-green-600 border-green-600",
      Rejected: "text-red-600 border-red-600",
      Completed: "text-blue-600 border-blue-600",
      Cancelled: "text-gray-600 border-gray-600",
    }

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || "text-gray-600 border-gray-600"}>
        {status}
      </Badge>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Shield className="h-8 w-8" />
                <span>Admin Panel</span>
              </h1>
              <p className="text-muted-foreground">Manage bookings, doctors, and patients</p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalBookings}</p>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                    <p className="text-sm text-muted-foreground">Pending Approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="h-8 w-8 text-green-600" />
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
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">All Bookings</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>All Bookings</span>
                    <Badge variant="secondary">{filteredBookings.length} results</Badge>
                  </CardTitle>

                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search by patient, doctor, or booking ID..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Doctors</SelectItem>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.name}>
                            {doctor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.patientName}</p>
                                <p className="text-sm text-muted-foreground">{booking.patientEmail}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{booking.doctorName}</p>
                                <p className="text-sm text-muted-foreground">{booking.doctorSpecialization}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>{formatDate(booking.date)}</p>
                                <p className="text-sm text-muted-foreground">{formatTime(booking.time)} IST</p>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Booking Details</DialogTitle>
                                      <DialogDescription>
                                        Complete information for booking {booking.id}
                                      </DialogDescription>
                                    </DialogHeader>
                                    {selectedBooking && (
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Patient Name</Label>
                                            <p className="font-medium">{selectedBooking.patientName}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Email</Label>
                                            <p>{selectedBooking.patientEmail}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Phone</Label>
                                            <p>{selectedBooking.patientPhone}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Age & Gender</Label>
                                            <p>
                                              {selectedBooking.patientAge} years, {selectedBooking.patientGender}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="space-y-3">
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Doctor</Label>
                                            <p className="font-medium">{selectedBooking.doctorName}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Specialization</Label>
                                            <p>{selectedBooking.doctorSpecialization}</p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Date & Time</Label>
                                            <p>
                                              {formatDate(selectedBooking.date)} at {formatTime(selectedBooking.time)}
                                            </p>
                                          </div>
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Status</Label>
                                            <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                                          </div>
                                        </div>
                                        <div className="col-span-2 space-y-3">
                                          <div>
                                            <Label className="text-sm text-muted-foreground">Health Issue</Label>
                                            <p className="mt-1 p-3 bg-muted rounded-lg">{selectedBooking.healthIssue}</p>
                                          </div>
                                          {selectedBooking.notes && (
                                            <div>
                                              <Label className="text-sm text-muted-foreground">Notes</Label>
                                              <p className="mt-1 p-3 bg-muted rounded-lg">{selectedBooking.notes}</p>
                                            </div>
                                          )}
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <Label className="text-sm text-muted-foreground">Created At</Label>
                                              <p>{formatDate(selectedBooking.createdAt)}</p>
                                            </div>
                                            {selectedBooking.updatedAt && (
                                              <div>
                                                <Label className="text-sm text-muted-foreground">Updated At</Label>
                                                <p>{formatDate(selectedBooking.updatedAt)}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                {booking.status === "Pending" && (
                                  <>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 border-green-600 hover:bg-green-50"
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Confirm Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to confirm this booking for {booking.patientName}?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleStatusChange(booking.id, "Confirmed")}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            Confirm
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-600 hover:bg-red-50"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Reject Booking</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to reject this booking for {booking.patientName}?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleStatusChange(booking.id, "Rejected")}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Reject
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredBookings.length)} of{" "}
                        {filteredBookings.length} bookings
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Doctors Tab */}
            <TabsContent value="doctors">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Doctor Management</CardTitle>
                  <Dialog open={isAddingDoctor} onOpenChange={setIsAddingDoctor}>
                    <DialogTrigger asChild>
                      <Button>
                        <Stethoscope className="mr-2 h-4 w-4" />
                        Add New Doctor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Add New Doctor</DialogTitle>
                        <DialogDescription>
                          Enter the details of the new doctor. They will be able to login using these credentials.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={doctorForm.handleSubmit(handleAddDoctor)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              placeholder="Dr. John Smith"
                              {...doctorForm.register("name", { required: "Name is required" })}
                            />
                            {doctorForm.formState.errors.name && (
                              <p className="text-sm text-destructive">{doctorForm.formState.errors.name.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization</Label>
                            <Select
                              onValueChange={(value) => doctorForm.setValue("specialization", value)}
                              defaultValue={doctorForm.watch("specialization")}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select specialization" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                                <SelectItem value="Dermatologist">Dermatologist</SelectItem>
                                <SelectItem value="Neurologist">Neurologist</SelectItem>
                                <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                                <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                                <SelectItem value="Psychiatrist">Psychiatrist</SelectItem>
                                <SelectItem value="Gynecologist">Gynecologist</SelectItem>
                                <SelectItem value="Ophthalmologist">Ophthalmologist</SelectItem>
                              </SelectContent>
                            </Select>
                            {doctorForm.formState.errors.specialization && (
                              <p className="text-sm text-destructive">
                                {doctorForm.formState.errors.specialization.message}
                              </p>
                            )}
                            <input
                              type="hidden"
                              {...doctorForm.register("specialization", { required: "Specialization is required" })}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="doctor@example.com"
                              {...doctorForm.register("email", {
                                required: "Email is required",
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: "Invalid email address",
                                },
                              })}
                            />
                            {doctorForm.formState.errors.email && (
                              <p className="text-sm text-destructive">{doctorForm.formState.errors.email.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              {...doctorForm.register("password", {
                                required: "Password is required",
                                minLength: {
                                  value: 6,
                                  message: "Password must be at least 6 characters",
                                },
                              })}
                            />
                            {doctorForm.formState.errors.password && (
                              <p className="text-sm text-destructive">{doctorForm.formState.errors.password.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Professional Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Brief professional background and expertise..."
                            className="min-h-[100px]"
                            {...doctorForm.register("bio")}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="active"
                            checked={doctorForm.watch("isActive")}
                            onCheckedChange={(checked) => doctorForm.setValue("isActive", checked)}
                          />
                          <Label htmlFor="active">Active (available for appointments)</Label>
                          <input type="hidden" {...doctorForm.register("isActive")} />
                        </div>

                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsAddingDoctor(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">Add Doctor</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Total Bookings</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {doctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span>{doctor.rating}</span>
                              <span className="text-yellow-400">★</span>
                            </div>
                          </TableCell>
                          <TableCell>{doctor.totalBookings}</TableCell>
                          <TableCell>
                            <Badge variant={doctor.isActive ? "default" : "secondary"}>
                              {doctor.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => handleDoctorStatusToggle(doctor.id)}>
                              {doctor.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Patients Tab */}
            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Total Bookings</TableHead>
                        <TableHead>Last Booking</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.name}</TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>{patient.gender}</TableCell>
                          <TableCell>{patient.totalBookings}</TableCell>
                          <TableCell>{formatDate(patient.lastBooking)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
