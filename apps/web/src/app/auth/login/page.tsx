import React from "react";
import Link from "next/link";

const LoginForm = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-white mb-4">
          Iniciar Sesión
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Accede a tu cuenta para continuar.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="tuemail@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg mt-6 hover:bg-gray-300">
            Iniciar Sesión
          </button>
        </form>

        <button className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg mt-4 flex items-center justify-center gap-2 shadow-md hover:bg-gray-300 transition">
          <img src="/google-logo.png" alt="Google Logo" className="h-5 w-5" />
          Ingresar con Google
        </button>

        <p className="text-center text-gray-400 mt-4">
          ¿No tienes una cuenta? {" "}
          <Link href="/auth/register" className="text-white hover:text-gray-300">
            Regístrate aquí
          </Link>
          {" o "}
          <Link href="/" className="text-white hover:text-gray-300">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
