"use client";

import { useState, useEffect } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Clock, User, CalendarIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/app-context";
import type { Appointment } from "@/types/appointment";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function DoctorAppointmentList() {
  const {
    fetchDoctorAppointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    DoctorAppointments,
    loadingAppointments,
    currentUser,
    isDoctor,
    token,
  } = useAppContext();

  const [rescheduleData, setRescheduleData] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [searchDate, setSearchDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!currentUser?.id || !isDoctor) return;
    fetchDoctorAppointments();
  }, [currentUser, isDoctor]);

  const handleStatusChange = async (
    appointmentId: string,
    status: "Approved" | "Rejected"
  ) => {
    try {
      await updateAppointmentStatus(appointmentId, status, token);
      toast({
        title: "Success",
        description: `Appointment ${status} successfully.`,
      });
      fetchDoctorAppointments(); // Refresh list
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive",
      });
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData || !newDate || !newTimeSlot) return;

    try {
      await rescheduleAppointment(rescheduleData.id, newDate, newTimeSlot, token || "");
      toast({
        title: "Success",
        description: "Appointment rescheduled successfully.",
      });
      setIsRescheduleOpen(false);
      setNewDate("");
      setNewTimeSlot("");
      fetchDoctorAppointments();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment.",
        variant: "destructive",
      });
    }
  };

  if (loadingAppointments) {
    return <div>Loading appointments...</div>;
  }

  const filteredAppointments = DoctorAppointments.filter((appointment) => {
    const matchesStatus = statusFilter
      ? appointment.status.toLowerCase().includes(statusFilter.toLowerCase())
      : true;

    const matchesDate = searchDate
      ? isSameDay(new Date(appointment.date), searchDate)
      : true;

    return matchesStatus && matchesDate;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.timeSlot.localeCompare(b.timeSlot);
  });

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
       <div className="relative w-64">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
  <Input
    placeholder="Search by status"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="pl-8"  // add left padding to make room for icon
  />
</div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !searchDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {searchDate ? format(searchDate, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
       <Calendar
  mode="single"
  selected={searchDate ?? undefined}
  onSelect={setSearchDate}
  initialFocus
/>

          </PopoverContent>
        </Popover>
        {searchDate && (
          <Button
            variant="ghost"
            onClick={() => setSearchDate(null)}
            className="text-sm text-red-500"
          >
            Clear Date Filter
          </Button>
        )}
      </div>

      {sortedAppointments.length === 0 ? (
        <div>No appointments found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>{appointment.patientName}</CardTitle>
                <CardDescription>
                  {format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{appointment.timeSlot}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{appointment.patientEmail}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Status: <span className="font-medium">{appointment.status}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {appointment.status === "Pending" && (
                  <div className="flex gap-3 w-full">
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() => handleStatusChange(appointment.id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      onClick={() => handleStatusChange(appointment.id, "Rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    setRescheduleData(appointment);
                    setIsRescheduleOpen(true);
                  }}
                >
                  Reschedule
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduleOpen && rescheduleData && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>

            <label className="block mb-2">New Date:</label>
            <input
              type="date"
              className="w-full mb-4 border p-2"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />

            <label className="block mb-2">New Time Slot:</label>
            <input
              type="text"
              placeholder="e.g. 3:00 PM"
              className="w-full mb-4 border p-2"
              value={newTimeSlot}
              onChange={(e) => setNewTimeSlot(e.target.value)}
              onBlur={(e) => {
                const value = e.target.value.trim();
                const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
                if (!regex.test(value)) {
                  alert("Please enter a valid time format like 3:00 PM");
                  setNewTimeSlot('');
                }
              }}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReschedule}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
