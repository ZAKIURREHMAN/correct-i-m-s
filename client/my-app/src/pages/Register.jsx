import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import  useRegister  from "../hooks/useRegister";
import { toastSuccess, toastError } from '../lib/toast'

function Register() {
  const { registerUser } = useRegister();
  const navigate = useNavigate();
  const yupSchema = yup
    .object({
      name: yup
        .string()
        .required("Full name is required")
        .min(3, "Name must be at least 3 characters"),
      email: yup
        .string()
        .required("Email is required")
        .email("Please Enter a valid email"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(yupSchema) });

  //   const { mutate: registerUser, isPending, isError, error } = useMutation({
  //     mutationKey: ["auth", "register"],
  //     mutationFn: registerRequest,
  //   });

  const muation = useMutation({
    mutationFn:({name,email,password})=>registerUser({name,email,password}),
    onSuccess: () => {
      toastSuccess('Account created successfully');
      navigate('/');
    },
    onError: (err) => {
      toastError(err?.message || 'Registration failed');
    }
  })

  const submitData = (data) => {
    const {name,email,password} = data
    muation.mutate({name,email,password})
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please fill in the details below
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(submitData)}>
          <div className=" mt-[-15px]">
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1.5 ">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className=" mt-[-15px] ">
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Email
            </label>
            <input
              type="type"
              placeholder="example@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 mt-1.5 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className=" mt-[-15px]  ">
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 mt-1.5 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 cursor-pointer transition duration-200"
            // disabled={isPending}
          >
            {/* {isPending ? "Creating..." : "Create Account"} */}
            Register
          </button>
          {/* {isError && (
            <p className="text-sm text-red-500 mt-2">
              {error?.message || "Registration failed"}
            </p>
          )} */}
        </form>
        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            className="text-indigo-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
