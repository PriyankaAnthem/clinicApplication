"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DoctorPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/doctors/login")
  }, [router])

  return null
}
