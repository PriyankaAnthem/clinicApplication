"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import type { Doctor } from "@/types/doctor";
import type { Appointment } from "@/types/appointment";
import type { User } from "@/types/user";


// Define the type for Toast options with a restricted variant
interface ToastOptions {
  title: string;
  description: string;
  variant?: "default" | "destructive" | undefined; // restrict variant to "default" or "destructive"
}
interface AppContextType {
  doctors: Doctor[];
  appointments: Appointment[];
  DoctorAppointments: Appointment[];
  fetchAppointments: () => void;
  fetchDoctorAppointments: () => void;
  fetchAppointmentsById: () => void;
  fetchDoctors: () => void;
  fetchCurrentUser: () => Promise<void>;
  isAdmin: boolean;
  isDoctor: boolean;
  currentUser: User | null;
  loadingUser: boolean;
  loadingAppointments: boolean; // New loading state for appointments
  error: string | null; // New error state
  setIsAdmin: (value: boolean) => void;
  setIsDoctor: (value: boolean) => void;
  setDoctors: (doctors: Doctor[]) => void;
  setAppointments: (asppointment: Appointment[]) => void;
  setDoctorAppointments: (asppointment: Appointment[]) => void;
  setCurrentUser: (user: User | null) => void;
  token: string | null;
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, updatedFields: Partial<Doctor>) => void;
  updateAppointmentStatus: (
    id: string,
    status: "approved" | "rejected",
    token: string
  ) => Promise<void>;
  deleteDoctor: (id: string) => void;
  addAppointment: (
    appointment: Appointment
  ) => Promise<{ success: boolean; message: string }>;
  cancelAppointment: (id: string) => void;
  login: (
    email: string,
    password: string,
    isAdminLogin?: boolean
  ) => Promise<{ success: boolean; message: string }>;
  loginDoctor: (
    email: string,
    password: string,
    isDoctorLogin?: boolean
  ) => Promise<{ success: boolean; message: string }>;
  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  toast: (options: ToastOptions) => void; // Update toast function type
  setError: (error: string | null) => void; // Function to set the error message
  setLoadingAppointments: (loading: boolean) => void; // Function to set the loading state
 /* getAuthTokenFromCookies: () => string | null;*/
  rescheduleAppointment: (
    id: string,
    date: string,
    timeSlot: string,
    token: string
  ) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast(); // Get the toast function
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [DoctorAppointments, setDoctorAppointments] = useState<Appointment[]>(
    []
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // Declare token here
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(false); // Add loading state for appointments
  const [error, setError] = useState<string | null>(null); // Handle error state

  /*const getAuthTokenFromCookies = () => {
    const cookies = document.cookie.split("; ").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith("authToken=")
    );
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  };

  useEffect(() => {
    const tokenFromCookies = getAuthTokenFromCookies();
      console.log("Token from cookies inside useEffect:", tokenFromCookies);
    if (tokenFromCookies && !token) {
      setToken(tokenFromCookies);
      console.log("Token state set in context:", tokenFromCookies);
    }
  }, [token]);



  useEffect(() => {
  console.log("Token updated in context:", token);
}, [token]);*/





/*const fetchCurrentUser = async () => {
  setLoadingUser(true);

  const tokenFromCookies = getAuthTokenFromCookies(); // Assuming you have this function in scope
  console.log("🔐 Token from cookies in fetchCurrentUser:", tokenFromCookies);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
      {
        method: "GET",
        credentials: "include", // Include cookies
      }
    );
    const raw = await res.json(); // No need to clone
    console.log("📥 Raw response from /api/users/profile:", raw);

    if (res.ok) {
      const user = raw.user || raw;
      setCurrentUser({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setIsAdmin(user.role === "admin");
      setIsDoctor(user.role === "doctor");
    } else {
      console.log("❌ Failed to fetch user:", res.statusText);
      setCurrentUser(null);
      setIsAdmin(false);
      setIsDoctor(false);
    }
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    setCurrentUser(null);
    setIsAdmin(false);
    setIsDoctor(false);
  } finally {
    setLoadingUser(false);
  }
};
*/



useEffect(() => {
  if (!currentUser) {
    fetchCurrentUser();
  }
}, []);


const fetchCurrentUser = async () => {
  setLoadingUser(true);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
      {
        method: "GET",
        credentials: "include", // ✅ Sends the authToken cookie
      }
    );

    const data = await res.json();
    console.log("📥 Response from /api/users/profile:", data);

    if (res.ok && data) {
      const user = data;
      setCurrentUser({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      setIsAdmin(user.role === "admin");
      setIsDoctor(user.role === "doctor");
    } else {
      console.warn("❌ Failed to fetch user profile:", res.status, data?.message);
      setCurrentUser(null);
      setIsAdmin(false);
      setIsDoctor(false);
    }
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    setCurrentUser(null);
    setIsAdmin(false);
    setIsDoctor(false);
  } finally {
    setLoadingUser(false);
  }
};


const fetchDoctors = async (): Promise<Doctor[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctors`,
      {
        method: "GET",
        credentials: "include", // send cookies automatically
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast({
        title: "Error Fetching Doctors",
        description: errorData.message || "Failed to load doctors",
        variant: "destructive",
      });
      return null;
    }

    const doctors: Doctor[] = await response.json();
    return doctors;
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred.",
      variant: "destructive",
    });
    return null;
  }
};


 /* const fetchDoctors = async (): Promise<Doctor[] | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/doctors`,
        {
          method: "GET",
          credentials: "include", // Keep it if cookies/session involved
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error Fetching Doctors",
          description: errorData.message || "Failed to load doctors",
          variant: "destructive",
        });
        return null;
      }
      const doctors: Doctor[] = await response.json();
      return doctors;
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return null;
    }
  };*/


