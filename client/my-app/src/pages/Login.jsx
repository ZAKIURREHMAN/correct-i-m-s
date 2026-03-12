import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import  useLogin  from "../hooks/useLogin";
import { toastSuccess, toastError } from '../lib/toast'

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { loginUser } = useLogin();
  const muation = useMutation({
    mutationFn: ({ email, password }) => loginUser({ email, password }),
    onSuccess: (result) => {
      if (result) {
        toastSuccess('Signed in successfully');
        navigate('/admin-dashboard');
      }
    },
    onError: () => {
      // Show a toast when credentials are incorrect or request fails
      toastError('Invalid email or password');
    },
  });

  const onSubmit = (data) => {
    muation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        
        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Sign In
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 cursor-pointer text-white py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200"
            disabled={muation.isPending}
          >
            {muation.isPending ? "Signing In..." : "Sign In"}
          </button>
          {/* No inline server error message; using toast instead */}
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span className="text-indigo-600 font-medium cursor-pointer hover:underline" onClick={()=>navigate('/register')} >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;