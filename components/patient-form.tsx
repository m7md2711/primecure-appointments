"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Loader2, User, Phone, FileText } from "lucide-react"

interface TimeSlot {
  StartTime: string
  EndTime: string
}

interface Doctor {
  DoctorID: number
  Name: string
}

interface PatientFormProps {
  doctor: Doctor
  date: Date
  timeSlot: TimeSlot
  onSubmit: (data: { fullName: string; mobile: string; description: string }) => void
  onBack: () => void
}

export function PatientForm({ doctor, date, timeSlot, onSubmit, onBack }: PatientFormProps) {
  const [fullName, setFullName] = useState("")
  const [mobile, setMobile] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !mobile.trim()) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor.DoctorID,
          date,
          timeSlot,
          fullName,
          mobile,
          description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to book appointment")
      }

      onSubmit({ fullName, mobile, description })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <Button type="button" variant="ghost" onClick={onBack} className="mb-2 hover:bg-muted transition-colors">
        <ChevronLeft className="h-5 w-5 mr-2" />
        Back to Time Slots
      </Button>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Patient Information</h3>
            <p className="text-sm text-muted-foreground">Please fill in your details</p>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-xl border border-destructive/20 mb-6 animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Full Name *
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="h-12 text-base shadow-sm focus:shadow-md transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-base font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Mobile Number *
            </Label>
            <Input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+971XXXXXXXXX"
              required
              className="h-12 text-base shadow-sm focus:shadow-md transition-shadow"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your symptoms or reason for visit"
              rows={4}
              className="text-base shadow-sm focus:shadow-md transition-shadow resize-none"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Booking Your Appointment...
          </>
        ) : (
          "Confirm & Book Appointment"
        )}
      </Button>
    </form>
  )
}
