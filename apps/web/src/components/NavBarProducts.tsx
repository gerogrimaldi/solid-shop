"use client"
import { useState } from "react";
import Link from "next/link";

const NavBarProducts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-800 text-white p-4 py-2 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Mi Ecommerce</Link>

      <div className="relative">
        <button
          onClick={toggleMenu}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors text-lg"
        >
          Cuenta
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg">
            <Link href="/products/favorites" className="block px-4 py-2 hover:bg-gray-700">Favoritos</Link>
            <Link href="/products/carrito" className="block px-4 py-2 hover:bg-gray-700">Carrito</Link>
            <Link href="/products/historial" className="block px-4 py-2 hover:bg-gray-700">Historial de Compras</Link>
            <Link href="/auth/logout" className="block px-4 py-2 hover:bg-gray-700">Cerrar sesión</Link>
            <Link href="/products" className="block px-4 py-2 hover:bg-gray-700">Productos</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarProducts;
