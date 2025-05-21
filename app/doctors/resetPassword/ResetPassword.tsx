'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
    onSubmit: (values) => {
      if (!token) {
        toast.error('Invalid or missing token');
        return;
      }

      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors/resetPassword/${token}`, {
          newPassword: values.newPassword,
        })
        .then((response) => {
          toast.success(response.data.message);
          setTimeout(() => {
            router.push('/doctors/login');
          }, 3000);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || 'Your link has expired');
        });
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-blue-600">Reset Your Password</h2>
          <p className="text-gray-500">Please enter a new password for your account.</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder=" "
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className="peer w-full p-4 text-sm font-medium text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="newPassword"
              className="absolute left-4 top-2 text-sm text-blue-500 font-semibold peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-xs"
            >
              New Password
            </label>
            <button
              type="button"
              onClick={() => setPasswordVisible((prev) => !prev)}
              className="absolute right-4 top-2 text-blue-500"
            >
              {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              placeholder=" "
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className="peer w-full p-4 text-sm font-medium text-gray-900 bg-transparent border-2 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{formik.errors.confirmPassword}</p>
            )}
            <label
              htmlFor="confirmPassword"
              className="absolute left-4 top-2 text-sm text-blue-500 font-semibold peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-xs"
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible((prev) => !prev)}
              className="absolute right-4 top-2 text-blue-500"
            >
              {isConfirmPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            className="w-full py-2 bg-gray-200 text-blue-600 rounded-lg hover:bg-gray-300 transition duration-300"
            onClick={() => router.push('/doctors/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
