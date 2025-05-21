"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DoctorAppointmentList} from "@/components/doctor-appointment-list"
import { useAppContext } from "@/context/app-context"

export default function ViewAppointments() {
  const { currentUser } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      router.replace("/doctors/login")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Appointments</h1>
      <DoctorAppointmentList/>
    </div>
  )
}
