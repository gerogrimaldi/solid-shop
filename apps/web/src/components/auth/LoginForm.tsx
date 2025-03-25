"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, LoginFormData } from "@/app/types/schemas";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-sm text-gray-600">
          <span className="mr-1">Don't have an account?</span>
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}