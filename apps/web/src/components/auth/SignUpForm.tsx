"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema, SignupFormData } from "@/types/schemas";
import { useState } from "react";

interface SignUpFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
  });

  const [message, setMessage] = useState("");

  const handleFormSubmit = async (data: SignupFormData) => {
    try {
      await onSubmit(data);
      setMessage("Sign-up successful!");
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Signup failed. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            {...register("username")}
            className="w-full mt-1 p-2 border text-black rounded-lg focus:ring focus:ring-blue-300"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full mt-1 p-2 border text-black rounded-lg focus:ring focus:ring-blue-300"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full mt-1 p-2 border text-black rounded-lg focus:ring focus:ring-blue-300"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      {message && <p className="mt-3 text-center text-green-500">{message}</p>}
    </div>
  );
}