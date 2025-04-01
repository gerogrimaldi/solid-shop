import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <NavBar />

      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-grow p-8 text-center">
        <h1 className="text-4xl font-bold mt-6">Bienvenido a Mi E-commerce</h1>
        <p className="mt-2 text-lg sm:text-xl max-w-2xl">
          Encuentra los mejores productos al mejor precio.
        </p>

        {/* Productos destacados */}
        <h2 className="text-3xl font-semibold mt-8">Productos Destacados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 w-full px-8 mt-6">
          {[1, 2, 3, 4, 5].map((product) => (
            <div
              key={product}
              className="border p-4 rounded-lg shadow-md bg-gray-900 transform hover:scale-105 transition-transform"
            >
              <div className="h-40 bg-gray-700 mb-2 rounded-md"></div>
              <h3 className="text-lg font-medium">Producto {product}</h3>
              <p className="text-white">Descripción breve</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex space-x-4">
          <Link
            href="/products"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Ver Nuestros Productos
          </Link>
          <Link
            href="/auth/register"
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>

     <Footer/>
    </div>
  );
};

export default HomePage;