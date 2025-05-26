"use client"
import { useState ,useEffect, useContext} from "react"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { Suspense } from "react"
import { HomeHero } from "@/components/home-hero"
import { Features } from "@/components/features"
import { ClinicInfo } from "@/components/clinic-info"



export default function Home() {
    const {currentUser,loadingUser} = useAppContext();
      const router = useRouter();

 useEffect(() => {
  if (!loadingUser && currentUser) {
    if (currentUser.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (currentUser.role === "doctor") {
      router.replace("/doctors/dashboard");
    } else {
      router.replace("/appointments"); // for patient or general user
    }
  }
}, [currentUser, loadingUser, router]);

// Show loading UI instead of null
if (loadingUser || (currentUser && currentUser.role !== "admin")) {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );
}

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center h-96">Loading...</div>}>
          <HomeHero />
          <Features />
          <ClinicInfo />
        </Suspense>
      </main>
    </div>
  )
}
