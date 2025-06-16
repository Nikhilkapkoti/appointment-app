"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, User, Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"
import { NavBar } from "@/components/nav-bar"

// Define doctor type
interface Doctor {
  id: number
  name: string
  specialization: string
  rating: number
  isActive: boolean
  imageUrl: string
}

// Mock data for doctors
const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialization: "Cardiologist",
    rating: 4.5,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2281709217/display_1500/stock-vector-male-doctor-smiling-self-confidence-flat-vector-style-characters-healthcare-illustrations-2281709217.jpg",
  },
  {
    id: 2,
    name: "Dr. Jane Doe",
    specialization: "Dermatologist",
    rating: 4.8,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2481032615/display_1500/stock-vector-male-doctor-smiling-with-happy-face-holding-a-computer-tablet-flat-vector-style-characters-2481032615.jpg",
  },
  {
    id: 3,
    name: "Dr. Mike Johnson",
    specialization: "Orthopedic",
    rating: 4.2,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2574623365/display_1500/stock-vector-doctor-isolate-vector-charecter-illustration-2574623365.jpg",
  },
  {
    id: 4,
    name: "Dr. Sarah Wilson",
    specialization: "Pediatrician",
    rating: 4.9,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2281710309/display_1500/stock-vector-female-doctor-smiling-and-writing-on-clip-board-flat-vector-style-characters-healthcare-2281710309.jpg",
  },
  {
    id: 5,
    name: "Dr. Robert Chen",
    specialization: "Neurologist",
    rating: 4.7,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2281709525/display_1500/stock-vector-friendly-male-doctor-flat-vector-style-characters-healthcare-illustrations-2281709525.jpg",
  },
  {
    id: 6,
    name: "Dr. Emily Rodriguez",
    specialization: "Gynecologist",
    rating: 4.6,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2609997749/display_1500/stock-vector-nurse-with-stethoscope-and-hand-out-to-side-for-national-nurses-day-2609997749.jpg",
  },
  {
    id: 7,
    name: "Dr. David Kumar",
    specialization: "Ophthalmologist",
    rating: 4.4,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2281709301/display_1500/stock-vector-good-male-doctor-pointing-at-somethings-flat-vector-style-characters-healthcare-illustrations-2281709301.jpg",
  },
  {
    id: 8,
    name: "Dr. Lisa Thompson",
    specialization: "Psychiatrist",
    rating: 4.8,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2374744065/display_1500/stock-photo--young-woman-nurse-with-a-stethoscope-pointing-at-clipboard-paper-medical-check-up-2374744065.jpg",
  },
  {
    id: 9,
    name: "Dr. Ahmed Hassan",
    specialization: "Gastroenterologist",
    rating: 4.5,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2441516949/display_1500/stock-vector-doctor-icon-vector-doctor-design-doctor-logo-medical-doctor-logo-eps-2441516949.jpg",
  },
  {
    id: 10,
    name: "Dr. Maria Garcia",
    specialization: "Endocrinologist",
    rating: 4.7,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2430828609/display_1500/stock-vector-young-latina-woman-nurse-using-digital-tablet-flat-vector-illustration-isolated-on-white-background-2430828609.jpg",
  },
  {
    id: 11,
    name: "Dr. James Park",
    specialization: "Urologist",
    rating: 4.3,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/1782099236/display_1500/stock-vector-professional-doctor-with-stethoscope-and-uniform-man-doctor-hospital-worker-vector-illustration-1782099236.jpg",
  },
  {
    id: 12,
    name: "Dr. Rachel Green",
    specialization: "Rheumatologist",
    rating: 4.6,
    isActive: false,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2540147315/display_1500/stock-vector-young-woman-medical-worker-standing-and-holding-a-binder-flat-vector-illustration-isolated-on-2540147315.jpg",
  },
  {
    id: 13,
    name: "Dr. Kevin Lee",
    specialization: "Pulmonologist",
    rating: 4.4,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2281709217/display_1500/stock-vector-male-doctor-smiling-self-confidence-flat-vector-style-characters-healthcare-illustrations-2281709217.jpg",
  },
  {
    id: 14,
    name: "Dr. Anna Petrov",
    specialization: "Oncologist",
    rating: 4.9,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2574623365/display_1500/stock-vector-doctor-isolate-vector-charecter-illustration-2574623365.jpg",
  },
  {
    id: 15,
    name: "Dr. Michael Brown",
    specialization: "Anesthesiologist",
    rating: 4.5,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2481032615/display_1500/stock-vector-male-doctor-smiling-with-happy-face-holding-a-computer-tablet-flat-vector-style-characters-2481032615.jpg",
  },
  {
    id: 16,
    name: "Dr. Priya Sharma",
    specialization: "Radiologist",
    rating: 4.7,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2415890793/display_1500/stock-vector-young-nurse-in-uniform-holding-notebook-and-pen-to-take-notes-health-worker-intern-woman-standing-2415890793.jpg",
  },
  {
    id: 17,
    name: "Dr. Thomas Anderson",
    specialization: "Emergency Medicine",
    rating: 4.6,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2281709525/display_1500/stock-vector-friendly-male-doctor-flat-vector-style-characters-healthcare-illustrations-2281709525.jpg",
  },
  {
    id: 18,
    name: "Dr. Jennifer Liu",
    specialization: "Plastic Surgeon",
    rating: 4.8,
    isActive: true,
    imageUrl: "https://www.shutterstock.com/shutterstock/photos/2280614439/display_1500/stock-vector-black-female-doctor-in-medical-gown-a-family-doctor-is-pointing-to-something-while-holding-a-2280614439.jpg",
  },
]

