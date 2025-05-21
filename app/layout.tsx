import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AppProvider } from "@/context/app-context"
import { Toaster } from "@/components/ui/toaster"; // Add this import 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clinic Appointment Booking System",
  description: "Book and manage your clinic appointments easily",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AppProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster /> 
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
