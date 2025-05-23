"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import next from "next";

const ForgotPassword = () => {
  
  const [isLoading, setIsLoading] = useState(false);
 const router = useRouter()


  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
   onSubmit: async (values) => {
  setIsLoading(true);
  try {
    console.log("Submitting forgot password request with email:", values.email);

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/forgotPassword`,
      { email: values.email }
    );

    console.log("Response from forgot password API:", res.data);

    toast.success("Password reset link sent to your email");
    formik.resetForm();
  } catch (error: any) {
    console.error("Error response:", error?.response);
    console.error("Error message:", error?.message);
    console.error("Stack trace:", error?.stack);

    toast.error(
      error?.response?.data?.message || "Something went wrong, please try again"
    );
  } finally {
    setIsLoading(false);
  }
},
  });

  return (
  <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md   ">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-600">Forgot Password</h2>
          <p className="text-gray-500">
            Enter your email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder=" "
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="peer w-full p-4 text-sm font-medium text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.email}</p>
            )}
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-sm text-blue-500 font-semibold peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-xs"
            >
              Email Address
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            className="w-full py-2 bg-gray-200 text-blue-600 rounded-lg hover:bg-gray-300 transition duration-300"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
      </div>
   
  );
};

export default ForgotPassword;
