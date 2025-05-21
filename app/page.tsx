import { Suspense } from "react"
import { HomeHero } from "@/components/home-hero"
import { Features } from "@/components/features"
import { ClinicInfo } from "@/components/clinic-info"

export default function Home() {
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
