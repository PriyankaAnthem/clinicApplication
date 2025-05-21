"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDoctorList } from "@/components/admin-doctor-list";
import { AdminAppointmentList } from "@/components/admin-appointment-list";
import { useAppContext } from "@/context/app-context";

export default function AdminDashboardPage() {
  const { currentUser, isAdmin, loadingUser } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect if loading is complete and user is not logged in or is not admin
    if (!loadingUser && (!currentUser || !isAdmin)) {
      router.replace("/admin/login");  // Redirect to login page
    }
  }, [currentUser, isAdmin, loadingUser, router]);

  if (loadingUser) {
    // Show loading spinner while user data is being fetched
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser || !isAdmin) {
    // Return null to prevent dashboard content rendering if not authenticated/admin
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="doctors">
        <TabsList className="mb-6">
          <TabsTrigger value="doctors">Manage Doctors</TabsTrigger>
          <TabsTrigger value="appointments">Manage Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="doctors">
          <AdminDoctorList />
        </TabsContent>

        <TabsContent value="appointments">
          <AdminAppointmentList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
