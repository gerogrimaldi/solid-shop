import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-white mb-4">Regístrate</h1>
        <p className="text-gray-400 text-center mb-6">
          Crea tu cuenta para comenzar a usar nuestra plataforma.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Nombre</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Correo electrónico</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="tuemail@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-semibold mb-1">Confirmar contraseña</label>
            <input
              type="password"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-white hover:bg-gray-300 text-black font-bold py-3 px-4 rounded-lg mt-6">
            Registrarse
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          ¿Ya tienes una cuenta? {" "}
          <Link href="/auth/login" className="text-white hover:text-gray-300">
            Inicia sesión aquí
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

export default RegisterPage;