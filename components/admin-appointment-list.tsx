"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Clock, User, Trash2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppContext } from "@/context/app-context"
import type { Appointment } from "@/types/appointment"

export function AdminAppointmentList() {
  const { fetchAppointments, loadingAppointments, appointments, cancelAppointment, token } = useAppContext()
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchAppointments().catch((err) => {
      console.error("Error fetching appointments:", err);
      if (err.message.includes("401")) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      }
    });
  }, [token])

  if (loadingAppointments) {
    return <div>Loading appointments...</div>;
  }

  if (!appointments.length) {
    return <div>No appointments found.</div>;
  }

  // Sort appointments by rescheduled date/time or original date/time
  const sortedAppointments = [...appointments].sort((a, b) => {
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
    if (appointmentToCancel && token) {
      try {
        await cancelAppointment(appointmentToCancel.id, token);
        setIsDialogOpen(false);
        setAppointmentToCancel(null);
        await fetchAppointments()  // Refresh list after cancel
      } catch (error) {
        console.error('Failed to cancel appointment', error);
        if (error.response?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to cancel the appointment. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">All Appointments</h2>

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
                <Button variant="destructive" onClick={() => handleCancelClick(appointment)} className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
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
              Are you sure you want to cancel the appointment for {appointmentToCancel?.patientName} with{" "}
              {appointmentToCancel?.doctorName} on{" "}
              {appointmentToCancel && format(new Date(appointmentToCancel.rescheduledDate || appointmentToCancel.date), "MMMM d, yyyy")} at{" "}
              {appointmentToCancel?.rescheduledTimeSlot || appointmentToCancel?.timeSlot}?
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
