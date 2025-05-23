"use client"

import { useEffect, useState } from "react"
import { Edit, Trash2, Plus,Eye, EyeOff  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppContext } from "@/context/app-context"
import type { Doctor } from "@/types/doctor"
import type {Appointment}  from "@/types/appointment"

// Define the form schema with Zod
const doctorFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters",
  }),
  specialty: z.string().min(2, {
    message: "Specialty must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export function AdminDoctorList() {
  const { doctors, setDoctors, addDoctor, updateDoctor, deleteDoctor, token, fetchDoctors } = useAppContext()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false); 
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
 const [selectedDoctorAppointments, setSelectedDoctorAppointments] = useState([]);
const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
const [selectedDoctorName, setSelectedDoctorName] = useState<string>(''); // <- 🔹 Explicit type annotation added
const { toast } = useToast()



  const form = useForm<z.infer<typeof doctorFormSchema>>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialty: "",
      email: "",
      password: "",
    },
  });


useEffect(() => {
  const loadDoctors = async () => {
    const doctors = await fetchDoctors();
    if (doctors) {
      setDoctors(doctors);
    }
  };

  loadDoctors();
}, []);


  // Handle opening the add dialog
  const handleAddClick = () => {
    form.reset({
      name: "", specialty: "",
      email: "",
      password: "",
    })
    setIsAddDialogOpen(true)
  }

  // Handle opening the edit dialog
  const handleEditClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    form.reset({
      name: doctor.name, specialty: doctor.specialty, email: doctor.email || "",
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  //Handle opening the delete dialog
  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsDeleteDialogOpen(true)
  }


  // Handler to fetch appointments:
const handleViewAppointments = async (doctor: { _id: string; name: string }) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${doctor._id}`, {
      credentials: 'include'
    });
    const data = await res.json();
    setSelectedDoctorAppointments(data);
    setSelectedDoctorName(doctor.name);
    setIsAppointmentDialogOpen(true);
  } catch (error) {
    console.error('Failed to fetch appointments', error);
  }
};


const onAddSubmit = async (values: z.infer<typeof doctorFormSchema>) => {
  console.log("Add Doctor form submitted", values);

  // No token check here — backend will handle auth from cookie

  const newDoctor = {
    name: values.name,
    specialty: values.specialty,
    email: values.email,
    password: values.password,
  };

  console.log("Calling addDoctor with:", newDoctor);

  try {
    const result = await addDoctor(newDoctor);

    if (result?.success && result?.doctor) {
      toast({
        title: "Doctor Added",
        description: `${result.doctor.name}  has been successfully added and an email has been sent to ${result.doctor.email}.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Failed to Add Doctor",
        description: result?.message || "Unknown error",
        status: "error",
      });
    }
  } catch (error) {
    console.error("Unexpected error in onAddSubmit:", error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while adding doctor.",
      status: "error",
    });
  }
  setIsAddDialogOpen(false);
};


  // Handle form submission for editing a doctor
const onEditSubmit = async (values: z.infer<typeof doctorFormSchema>) => {
  if (selectedDoctor) {
    const updatedDoctor = {
      name: values.name,
      specialty: values.specialty,
      email: values.email,
      password: values.password, // only send if entered
    };

    const result = await updateDoctor(selectedDoctor._id, updatedDoctor);

    if (result.success) {
      toast({
        title: "Doctor Updated",
        description: `${values.name}'s information has been updated.`,
      });
      setIsEditDialogOpen(false);
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update doctor information.",
        variant: "destructive",
      });
    }
  }
};



  // Handle doctor deletion
  const confirmDelete = () => {
    if (selectedDoctor) {
      // Check if this is the last doctor
      if (doctors.length <= 1) {
        toast({
          title: "Cannot Delete",
          description: "At least one doctor must remain in the system.",
          variant: "destructive",
        })
        setIsDeleteDialogOpen(false)
        return
      }

      deleteDoctor(selectedDoctor._id) // Pass the token to delete the doctor
      setIsDeleteDialogOpen(false)
      toast({
        title: "Doctor Deleted",
        description: `${selectedDoctor.name} has been removed from the system.`,
      })
    }
  }


  // CSV Export Function:
  const exportToCSV = (appointments: any[], doctorName: string) => { // <- 🔹 doctorName type explicitly added
  const headers = ['Patient Name', 'Date', 'Time', 'Status'];
  const rows = appointments.map(a => [
    a.patientName,
    new Date(a.date).toLocaleDateString(),
    a. timeSlot,
    a.status
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doctorName.replace(/\s+/g, '_')}_appointments.csv`;
  a.click();
  URL.revokeObjectURL(url);
};



  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Doctors</h2>
        <Button onClick={handleAddClick}  >
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <Card key={doctor._id}>
            <CardHeader>
              <CardTitle>{doctor.name}</CardTitle>
              <CardDescription>{doctor.specialty}</CardDescription>
              <CardDescription>{doctor.email}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="icon" onClick={() => handleEditClick(doctor)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteClick(doctor)}>
                <Trash2 className="h-4 w-4" />
              </Button>
             <Button variant="outline" onClick={() => handleViewAppointments(doctor)}>
  View Appointments
</Button>

            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Doctor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Doctor</DialogTitle>
            <DialogDescription>Enter the details for the new doctor, including login credentials.</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Specialty */}
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Input placeholder="Cardiology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="doctor@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"} 
            {...field}
          />
        </FormControl>
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
          tabIndex={-1} // Prevents accidental focus while tabbing
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>
              <DialogFooter>
                <Button type="submit">Add Doctor</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

    {/* Edit Doctor Dialog */}
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Doctor</DialogTitle>
      <DialogDescription>Update the doctor's information.</DialogDescription>
    </DialogHeader>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specialty */}
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password (optional)</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit">Update Doctor</Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>

      {/* Delete Doctor Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Doctor</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDoctor?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

       {/* Dialog for viewing appointments */}
   <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
  <DialogContent className="max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Appointments for {selectedDoctorName}</DialogTitle>
    </DialogHeader>
    <div className="space-y-2">
      {selectedDoctorAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <>
          <table className="w-full text-sm text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedDoctorAppointments.map((a, index) => (
                <tr key={index}>
                  <td className="p-2 border">{a.patientName}</td>
                  <td className="p-2 border">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="p-2 border">{a. timeSlot}</td>
                  <td className="p-2 border">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button onClick={() => exportToCSV(selectedDoctorAppointments, selectedDoctorName)}>
            Export to CSV
          </Button>
        </>
      )}
    </div>
  </DialogContent>
</Dialog>

    </div>
  )
}