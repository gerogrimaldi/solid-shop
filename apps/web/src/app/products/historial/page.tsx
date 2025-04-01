"use client";

import { useState } from "react";
import Link from "next/link";
import NavBarProducts from "@/components/NavBarProducts";

// Simulación de historial de compras
const mockHistory = [
  {
    orderId: "ORD-12345",
    date: "2025-03-25",
    total: 249.97,
    status: "Completada",
    products: [
      {
        id: "1",
        name: "Producto Ejemplo 1",
        price: 99.99,
        image: "https://via.placeholder.com/150",
      },
      {
        id: "2",
        name: "Producto Ejemplo 2",
        price: 149.99,
        image: "https://via.placeholder.com/150",
      },
    ],
  },
  {
    orderId: "ORD-67890",
    date: "2025-03-20",
    total: 99.99,
    status: "Pendiente",
    products: [
      {
        id: "3",
        name: "Producto Ejemplo 3",
        price: 99.99,
        image: "https://via.placeholder.com/150",
      },
    ],
  },
];

const HistoryPage = () => {
  const [orders] = useState(mockHistory);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBarProducts />
      <main className="flex flex-col items-center justify-center flex-grow p-8 text-center">
        <h1 className="text-3xl font-bold mt-4 text-white">Historial de Compras</h1>
        {orders.length === 0 ? (
          <p className="text-gray-400 mt-6">Aún no has realizado ninguna compra.</p>
        ) : (
          <div className="w-full max-w-3xl bg-gray-900 p-6 rounded-lg shadow-lg">
            {orders.map((order) => (
              <div key={order.orderId} className="mb-6 p-4 border border-gray-700 rounded">
                <h2 className="text-white font-semibold">Orden #{order.orderId}</h2>
                <p className="text-gray-400">Fecha: {order.date}</p>
                <p className="text-gray-400">
                  Estado:{" "}
                  <span
                    className={`font-bold ${
                      order.status === "Completada" ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p className="text-white font-bold mt-2">Total: ${order.total.toFixed(2)}</p>
                <div className="mt-4 space-y-2">
                  {order.products.map((product) => (
                    <div key={product.id} className="flex items-center border-b border-gray-700 pb-2">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      <div className="ml-4 text-left">
                        <h3 className="text-white">{product.name}</h3>
                        <p className="text-gray-400">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <Link href="/products" className="w-full bg-white hover:bg-gray-300 text-black font-bold py-3 px-4 rounded-lg mt-6">
          Volver a la Tienda
        </Link>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Mi Ecommerce. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default HistoryPage;
