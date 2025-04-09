"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema, SignupFormData } from "@/types/schemas";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";

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
      setMessage("¡Registro exitoso!");
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "El registro falló. Inténtalo de nuevo.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Crear cuenta</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-amber-400">
            <User className="text-gray-400" size={18} />
            <input
              type="text"
              {...register("username")}
              className="w-full outline-none bg-transparent text-gray-800"
              placeholder="Tu nombre de usuario"
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-amber-400">
            <Mail className="text-gray-400" size={18} />
            <input
              type="email"
              {...register("email")}
              className="w-full outline-none bg-transparent text-gray-800"
              placeholder="correo@ejemplo.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-amber-400">
            <Lock className="text-gray-400" size={18} />
            <input
              type="password"
              {...register("password")}
              className="w-full outline-none bg-transparent text-gray-800"
              placeholder="********"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {errors.root && (
          <p className="text-red-500 text-sm text-center">{errors.root.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-green-500 text-sm text-center">{message}</p>
      )}
    </div>
  );
}
