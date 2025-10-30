"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Calendar } from "lucide-react"
import Image from "next/image"

interface Doctor {
  DoctorID: number
  Name: string
  DoctorSpecialityID: number
  ClinicID: number
  ImgPath: string
  LicenseNo: string
}

interface DoctorCardProps {
  doctor: Doctor
  onBook: () => void
}

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const hasImage = doctor.ImgPath && doctor.ImgPath !== "0"

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="relative h-56 sm:h-64 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {hasImage ? (
          <Image
            src={doctor.ImgPath || "/placeholder.svg"}
            alt={doctor.Name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <User className="h-12 w-12 sm:h-14 sm:w-14 text-primary" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-5 sm:p-6">
        <h3 className="font-bold text-base sm:text-lg text-foreground mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
          {doctor.Name}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          License: {doctor.LicenseNo}
        </p>
        <Button
          onClick={onBook}
          className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
        >
          <Calendar className="h-5 w-5 mr-2" />
          BOOK NOW
        </Button>
      </CardContent>
    </Card>
  )
}
