"use client"

import { useState, useEffect } from "react"
import { DoctorCard } from "@/components/doctor-card"
import { BookingModal } from "@/components/booking-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Stethoscope, Building2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface Doctor {
  DoctorID: number
  Name: string
  DoctorSpecialityID: number
  ClinicID: number
  ImgPath: string
  LicenseNo: string
}

interface Clinic {
  Id: number
  Name: string
  ShowInApp: boolean
}

interface LookupData {
  Doctors: Doctor[]
  Clinics: Clinic[]
}

export default function AppointmentsPage() {
  const [lookupData, setLookupData] = useState<LookupData | null>(null)
  const [selectedClinic, setSelectedClinic] = useState<string>("0")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchLookupData()
  }, [])

  const fetchLookupData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/lookup")
      if (!response.ok) throw new Error("Failed to fetch data")
      const data = await response.json()
      setLookupData(data)
    } catch (err) {
      setError("Failed to load doctors. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDoctors =
    lookupData?.Doctors.filter((doctor) => {
      const matchesClinic = selectedClinic === "0" || doctor.ClinicID === Number.parseInt(selectedClinic)
      const matchesSearch = doctor.Name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesClinic && matchesSearch
    }) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-left duration-500">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 flex-shrink-0">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LjfqKls7FLQijcDFIgzKAwBLXQEYmZ.png"
                  alt="Prima Cure Medical Center Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Prima Cure Medical Center</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Your Health, Our Priority</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 lg:mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 text-balance">
            Choose Your Appointment
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">
            Select a clinic and find the perfect doctor for your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-8">
            {/* Clinic Filter */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-100">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Building2 className="h-5 w-5 text-primary" />
                Select Clinic
              </label>
              <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                <SelectTrigger className="h-12 text-base shadow-sm hover:shadow-md transition-shadow">
                  <SelectValue placeholder="All Clinics" />
                </SelectTrigger>
                <SelectContent>
                  {lookupData?.Clinics.map((clinic) => (
                    <SelectItem key={clinic.Id} value={clinic.Id.toString()} className="text-base py-3">
                      {clinic.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Filter */}
            <div className="space-y-2 animate-in fade-in slide-in-from-right duration-500 delay-200">
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Search className="h-5 w-5 text-primary" />
                Search Doctor
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by doctor name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 text-base shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading doctors...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-xl border border-destructive/20 animate-in fade-in slide-in-from-top duration-300">
              {error}
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredDoctors.map((doctor, index) => (
                <div
                  key={doctor.DoctorID}
                  className="animate-in fade-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <DoctorCard doctor={doctor} onBook={() => setSelectedDoctor(doctor)} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && filteredDoctors.length === 0 && (
            <div className="text-center py-20 animate-in fade-in duration-300">
              <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Stethoscope className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">No doctors found matching your criteria.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {selectedDoctor && <BookingModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />}
    </div>
  )
}
