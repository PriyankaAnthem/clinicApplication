"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppContext } from "@/context/app-context"

// Define the form schema with Zod
const formSchema = z.object({
  doctorId: z.string({
    required_error: "Please select a doctor",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  patientName: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  patientEmail: z.string().email({
    message: "Please enter a valid email address",
  }),
  patientPhone: z.string().min(10, {
    message: "Please enter a valid phone number",
  }),
  healthConcern: z
  .string()
  .min(10, { message: "Please describe your concern in more detail (min 10 characters)." })
  .max(500, { message: "Please keep it under 500 characters." }),

})

export function BookingForm() {
  const {fetchDoctors,setDoctors,currentUser, doctors, setAppointments,appointments, addAppointment } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      router.push("/auth/login")
    }
  }, [currentUser, router])


   useEffect(() => {
      const loadDoctors = async () => {
        const doctors = await fetchDoctors();
        if (doctors) {
          setDoctors(doctors); // setDoctors should be from your context or local state
        }
      };
    
      loadDoctors();
    }, []);

  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientEmail: "",
      patientPhone: "",
      healthConcern: "",
    },
  })

  // Watch for changes to doctor and date to update available time slots
  const selectedDoctor = form.watch("doctorId")
  const selectedDate = form.watch("date")

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      updateAvailableTimeSlots(selectedDoctor, selectedDate)
    }
  }, [selectedDoctor, selectedDate, appointments])

  useEffect(() => {
    console.log("Appointments:", appointments);
  }, [appointments]);
  

  console.log("Doctors:", doctors);

  // Update available time slots based on doctor and date
  const updateAvailableTimeSlots = (doctorId: string, date: Date) => {
    // Define all possible time slots
    const allTimeSlots = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ]

    // Find booked slots for the selected doctor and date
    const formattedDate = format(date, "yyyy-MM-dd")
    const bookedSlots = appointments
      .filter((app) => app.doctorId === doctorId && format(new Date(app.date), "yyyy-MM-dd") === formattedDate)
      .map((app) => app.timeSlot)

    // Filter out booked slots
    const available = allTimeSlots.filter((slot) => !bookedSlots.includes(slot))
    setAvailableTimeSlots(available)

    // If the currently selected time slot is not available, reset it
    const currentTimeSlot = form.getValues("timeSlot")
    if (currentTimeSlot && !available.includes(currentTimeSlot)) {
      form.setValue("timeSlot", "")
    }
  }

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const newAppointment = {
        id: Date.now().toString(),
        doctorId: values.doctorId,
        doctorName: doctors.find((d) => d.id === values.doctorId)?.name || "",
        date: values.date.toISOString(),
        timeSlot: values.timeSlot,
        patientName: values.patientName,
        patientEmail: currentUser?.email || values.patientEmail,
        patientPhone: values.patientPhone,
         healthConcern: values.healthConcern,
      };
    
      const result = await addAppointment(newAppointment); // await the addAppointment
    
      if (result.success) {
        //  Update local appointments immediately
        setAppointments(prev => [...prev, newAppointment]);
    
        //  Show success toast
        toast({
          title: "Appointment Booked",
          description: `Your appointment with ${newAppointment.doctorName} on ${format(values.date, "MMMM d, yyyy")} at ${values.timeSlot} has been confirmed.`,
        });
    
        //  Navigate after success
        router.push("/appointments");
      } else {
        //  Optional: Show error toast if booking fails
        toast({
          title: "Booking Failed",
          description: result.message || "Could not book appointment.",
          variant: "destructive",
        });
      }
    };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
     <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="doctorId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Doctor</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Appointment Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0)) || date.getDay() === 0
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="timeSlot"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time Slot</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    {selectedDoctor && selectedDate ? "No available slots" : "Select doctor and date first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-medium">Patient Information</h3>

      <FormField
        control={form.control}
        name="patientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="patientEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="patientPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="(555) 123-4567"
                  {...field}
                  maxLength={10}
                  onKeyDown={(e) => {
                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
                    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* ✅ New Health Concern Field */}
      <FormField
        control={form.control}
        name="healthConcern"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Health Concern</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your symptoms or concerns"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <Button type="submit" className="w-full">
      Book Appointment
    </Button>
  </form>
</Form>

    </div>
  )
}