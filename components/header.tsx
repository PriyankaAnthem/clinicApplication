"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/app-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { currentUser, isAdmin, isDoctor, logout, loadingUser } = useAppContext()
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)
  const isActive = (path: string) => pathname === path

  const isAdminSection = pathname.startsWith("/admin")
  const isDoctorSection = pathname.startsWith("/doctors")

  const showAdminSection = currentUser && isAdminSection && isAdmin
  const showDoctorSection = currentUser && isDoctorSection && isDoctor

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loadingUser) return null

  return (
    <header className={`${showAdminSection || showDoctorSection ? "bg-gray-800 text-white" : "bg-white shadow-sm"} sticky top-0 z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
         <Link
  href={
    showAdminSection
      ? "/admin/dashboard"
      : showDoctorSection
      ? "/doctors/dashboard"
      : "/"
  }
  className="flex items-center"
  onClick={closeMenu}
>
  {showAdminSection || showDoctorSection ? (
    <span
      className={`text-xl font-bold ${
        showAdminSection || showDoctorSection ? "text-white" : "text-blue-600"
      }`}
    >
      {showAdminSection ? "Admin Dashboard" : "Doctor Dashboard"}
    </span>
  ) : (
    <img
      src="/anthem-logo.png" // Replace with your actual logo path
      alt="Anthem Infotech"
      className="h-8" // Adjust height as needed
    />
  )}
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {showAdminSection && (
              <Link
                href="/admin/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/admin/dashboard") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
            )}

            {showDoctorSection && (
              <>
                <Link
                  href="/doctors/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/doctors/dashboard") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/doctors/appointments"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/doctors/appointments") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  My Appointments
                </Link>
              </>
            )}

            {!currentUser && !isAdminSection && !isDoctorSection && (
              <>
                <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  Home
                </Link>
                <Link href="/about" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/about") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  About
                </Link>
                <Link href="/auth/login" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/auth/login") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  Sign in
                </Link>
                <Link href="/auth/signup" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/auth/signup") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  Sign up
                </Link>
              </>
            )}

            {currentUser && !isAdminSection && !isDoctorSection && (
              <>
                <Link href="/book" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/book") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  Book Appointment
                </Link>
                <Link href="/appointments" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/appointments") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`}>
                  View Appointments
                </Link>
              </>
            )}

            {currentUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className={`h-5 w-5 ${showAdminSection || showDoctorSection ? "text-white" : "text-gray-700"}`} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-gray-500">{currentUser.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && !isAdminSection && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {isDoctor && !isDoctorSection && (
                    <DropdownMenuItem asChild>
                      <Link href="/doctors/dashboard">Doctor Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Menu"
              className={showAdminSection || showDoctorSection ? "text-white hover:bg-gray-700" : ""}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden ${showAdminSection || showDoctorSection ? "bg-gray-800" : "bg-white shadow-lg"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentUser && isAdminSection && isAdmin && (
              <Link
                href="/admin/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/admin/dashboard") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            )}

            {currentUser && isDoctorSection && isDoctor && (
              <>
                <Link
                  href="/doctors/dashboard"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/doctors/dashboard") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/doctors/appointments"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/doctors/appointments") ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={closeMenu}
                >
                  My Appointments
                </Link>
              </>
            )}

            {!currentUser && !isAdminSection && !isDoctorSection && (
              <>
                <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} onClick={closeMenu}>
                  Home
                </Link>
                <Link href="/about" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/about") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} onClick={closeMenu}>
                  About
                </Link>
                <Link href="/auth/login" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/auth/login") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} onClick={closeMenu}>
                  Sign in
                </Link>
                <Link href="/auth/signup" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/auth/signup") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} onClick={closeMenu}>
                  Sign up
                </Link>
              </>
            )}

            {currentUser && !isAdminSection && !isDoctorSection && (
              <>
                <Link href="/book" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/book") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} onClick={closeMenu}>
                  Book Appointment
                </Link>
                <Link href="/appointments" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/appointments") ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`} onClick={closeMenu}>
                  View Appointments
                </Link>
              </>
            )}

            {currentUser && (
              <button
                onClick={() => {
                  handleLogout()
                  closeMenu()
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-100"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
