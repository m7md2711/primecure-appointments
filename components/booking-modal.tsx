"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DateSelector } from "@/components/date-selector"
import { TimeSlotSelector } from "@/components/time-slot-selector"
import { PatientForm } from "@/components/patient-form"
import { ConfirmationView } from "@/components/confirmation-view"

interface Doctor {
  DoctorID: number
  Name: string
  DoctorSpecialityID: number
  ClinicID: number
  ImgPath: string
  LicenseNo: string
}

interface BookingModalProps {
  doctor: Doctor
  onClose: () => void
}

interface TimeSlot {
  StartTime: string
  EndTime: string
}

interface PatientData {
  fullName: string
  mobile: string
  description: string
}

interface AppointmentData extends PatientData {
  date: Date
  timeSlot: TimeSlot
}

export function BookingModal({ doctor, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"date" | "time" | "form" | "confirmation">("date")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setStep("time")
  }

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot)
    setStep("form")
  }

  const handlePatientSubmit = (patientData: PatientData) => {
    if (selectedDate && selectedTimeSlot) {
      setAppointmentData({
        ...patientData,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      })
      setStep("confirmation")
    }
  }

  const handleBack = () => {
    if (step === "time") setStep("date")
    else if (step === "form") setStep("time")
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === "confirmation" ? "Appointment Confirmed" : `Book Appointment with Dr. ${doctor.Name}`}
          </DialogTitle>
        </DialogHeader>

        {step === "date" && <DateSelector onSelectDate={handleDateSelect} />}

        {step === "time" && selectedDate && (
          <TimeSlotSelector
            doctorId={doctor.DoctorID}
            date={selectedDate}
            onSelectTimeSlot={handleTimeSlotSelect}
            onBack={handleBack}
          />
        )}

        {step === "form" && selectedDate && selectedTimeSlot && (
          <PatientForm
            doctor={doctor}
            date={selectedDate}
            timeSlot={selectedTimeSlot}
            onSubmit={handlePatientSubmit}
            onBack={handleBack}
          />
        )}

        {step === "confirmation" && appointmentData && (
          <ConfirmationView doctor={doctor} appointmentData={appointmentData} onClose={onClose} />
        )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
