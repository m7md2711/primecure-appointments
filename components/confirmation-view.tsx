"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, Calendar, User, Phone, Clock, FileText } from "lucide-react"
import { format } from "date-fns"

interface TimeSlot {
  StartTime: string
  EndTime: string
}

interface AppointmentData {
  fullName: string
  mobile: string
  description: string
  date: Date
  timeSlot: TimeSlot
}

interface Doctor {
  DoctorID: number
  Name: string
  LicenseNo: string
}

interface ConfirmationViewProps {
  doctor: Doctor
  appointmentData: AppointmentData
  onClose: () => void
}

export function ConfirmationView({ doctor, appointmentData, onClose }: ConfirmationViewProps) {
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a")
  }

  const downloadPDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const appointmentHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prima Cure Medical Center - Appointment</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header { color: #2B4170; font-size: 24px; font-weight: 800; margin-bottom: 8px; }
            .title { font-size: 16px; font-weight: 700; margin-bottom: 20px; color: #C9A961; }
            .section-title { font-size: 14px; font-weight: 700; margin: 20px 0 10px; color: #2B4170; }
            .detail-row { margin-bottom: 10px; line-height: 1.5; }
            .label {
              font-weight: bold;
              color: #333;
            }
            .value {
              color: #666;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #888;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">Prima Cure Medical Center</div>
          <div class="title">Appointment Confirmation</div>
          <div class="section-title">Appointment Details</div>
          
          <div class="detail-row">
            <span class="label">Patient Name:</span>
            <span class="value">${appointmentData.fullName}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Mobile:</span>
            <span class="value">${appointmentData.mobile}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Doctor:</span>
            <span class="value">Dr. ${doctor.Name}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">${format(appointmentData.date, "EEEE, MMMM d, yyyy")}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Time:</span>
            <span class="value">${formatTime(appointmentData.timeSlot.StartTime)} - ${formatTime(appointmentData.timeSlot.EndTime)}</span>
          </div>
          
          ${
            appointmentData.description
              ? `
          <div class="detail-row">
            <span class="label">Description:</span>
            <span class="value">${appointmentData.description}</span>
          </div>
          `
              : ""
          }
          
          <div class="footer">
            <p>Please arrive 15 minutes before your appointment time.</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.write(appointmentHTML)
    printWindow.document.close()
  }

  return (
    <div className="space-y-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex justify-center animate-in zoom-in duration-700 delay-100">
        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom duration-500 delay-200">
        <h3 className="text-2xl font-bold mb-3 text-foreground">Appointment Confirmed!</h3>
        <p className="text-base text-muted-foreground">
          Your appointment has been successfully booked. A confirmation will be sent to your mobile.
        </p>
      </div>

      <div className="bg-gradient-to-br from-muted/50 to-muted p-6 sm:p-8 rounded-2xl text-left space-y-5 shadow-lg border border-border/50 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
            <p className="font-semibold text-base text-foreground">{appointmentData.fullName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Mobile Number</p>
            <p className="font-semibold text-base text-foreground">{appointmentData.mobile}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Doctor</p>
            <p className="font-semibold text-base text-foreground">Dr. {doctor.Name}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
            <p className="font-semibold text-base text-foreground">
              {format(appointmentData.date, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(appointmentData.timeSlot.StartTime)} - {formatTime(appointmentData.timeSlot.EndTime)}
            </p>
          </div>
        </div>

        {appointmentData.description && (
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="font-medium text-base text-foreground">{appointmentData.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom duration-500 delay-400">
        <Button
          onClick={downloadPDF}
          variant="outline"
          className="flex-1 h-12 border-2 hover:bg-muted transition-all duration-300 font-semibold bg-transparent"
        >
          <Download className="h-5 w-5 mr-2" />
          Download PDF
        </Button>
        <Button
          onClick={onClose}
          className="flex-1 h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-300"
        >
          Close
        </Button>
      </div>
    </div>
  )
}
