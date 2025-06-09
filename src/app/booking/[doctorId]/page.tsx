import { Suspense } from "react"
import { notFound } from "next/navigation"
import { BookingForm } from "@/components/booking-form"
import { NavBar } from "@/components/nav-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import Image from "next/image"
import { requirePatientAuth } from "@/lib/auth-helpers"

// Mock doctors data
const doctors = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialization: "Cardiologist",
    rating: 4.5,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 2,
    name: "Dr. Jane Doe",
    specialization: "Dermatologist",
    rating: 4.8,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 3,
    name: "Dr. Mike Johnson",
    specialization: "Orthopedic",
    rating: 4.2,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 4,
    name: "Dr. Sarah Wilson",
    specialization: "Pediatrician",
    rating: 4.9,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 5,
    name: "Dr. Robert Chen",
    specialization: "Neurologist",
    rating: 4.7,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 6,
    name: "Dr. Emily Rodriguez",
    specialization: "Gynecologist",
    rating: 4.6,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 7,
    name: "Dr. David Kumar",
    specialization: "Ophthalmologist",
    rating: 4.4,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 8,
    name: "Dr. Lisa Thompson",
    specialization: "Psychiatrist",
    rating: 4.8,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 9,
    name: "Dr. Ahmed Hassan",
    specialization: "Gastroenterologist",
    rating: 4.5,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 10,
    name: "Dr. Maria Garcia",
    specialization: "Endocrinologist",
    rating: 4.7,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 11,
    name: "Dr. James Park",
    specialization: "Urologist",
    rating: 4.3,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 12,
    name: "Dr. Rachel Green",
    specialization: "Rheumatologist",
    rating: 4.6,
    isActive: false,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 13,
    name: "Dr. Kevin Lee",
    specialization: "Pulmonologist",
    rating: 4.4,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 14,
    name: "Dr. Anna Petrov",
    specialization: "Oncologist",
    rating: 4.9,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 15,
    name: "Dr. Michael Brown",
    specialization: "Anesthesiologist",
    rating: 4.5,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 16,
    name: "Dr. Priya Sharma",
    specialization: "Radiologist",
    rating: 4.7,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 17,
    name: "Dr. Thomas Anderson",
    specialization: "Emergency Medicine",
    rating: 4.6,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
  {
    id: 18,
    name: "Dr. Jennifer Liu",
    specialization: "Plastic Surgeon",
    rating: 4.8,
    isActive: true,
    imageUrl: "https://placehold.co/200x200",
  },
]

interface BookingPageProps {
  params: Promise<{ doctorId: string }>
}

function BookingPageContent({ doctorId }: { doctorId: string }) {
  const doctor = doctors.find((d) => d.id === Number.parseInt(doctorId))

  if (!doctor) {
    notFound()
  }

  if (!doctor.isActive) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Doctor Unavailable</h2>
              <p className="text-muted-foreground">This doctor is currently not accepting appointments.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Doctor Info */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                <Image
                  src={doctor.imageUrl || "/placeholder.svg"}
                  alt={doctor.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
                <div className="text-center md:text-left">
                  <CardTitle className="text-2xl mb-2">{doctor.name}</CardTitle>
                  <p className="text-lg text-muted-foreground mb-2">{doctor.specialization}</p>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{doctor.rating}</span>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingForm
                doctorId={doctor.id.toString()}
                doctorName={doctor.name}
                specialization={doctor.specialization}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default async function BookingPage({ params }: BookingPageProps) {
  // Require patient authentication
  await requirePatientAuth()

  const { doctorId } = await params

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <NavBar />
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-8"></div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <BookingPageContent doctorId={doctorId} />
    </Suspense>
  )
}
