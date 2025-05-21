"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DoctorAppointmentList } from "@/components/doctor-appointment-list";
import { useAppContext } from "@/context/app-context";

export default function DoctorDashboardPage() {
  const { currentUser, isDoctor, loadingUser } = useAppContext();
  const router = useRouter();


  



    useEffect(() => {
      // Redirect if loading is complete and user is not logged in or is not admin
      if (!loadingUser && (!currentUser || !isDoctor)) {
        router.replace("/doctors/login");  // Redirect to login page
      }
    }, [currentUser, isDoctor, loadingUser, router]);



  // Show loading state while waiting for user data
  if (loadingUser) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect if no current user or not a doctor
  if (!currentUser || !isDoctor) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      <Tabs defaultValue="appointments">
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          {/* Future Tabs (e.g., Profile) can be added here */}
        </TabsList>

        <TabsContent value="appointments">
          <DoctorAppointmentList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
