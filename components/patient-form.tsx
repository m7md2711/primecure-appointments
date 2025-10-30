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

const UAE_PREFIXES = ["50", "52", "54", "55", "56", "58"];

export function PatientForm({ doctor, date, timeSlot, onSubmit, onBack }: PatientFormProps) {
  const [fullName, setFullName] = useState("")
  const [prefix, setPrefix] = useState(UAE_PREFIXES[0])
  const [mobileRest, setMobileRest] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMobileRestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 7)
    setMobileRest(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim() || !mobileRest.trim() || mobileRest.length !== 7) {
      setError("Please enter a valid UAE mobile number")
      return
    }

    const mobile = `+971${prefix}${mobileRest}`

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
            <Label htmlFor="mobile-rest" className="text-base font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Mobile Number *
            </Label>
            <div className="flex gap-2 items-center">
              <span className="h-12 flex items-center px-2 bg-muted text-base rounded-l-md border border-input border-r-0 select-none">+971</span>
              <select
                value={prefix}
                onChange={e => setPrefix(e.target.value)}
                className="h-12 text-base bg-muted px-2 border-none outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="UAE Mobile Prefix"
              >
                {UAE_PREFIXES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <Input
                id="mobile-rest"
                type="tel"
                inputMode="numeric"
                value={mobileRest}
                onChange={handleMobileRestChange}
                placeholder="1234567"
                required
                minLength={7}
                maxLength={7}
                className="h-12 w-32 text-base shadow-sm focus:shadow-md transition-shadow border-l-0 rounded-l-none"
                pattern="[0-9]{7}"
                aria-invalid={mobileRest.length !== 7}
                autoComplete="tel"
              />
            </div>
            <small className="text-muted-foreground"></small>
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
