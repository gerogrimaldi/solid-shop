"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <Lock size={48} className="text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso no autorizado</h1>
        <p className="text-gray-600 mb-6">
          No tienes permisos para ver esta página. Por favor inicia sesión con una cuenta válida.
        </p>
        <button
          onClick={goToLogin}
          className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Ir al inicio de sesión
        </button>
      </div>
    </div>
  );
}
