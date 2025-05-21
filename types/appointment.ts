export interface Appointment {
   id: string
  doctorId: string
  doctorName: string
  date: string
  timeSlot: string
  patientName: string
  patientEmail: string
  patientPhone: string
  status: 'pending' | 'approved' | 'rejected'; 
  rescheduledDate?: string;
  rescheduledTimeSlot?: string;
}