const login = async (email: string, password: string, isAdminLogin = false) => {
  if (!email || !password) {
    toast({
      title: "Error",
      description: "Email and password are required",
      variant: "destructive",
    });
    return { success: false, message: "Email and password are required" };
  }

  try {
    const endpoint = isAdminLogin ? "/api/admin/login" : "/api/users/login";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important to save cookie automatically
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Login Failed",
        description: data.message || "Login failed",
        variant: "destructive",
      });
      return { success: false, message: data.message || "Login failed" };
    }

    // Use user info directly from response, no token expected
    if (isAdminLogin) {
      const { _id, name, email: userEmail, role } = data.user || data; 
      setCurrentUser({ id: _id, name, email: userEmail, role });
      setIsAdmin(role === "admin");
      setIsDoctor(role === "doctor");
    } else {
      const { _id, name, email: userEmail, role } = data.user;
      setCurrentUser({ id: _id, name, email: userEmail, role });
      setIsAdmin(role === "admin");
      setIsDoctor(role === "doctor");
    }

    toast({
      title: "Login Successful",
      description: "You are now logged in.",
      variant: "default",
    });

    // Small delay to ensure cookie is set before fetching profile
    await new Promise((resolve) => setTimeout(resolve, 200));

    await fetchCurrentUser();


    return { success: true, message: "Login successful" };
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Login error",
      variant: "destructive",
    });
    return { success: false, message: error.message || "Login error" };
  }
};


 const loginDoctor = async (email: string, password: string) => {
  if (!email || !password) {
    toast({
      title: "Error",
      description: "Email and password are required",
      variant: "destructive",
    });
    return { success: false, message: "Email and password are required" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Makes sure cookies are sent
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      toast({
        title: "Login Failed",
        description: data.message || "Login failed",
        variant: "destructive",
      });
      return { success: false, message: data.message || "Login failed" };
    }

    const data = await response.json();
    const { token } = data;

    // Store token in cookie
    document.cookie = `authToken=${token}; path=/; ${
      process.env.NODE_ENV === "production" ? "secure;" : ""
    } SameSite=Lax`;

    setToken(token); // set token in context

    //  Fetch and store current user info from profile endpoint
    await fetchCurrentUser();
   
    

    toast({
      title: "Login Successful",
      description: "You are now logged in as a doctor.",
      variant: "default",
    });

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Error:", error);
    toast({
      title: "Error",
      description: error.message || "Login error",
      variant: "destructive",
    });
    return { success: false, message: error.message || "Login error" };
  }
};

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Signup Failed",
          description: data.message || "Signup failed",
          variant: "destructive",
        });
        return { success: false, message: data.message || "Signup failed" };
      }

      toast({
        title: "Account Created",
        description:
          "Your account has been successfully created. Please login.",
        variant: "default",
      });

      return { success: true, message: "Account created successfully" };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Signup error",
        variant: "destructive",
      });
      return { success: false, message: error.message || "Signup error" };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include", // Ensures cookies are sent with the request
        }
      );

      const data = await response.json(); // Attempt to read the response body

      if (response.ok) {
        // Success toast
        toast({
          title: "Logged Out",
          description: data.message || "You have been logged out successfully.",
          variant: "default",
        });

        // Clear frontend state
        setCurrentUser(null);
        setIsAdmin(false);

        // Optionally, expire the cookie manually (if needed)
        document.cookie =
          "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } else {
        // Handle failed response with error from backend
        throw new Error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: error.message || "Logout failed. Please try again.",
        variant: "destructive",
      });
    }
  };
