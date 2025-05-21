import { BookingForm } from "@/components/booking-form"

export default function BookAppointment() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      <BookingForm />
    </div>
  )
}
