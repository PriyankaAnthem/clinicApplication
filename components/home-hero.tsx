"use client";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/app-context"

export function HomeHero() {
  const { currentUser, isAdmin, isDoctor, logout, loadingUser } = useAppContext();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome{currentUser ? `, ${currentUser.name}` : ""} to HealthCare Clinic
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
          Your health is our priority. Book appointments with our expert doctors and receive the care you deserve.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/book">Book an Appointment</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
