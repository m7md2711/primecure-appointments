"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CalendarDays, ArrowRight } from "lucide-react"

interface DateSelectorProps {
  onSelectDate: (date: Date) => void
}

export function DateSelector({ onSelectDate }: DateSelectorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [date, setDate] = useState<Date | undefined>(today);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
  }

  const handleContinue = () => {
    if (date) {
      onSelectDate(date)
    }
  }

  // Allow booking from today onward
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Select Appointment Date</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Choose a date for your appointment</p>
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={(date) => date < minDate}
            className="rounded-xl border shadow-lg bg-card p-4"
          />
        </div>
      </div>
      <Button
        onClick={handleContinue}
        className="w-full h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
      >
        Continue
        <ArrowRight className="h-5 w-5 ml-2" />
      </Button>
    </div>
  )
}