const addDoctor = async (doctor: Doctor) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important: sends cookies with request
        body: JSON.stringify(doctor),
      }
    );

    if (!response.ok) {
      const data = await response.json();

      toast({
        title: response.status === 401 ? "Unauthorized" : "Create Doctor Failed",
        description:
          data.message ||
          (response.status === 401
            ? "Please log in to perform this action."
            : "Failed to create doctor"),
        variant: "destructive",
      });

      return {
        success: false,
        message:
          data.message ||
          (response.status === 401
            ? "Unauthorized"
            : "Failed to create doctor"),
      };
    }

    const data = await response.json();

    setDoctors((prevDoctors) => [...prevDoctors, data]);

    toast({
      title: "Doctor Created",
      description: `${data.name} has been successfully added.`,
      variant: "default",
    });

    return { success: true, doctor: data };
  } catch (error: any) {
    console.error("Error:", error);
    toast({
      title: "Error",
      description: error.message || "An error occurred while creating doctor",
      variant: "destructive",
    });
    return { success: false, message: error.message || "An error occurred" };
  }
};


  // Update doctor with authentication token
 
const updateDoctor = async (
  id: string,
  updatedFields: {
    name?: string;
    specialty?: string;
    email?: string;
    password?: string;
  }
) => {
  console.log("Calling updateDoctor with:", id, updatedFields);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedFields),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update doctor");
    }

    setDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor._id === id ? { ...doctor, ...updatedFields } : doctor
      )
    );

    toast({
      title: "Doctor Updated",
      description: "The doctor has been updated successfully.",
      variant: "default",
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating doctor:", error);
    toast({
      title: "Update Failed",
      description: error.message || "An error occurred while updating doctor",
      variant: "destructive",
    });

    return { success: false, error };
  }
};



  const deleteDoctor = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/doctors/${id}`,
      {
        method: "DELETE",
        credentials: "include", // send cookie automatically
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Delete Failed",
        description: data.message || "Failed to delete doctor",
        variant: "destructive",
      });
      return;
    }

    setDoctors((prevDoctors) =>
      prevDoctors.filter((doctor) => doctor._id !== id)
    );

    toast({
      title: "Doctor Removed",
      description: "The doctor has been successfully removed from the system.",
      variant: "destructive",
    });
  } catch (error: any) {
    console.error("Error deleting doctor:", error);
    toast({
      title: "Error",
      description: error.message || "An error occurred while deleting doctor",
      variant: "destructive",
    });
  }
};

  //adding appointment
  const addAppointment = async (appointment: Appointment) => {
    if (
      !appointment.doctorId ||
      !appointment.date ||
      !appointment.timeSlot ||
      !appointment.patientName ||
      !appointment.patientEmail ||
      !appointment.patientPhone
    ) {
      toast({
        title: "Missing Details",
        description: "Please provide all required appointment details.",
        variant: "destructive",
      });
      return {
        success: false,
        message: "Missing required appointment details",
      };
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // if your backend uses session cookies (auth), otherwise remove
          body: JSON.stringify(appointment),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Appointment Failed",
          description: data.message || "Failed to book appointment.",
          variant: "destructive",
        });
        return {
          success: false,
          message: data.message || "Failed to book appointment",
        };
      }
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully booked.",
        variant: "default",
      });

      return { success: true, message: "Appointment successfully booked" };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return {
        success: false,
        message: error?.message || "An unexpected error occurred.",
      };
    }
  };

  //cancel appointment
  const cancelAppointment = async (id: string) => {
    try {
      // First, call the API to cancel the appointment
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // Send cookies for authentication
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      // If successful, update local state
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );

      // Show success toast
      toast({
        title: "Appointment Canceled",
        description: "The appointment has been canceled successfully.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };




 /*const fetchAppointments = async () => {
    try {
      const token = getAuthTokenFromCookies(); // Get token from cookies

      if (!token) {
        throw new Error("Authorization token missing. Please log in again.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, //Pass token in Authorization header
          },
          credentials: "include", //  Send cookies if needed
        }
      );

      if (response.ok) {
        const data = await response.json();

        const mappedAppointments = data.map((appointment: any) => ({
          id: appointment._id,
          doctorId: appointment.doctor?._id || "",
          doctorName: appointment.doctor?.name || "",
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          patientName: appointment.patient?.name || "",
          patientEmail: appointment.patient?.email || "",
          patientPhone: appointment.patient?.phone || "",
        }));

        setAppointments(mappedAppointments);
        console.log("Fetched and mapped appointments:", mappedAppointments);
      } else {
        throw new Error("Failed to fetch appointments");
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };*/


const fetchAppointments = async () => {
  setLoadingAppointments(true);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",  // This sends cookies (including authToken) automatically
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch appointments: ${errorText}`);
    }

    const data = await response.json();

    const mappedAppointments = data.map((appointment: any) => ({
      id: appointment._id,
      doctorId: appointment.doctor?._id || "",
      doctorName: appointment.doctor?.name || "",
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      patientName: appointment.patient?.name || "",
      patientEmail: appointment.patient?.email || "",
      patientPhone: appointment.patient?.phone || "",
      status: appointment.status ?? "pending",
    }));

    setAppointments(mappedAppointments);
  } catch (error: any) {
    setError(error.message);
    console.error("Error fetching appointments:", error);
  } finally {
    setLoadingAppointments(false);
  }
};

  const fetchAppointmentsById = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important: Send cookies automatically
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to fetch user appointments."
        );
      }

      const data = await response.json();

      const mappedAppointments = Array.isArray(data)
        ? data.map((appointment: any) => ({
            id: appointment._id,
            doctorId: appointment.doctor?._id ?? "",
            doctorName: appointment.doctor?.name ?? "",
            date: appointment.date,
            timeSlot: appointment.timeSlot,
            patientName: appointment.patient?.name ?? "",
            patientEmail: appointment.patient?.email ?? "",
            patientPhone: appointment.patient?.phone ?? "",
            status: appointment.status ?? "pending",
          }))
        : [];

      setAppointments(mappedAppointments);
    } catch (error: any) {
      console.error("Error fetching user appointments:", error);
      setError(error?.message || "An unexpected error occurred.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchDoctorAppointments = async () => {
    console.log("[fetchDoctorAppointments] Triggered");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/doctors`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      console.log("[fetchDoctorAppointments] Response status:", res.status);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to fetch doctor appointments"
        );
      }
      const data = await res.json();
      console.log("[fetchDoctorAppointments] Data:", data);

      const mappedAppointments = Array.isArray(data)
        ? data.map((appointment: any) => ({
            id: appointment._id,
            patientId: appointment.patient?._id ?? "",
            patientName:
              appointment.patient?.name ?? appointment.patientName ?? "",
            patientEmail:
              appointment.patient?.email ?? appointment.patientEmail ?? "",
            patientPhone:
              appointment.patient?.phone ?? appointment.patientPhone ?? "",
            date: appointment.date,
            timeSlot: appointment.timeSlot,
            status: appointment.status,
            doctorId: appointment.doctor?.id ?? "", // just in case needed
            doctorName:
              appointment.doctor?.name ?? appointment.doctorName ?? "",
          }))
        : [];

      setDoctorAppointments(mappedAppointments);
      setLoadingAppointments(false);
    } catch (error: any) {
      console.error("[fetchDoctorAppointments] Error:", error.message);
      setError(error.message || "Unexpected error");
      setLoadingAppointments(false);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: "approved" | "rejected",
    token: string
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/status/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update appointment status");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  };

  const rescheduleAppointment = (
    id: string,
    date: string,
    timeSlot: string,
    token: string
  ): Promise<void> => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/reschedule/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, timeSlot }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to reschedule appointment");
  
        toast({
          title: "Success",
          description: "Appointment rescheduled successfully.",
        });
  
        fetchAppointmentsById();
        fetchDoctorAppointments();
      })
      .catch((error) => {
        console.error("Error rescheduling appointment:", error);
        toast({
          title: "Error",
          description: "Could not reschedule appointment.",
          variant: "destructive",
        });
      });
  };
  
  const contextValue: AppContextType = {
    doctors,
    appointments,
    DoctorAppointments,
    isAdmin,
    isDoctor,
    currentUser,
    token,
    loadingUser,
    loadingAppointments,
    error,
    setIsAdmin,
    setIsDoctor,
    setCurrentUser,
    setDoctors,
    setAppointments,
    setDoctorAppointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addAppointment,
    cancelAppointment,
    fetchAppointments,
    fetchAppointmentsById,
    fetchDoctorAppointments,
    fetchDoctors,
    fetchCurrentUser,
    login,
    signup,
    loginDoctor,
    logout,
    toast,
    setError,
    setLoadingAppointments, // Or create a wrapper function if needed
  //  getAuthTokenFromCookies,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

//context code ends here