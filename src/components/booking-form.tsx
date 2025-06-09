"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Clock, CalendarIcon, User, Phone } from "lucide-react"
import { format, addDays, isBefore, startOfDay, getDay } from "date-fns"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { createBooking, isTimeSlotBooked } from "@/lib/booking-service"
import { toast } from "sonner"

interface BookingFormProps {
  doctorId: string
  doctorName: string
  specialization: string
}

interface BookingFormData {
  name: string
  gender: string
  age: number
  phone: string
  healthIssue: string
}

// Updated time slots based on schedule management
const getAvailableTimeSlots = (date: Date, doctorId: string) => {
  const dayOfWeek = getDay(date) // 0 = Sunday, 1 = Monday, etc.
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Mock schedule data - in real app this would come from the schedule management system
  const doctorSchedules = {
    "1": {
      // Dr. John Smith
      Monday: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
      Tuesday: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
      Wednesday: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
      Thursday: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
      Friday: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
      Saturday: ["09:00", "09:30", "10:00", "10:30", "11:00"],
      Sunday: [], // Not available on Sundays
    },
    "2": {
      // Dr. Jane Doe
      Monday: ["10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30"],
      Tuesday: ["10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30"],
      Wednesday: ["10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30"],
      Thursday: ["10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30"],
      Friday: ["10:00", "10:30", "11:00", "11:30", "15:00", "15:30", "16:00", "16:30"],
      Saturday: [],
      Sunday: [],
    },
    // Default schedule for other doctors
    default: {
      Monday: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
      Tuesday: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
      Wednesday: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
      Thursday: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
      Friday: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
      Saturday: ["09:00", "09:30", "10:00", "10:30"],
      Sunday: [],
    },
  }

  const dayName = dayNames[dayOfWeek] as keyof (typeof doctorSchedules)[keyof typeof doctorSchedules]
  return (
    doctorSchedules[doctorId as keyof typeof doctorSchedules]?.[dayName] || doctorSchedules["default"][dayName] || []
  )
}

export function BookingForm({ doctorId, doctorName, specialization }: BookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([])
  const { user } = useAuth()
  const router = useRouter()

  // Validate props
  const validateProps = () => {
    if (!doctorId || !doctorName || !specialization) {
      setError("Doctor information is missing. Please go back and select a doctor again.")
    }
  }

  validateProps()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      gender: user?.gender || "male",
    },
  })

  const today = startOfDay(new Date())
  const maxDate = addDays(today, 30) // Allow booking up to 30 days ahead

  const isSlotBooked = (date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return bookedSlots.some((slot) => slot.date === dateStr && slot.time === time)
  }

  const isDayAvailable = (date: Date) => {
    if (isBefore(date, today) || date > maxDate) return false
    const availableSlots = getAvailableTimeSlots(date, doctorId)
    return availableSlots.length > 0
  }

  // Check booked slots when date is selected
  const checkBookedSlots = async (date: Date) => {
    try {
      const dateStr = format(date, "yyyy-MM-dd")
      const slots = await Promise.all(
        getAvailableTimeSlots(date, doctorId).map(async (time) => {
          const isBooked = await isTimeSlotBooked(doctorId, dateStr, time)
          return isBooked ? { date: dateStr, time } : null
        }),
      )
      setBookedSlots(slots.filter(Boolean) as { date: string; time: string }[])
    } catch (error) {
      console.error("Error checking booked slots:", error)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime("")
    if (date) {
      checkBookedSlots(date)
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time")
      return
    }

    if (!user) {
      router.push("/auth/login")
      return
    }

    // Validate that we have all required doctor information
    if (!doctorId || !doctorName || !specialization) {
      setError("Doctor information is missing. Please try again.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd")

      // Check one more time if the slot is already booked
      const isBooked = await isTimeSlotBooked(doctorId, dateStr, selectedTime)
      if (isBooked) {
        setError("This time slot has just been booked. Please select another time.")
        setIsLoading(false)
        return
      }

      const bookingData = {
        patientId: user.id,
        patientName: data.name,
        patientEmail: user.email || "",
        patientPhone: data.phone,
        patientGender: data.gender,
        patientAge: Number(data.age),
        doctorId: doctorId,
        doctorName: doctorName,
        specialization: specialization,
        date: dateStr,
        time: selectedTime,
        healthIssue: data.healthIssue,
        status: "Pending" as const,
      }

      console.log("Submitting booking data:", bookingData) // Debug log

      const bookingId = await createBooking(bookingData)

      toast.success("Appointment Booked!", {
  description: "Your appointment has been successfully scheduled.",
})

      // Redirect to confirmation page
      router.push(`/booking/confirmation?id=${bookingId}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to book appointment. Please try again."
      setError(errorMessage)
      console.error("Booking error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const availableTimeSlots = selectedDate ? getAvailableTimeSlots(selectedDate, doctorId) : []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Select Date</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => !isDayAvailable(date)}
            className="rounded-md border"
          />
          {selectedDate && (
            <p className="mt-2 text-sm text-muted-foreground">Selected: {format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
          )}
        </CardContent>
      </Card>

      {/* Time Selection */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Select Time (IST)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableTimeSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No available time slots for this date</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {availableTimeSlots.map((time) => {
                  const isBooked = isSlotBooked(selectedDate, time)
                  const isSelected = selectedTime === time

                  return (
                    <Button
                      key={time}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(time)}
                      className="relative"
                    >
                      {time}
                      {isBooked && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs">
                          Booked
                        </Badge>
                      )}
                    </Button>
                  )
                })}
              </div>
            )}
            {selectedTime && <p className="mt-2 text-sm text-muted-foreground">Selected: {selectedTime} IST</p>}
          </CardContent>
        </Card>
      )}

      {/* Patient Details */}
      {selectedDate && selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Patient Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => setValue("gender", value)} defaultValue={user?.gender || "male"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("gender", { required: "Gender is required" })} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 1, message: "Age must be at least 1" },
                    max: { value: 120, message: "Age must be less than 120" },
                  })}
                />
                {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="phone"
                    type="tel"
                    className="pl-10"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be exactly 10 digits",
                      },
                    })}
                  />
                </div>
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthIssue">Health Issue / Reason for Visit</Label>
              <Textarea
                id="healthIssue"
                placeholder="Please describe your health concern or reason for the appointment"
                rows={3}
                {...register("healthIssue", { required: "Health issue description is required" })}
              />
              {errors.healthIssue && <p className="text-sm text-destructive">{errors.healthIssue.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Confirming Booking..." : "Confirm Booking"}
            </Button>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
