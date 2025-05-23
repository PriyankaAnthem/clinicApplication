"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppointmentList } from "@/components/appointment-list"
import { useAppContext } from "@/context/app-context"

export default function ViewAppointments() {
  const { currentUser } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      router.push("/auth/login")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
    <h2 className="text-2xl font-semibold mt-2">
  Welcome{currentUser ? `, ${currentUser.name}` : ""}
</h2>

      <AppointmentList />
    </div>
  )
}
