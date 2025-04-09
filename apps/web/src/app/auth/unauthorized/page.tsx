"use client";

import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-red-100 border border-red-300 rounded-xl shadow-md max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-4 text-center">
          Acceso No Autorizado
        </h1>
        <p className="text-gray-800 dark:text-gray-200 mb-6 text-center">
          Lo sentimos, no tienes permiso para acceder a esta página.
        </p>
        <Link
          href="/auth/login"
          className="block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
        >
          Ir al Login
        </Link>
      </div>
    </div>
  );
}
