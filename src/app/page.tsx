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

// Mock data for doctors - expanded list
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

function DoctorCard({ doctor }: { doctor: (typeof doctors)[0] }) {
  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Image
            src={doctor.imageUrl || "/placeholder.svg"}
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
          <Badge variant={doctor.isActive ? "default" : "secondary"}>{doctor.isActive ? "Active" : "Not Active"}</Badge>
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

function DoctorFilters({ onSearch, onFilter }: { onSearch: (value: string) => void, onFilter: (value: string) => void }) {
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

        <DoctorFilters 
          onSearch={setSearchTerm}
          onFilter={setSelectedSpecialization}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </main>
    </div>
  )
}