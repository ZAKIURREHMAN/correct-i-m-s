import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useCompany from '../hooks/useCompany';
import { toastSuccess, toastError } from '../lib/toast'

const schema = yup.object({
  name: yup.string().required('Company name is required').min(2, 'At least 2 characters'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  address: yup.string().required('Address is required'),
  number: yup.string().required('Phone number is required').min(11, 'Phone number must be 11 digits'),
}).required();

function RegisterCompany({ open, setOpen }) {
  const queryClient = useQueryClient();
  const { createCompany } = useCompany();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) });

  const mutation = useMutation({
    mutationKey: ['organizations'],
    mutationFn: ({ name, address, number, email }) =>
      createCompany({ name, address, number, email }),
    onSuccess: () => {
      reset();
      setOpen(false);
      toastSuccess('Company created successfully');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: (err) => {
      toastError(err?.message || 'Creation failed');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => setOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-[scaleIn_0.25s_ease-out]">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5 text-white flex justify-between items-center">
          <h2 className="text-lg font-semibold tracking-wide">
            Create Company
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-white/80 hover:text-red-200 text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Company Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                type="text"
                {...register('address')}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="text"
                {...register('number')}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.number.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-1/2 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-1/2 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
              >
                {mutation.isPending ? 'Creating...' : 'Create Company'}
              </button>
            </div>

            {mutation.isError && (
              <p className="text-sm text-red-500 mt-3 text-center">
                {mutation.error?.message || 'Creation failed'}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default RegisterCompany;