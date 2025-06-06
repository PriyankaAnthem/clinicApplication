"use client"

import { useState ,useEffect, useContext} from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Eye, EyeOff  } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppContext } from "@/context/app-context"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
})



export default function LoginPage() {
  const { login ,currentUser,loadingUser} = useAppContext()
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
      router.replace("/"); // for patient or general user
    }
  }
}, [currentUser, loadingUser, router]);


// Show loading UI instead of null
if (loadingUser || (currentUser && currentUser.role !== "patient")) {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600">Loading...</p>
    </div>
  );
}



  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
    //  console.log("Submitting values:", values.email, values.password); // Log the submitted values
      const result = await login(values.email, values.password);
  
      if (result.success) {
        toast({
          title: "Login successful",
          description: "You are now logged in.",
        });
        router.push("/appointments");
      } else {
        toast({
          title: "Login failed",
          description: result.message || "Unknown error",
          variant: "destructive",
        });
      }
    } catch (error: any) {
    //  console.error('Error during login:', error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-16 px-4 flex justify-center">
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle className="text-2xl text-center">Sign In</CardTitle>
      <CardDescription className="text-center">Sign in to your HealthCare Clinic account</CardDescription>
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
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
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

                {/* Forgot Password Link */}
                <div className="text-right mt-2">
                  <Link href="/auth/forgotPassword" className="text-sm text-blue-600 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              </FormItem>
            )}
          />  

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardContent>
    <CardFooter className="flex flex-col space-y-4">
      <p className="text-sm text-gray-500">
        Don't have an account?{" "}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </CardFooter>
  </Card>
</div>

  )
}
