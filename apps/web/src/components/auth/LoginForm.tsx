"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, LoginFormData } from "@/types/schemas";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setFormError("");
    // login directo al backend para que este setee las cookies
    const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      
      const message = errorData?.statusCode === 401
        ? errorData?.message : "Error al iniciar sesión";
    
      setFormError(message);
      return;
    } else {
      // ya tengo la cookie con el jwt seteada por lo que solo hago el signIn de next-auth para que se almacene en la session
      //  await signIn("credentials", {
      //    redirect: false
      //  });
      router.push("/");
    }

  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inicia sesion en tu cuenta</h2>
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
            Contraseña
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

        {formError && (
          <p className="text-sm text-red-600 text-center">{formError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {isSubmitting ? "Ingresando..." : "Iniciar sesion"}
        </button>

        <div className="text-center text-sm text-gray-600">
          <span className="mr-1">No tienes una cuenta?</span>
          <Link 
                href={"/auth/signUp"} 
                className="text-blue-600 hover:text-blue-700 font-medium">
                Registrate
          </Link>
        </div>
      </form>
    </div>
  );
}
