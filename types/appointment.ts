export interface Appointment {
   id: string
  doctorId: string
  doctorName: string
  date: string
  timeSlot: string
  patientName: string
  patientEmail: string
  patientPhone: string
   healthConcern?: string
  status?: "Pending" | "Approved" | "Rejected" | "Rescheduled"

  rescheduledDate?: string;
  rescheduledTimeSlot?: string;
}