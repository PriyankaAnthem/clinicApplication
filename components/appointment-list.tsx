"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Clock, User, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useAppContext } from "@/context/app-context"
import { toast } from "@/hooks/use-toast"
import type { Appointment } from "@/types/appointment"

export function AppointmentList() {
  const {
    fetchAppointmentsById,
    appointments,
    cancelAppointment,
    currentUser
  } = useAppContext()

  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (currentUser) {
      fetchAppointmentsById()
    }
  }, [currentUser])

  const userAppointments = appointments.filter(
    (appointment) =>
      currentUser?.role === "admin" || appointment.patientEmail === currentUser?.email
  )

  const sortedAppointments = [...userAppointments].sort((a, b) => {
    const dateA = new Date(a.rescheduledDate || a.date).getTime()
    const dateB = new Date(b.rescheduledDate || b.date).getTime()
    if (dateA !== dateB) return dateA - dateB
    return (a.rescheduledTimeSlot || a.timeSlot).localeCompare(b.rescheduledTimeSlot || b.timeSlot)
  })

  const handleCancelClick = (appointment: Appointment) => {
    setAppointmentToCancel(appointment)
    setIsDialogOpen(true)
  }

  const confirmCancel = async () => {
    if (appointmentToCancel) {
      try {
        await cancelAppointment(appointmentToCancel.id)
        setIsDialogOpen(false)
        setAppointmentToCancel(null)
        await fetchAppointmentsById()
      } catch (error) {
        console.error("Failed to cancel appointment", error)
        toast({
          title: "Error",
          description: "Failed to cancel the appointment. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  if (userAppointments.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No Appointments</h2>
        <p className="text-gray-600 mb-6">You don't have any appointments scheduled.</p>
        <Button asChild>
          <a href="/book">Book an Appointment</a>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedAppointments.map((appointment) => {
          const isRescheduled = appointment.rescheduledDate || appointment.rescheduledTimeSlot
          const displayDate = appointment.rescheduledDate || appointment.date
          const displayTime = appointment.rescheduledTimeSlot || appointment.timeSlot

          return (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>{appointment.doctorName}</CardTitle>
                <CardDescription>
                  {format(new Date(displayDate), "EEEE, MMMM d, yyyy")}
                  {isRescheduled && (
                    <div className="text-xs text-blue-600 mt-1 flex items-center">
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Rescheduled
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{displayTime}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{appointment.patientName}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>{appointment.patientEmail}</p>
                    <p>{appointment.patientPhone}</p>
                  </div>

                  <div className="flex items-center text-sm font-medium mt-2">
                    <span className="mr-2 text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        appointment.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelClick(appointment)}
                  className="w-full"
                >
                  Cancel Appointment
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your appointment with{" "}
              {appointmentToCancel?.doctorName} on{" "}
              {appointmentToCancel &&
                format(new Date(appointmentToCancel.rescheduledDate || appointmentToCancel.date), "MMMM d, yyyy")}{" "}
              at {appointmentToCancel?.rescheduledTimeSlot || appointmentToCancel?.timeSlot}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}