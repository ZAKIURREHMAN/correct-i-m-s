import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "./Navbar";
import { useMutation } from "@tanstack/react-query";
import useCreateCustomer from "../hooks/useCreateCustomer";
import { useNavigate } from "react-router-dom";

const customerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email address")
    .notRequired()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value)),
  number: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

const Customer = () => {
  const { createCustomer } = useCreateCustomer();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(customerSchema),
  });

  const { mutate: createCustomerMutate, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: (result) => {
      // Expecting { status, message, data: { customerId, ... } }
      const created = result?.data;
      const customerId = created?.customerId;
      reset();
      if (customerId) {
        navigate(`/order-items/new?customerId=${customerId}`);
      }
    },
    onError: (err) => {
      console.error("Failed to create customer:", err);
    },
  });

  const onSubmit = (data) => {
    createCustomerMutate(data);
  };

  return (
  <div className="min-h-screen w-full bg-gray-50">
    <Navbar />
    
    <div className="pt-8 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Customer
          </h1>
          <p className="mt-2 text-gray-600">
            Fill in the customer details below to add them to your database.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-indigo-200">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-lg">
            <h2 className="text-white font-medium">
              Customer Information
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-indigo-600">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.name 
                    ? "border-red-500 bg-red-50" 
                    : "border-indigo-300 focus:border-indigo-500 focus:outline-none"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-gray-500">(optional)</span>
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.email 
                    ? "border-red-500 bg-red-50" 
                    : "border-indigo-300 focus:border-indigo-500 focus:outline-none"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-indigo-600">*</span>
              </label>
              <input
                id="number"
                type="text"
                {...register("number")}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.number 
                    ? "border-red-500 bg-red-50" 
                    : "border-indigo-300 focus:border-indigo-500 focus:outline-none"
                }`}
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-indigo-600">*</span>
              </label>
              <input
                id="address"
                type="text"
                {...register("address")}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.address 
                    ? "border-red-500 bg-red-50" 
                    : "border-indigo-300 focus:border-indigo-500 focus:outline-none"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 border border-indigo-600 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-sm font-medium text-white hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? "Adding..." : "Add Customer"}
              </button>
            </div>

            {/* Required Fields Note */}
            <p className="text-xs text-gray-500 text-center">
              <span className="text-indigo-600">*</span> Required fields
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default Customer;