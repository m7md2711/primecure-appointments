"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Clock, ChevronLeft, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface TimeSlot {
  StartTime: string
  EndTime: string
}

interface TimeSlotSelectorProps {
  doctorId: number
  date: Date
  onSelectTimeSlot: (timeSlot: TimeSlot) => void
  onBack: () => void
}

export function TimeSlotSelector({ doctorId, date, onSelectTimeSlot, onBack }: TimeSlotSelectorProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTimeSlots()
  }, [doctorId, date])

  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const formattedDate = format(date, "yyyy-MM-dd")
      const response = await fetch(`/api/time-slots?date=${formattedDate}&doctorId=${doctorId}`)
      if (!response.ok) throw new Error("Failed to fetch time slots")
      const data = await response.json()
      setTimeSlots(data)
    } catch (err) {
      setError("Failed to load available time slots")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    if (selectedSlot) {
      onSelectTimeSlot(selectedSlot)
    }
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <Button variant="ghost" onClick={onBack} className="mb-2 hover:bg-muted transition-colors">
        <ChevronLeft className="h-5 w-5 mr-2" />
        Back to Date
      </Button>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Select Time Slot</h3>
            <p className="text-sm text-muted-foreground">{format(date, "EEEE, MMMM d, yyyy")}</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading available time slots...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-xl border border-destructive/20 animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {!isLoading && !error && timeSlots.length === 0 && (
          <div className="text-center py-16 animate-in fade-in duration-300">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground">No available time slots for this date.</p>
            <p className="text-sm text-muted-foreground mt-2">Please try selecting a different date.</p>
          </div>
        )}

        {!isLoading && !error && timeSlots.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlot(slot)}
                className={`group p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom ${
                  selectedSlot === slot
                    ? "border-secondary bg-secondary/10 shadow-md"
                    : "border-border hover:border-secondary/50"
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm font-semibold text-foreground">{formatTime(slot.StartTime)}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!selectedSlot}
        className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
      >
        Continue to Patient Info
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  )
}