const specializations = [
  "All",
  "Cardiologist",
  "Dermatologist",
  "Orthopedic",
  "Neurologist",
  "Pediatrician",
  "Gynecologist",
  "Ophthalmologist",
  "Psychiatrist",
  "Gastroenterologist",
  "Endocrinologist",
  "Urologist",
  "Rheumatologist",
  "Pulmonologist",
  "Oncologist",
  "Anesthesiologist",
  "Radiologist",
  "Emergency Medicine",
  "Plastic Surgeon",
]

function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Book Your Appointment Today!</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Connect with experienced doctors and get the care you deserve
        </p>
        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
          <Calendar className="mr-2 h-5 w-5" />
          Find a Doctor
        </Button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-400">
              Your trusted platform for connecting with certified medical professionals.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <p className="text-gray-400">Email: support@example.com</p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
            <p className="text-gray-400">Address: 123 Health Lane, City, Country</p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          © {new Date().getFullYear()} HealthCare Booking Platform. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Image
            src={doctor.imageUrl}
            alt={doctor.name}
            width={200}
            height={200}
            className="rounded-full mx-auto"
            priority={false}
          />
        </div>
        <CardTitle className="text-xl">{doctor.name}</CardTitle>
        <p className="text-muted-foreground">{doctor.specialization}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
          </div>
          <Badge variant={doctor.isActive ? "default" : "secondary"}>
            {doctor.isActive ? "Active" : "Not Active"}
          </Badge>
        </div>
        <Button className="w-full" disabled={!doctor.isActive} asChild={doctor.isActive}>
          {doctor.isActive ? (
            <Link href={`/booking/${doctor.id}`}>
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Link>
          ) : (
            <span>
              <User className="mr-2 h-4 w-4 inline-block" />
              Doctor Unavailable
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

function DoctorFilters({
  onSearch,
  onFilter,
}: {
  onSearch: (value: string) => void
  onFilter: (value: string) => void
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search doctors by name..."
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      <Select onValueChange={onFilter} defaultValue="All">
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Filter by specialization" />
        </SelectTrigger>
        <SelectContent>
          {specializations.map((spec) => (
            <SelectItem key={spec} value={spec}>
              {spec}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("All")

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization =
      selectedSpecialization === "All" || doctor.specialization === selectedSpecialization
    return matchesSearch && matchesSpecialization
  })

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Doctors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our experienced team of medical professionals
          </p>
        </div>
        <DoctorFilters onSearch={setSearchTerm} onFilter={setSelectedSpecialization} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}