"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { CheckCircle, Calendar, Clock, User, Phone, FileText } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getBookingById, type Booking } from "@/lib/booking-service"
import { format } from "date-fns"

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setError("Booking ID not found")
        setLoading(false)
        return
      }

      try {
        const bookingData = await getBookingById(bookingId)
        setBooking(bookingData)
      } catch (err) {
        console.error("Error fetching booking:", err)
        setError("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/2 mb-8 mx-auto"></div>
              <div className="h-64 bg-muted rounded mb-4"></div>
              <div className="h-10 bg-muted rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">{error || "Booking not found"}</p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE, MMMM d, yyyy")
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
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200">
            <CardHeader className="text-center border-b pb-6">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 p-3 text-green-600">
                <CheckCircle className="h-full w-full" />
              </div>
              <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
              <p className="text-muted-foreground">Your appointment has been successfully scheduled</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center space-x-3 rounded-lg border p-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{formatTime(booking.time)} IST</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Doctor Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.doctorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.specialization}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Patient Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.patientPhone}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Booking Reference</h3>
                  <p className="font-mono text-sm">{booking.id}</p>
                </div>

                <div className="text-center space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Please arrive 15 minutes before your scheduled appointment time.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link href="/my-bookings">View My Bookings</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/">Return to Home</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
