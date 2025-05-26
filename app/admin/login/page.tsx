"use client"

import { useState,useEffect} from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Eye, EyeOff  } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppContext } from "@/context/app-context"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a val_id email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
})

export default function AdminLoginPage() {
  const { login,currentUser,loadingUser } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false); 
  const router = useRouter()
  const { toast } = useToast()


  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

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



  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const result = await login(values.email, values.password, true)

      if (result.success) {
        toast({
          title: "Admin Login Successful",
          description: "You are now logged in as an administrator.",
        })
        router.push("/admin/dashboard")
      } else {
        toast({
          title: "Login Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@clinic.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

 {/* Password */}
              <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <div className="relative">
        <FormControl>
          <Input
            placeholder="Password"
            type={showPassword ? "text" : "password"} 
            {...field}
          />
        </FormControl>
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
          tabIndex={-1} // Prevents accidental focus while tabbing
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-sm text-gray-500 text-center">Default admin: admin@clinic.com / admin123</p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}