'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Producto {
  id: string;
  title: string;
  price: number;
  category: string;
}

const ListadoDeProductos: React.FC = () => {
  const router = useRouter();

  const [productos, setProductos] = useState<Producto[]>([
    { id: '1', title: 'Remera Negra', price: 12000, category: 'Indumentaria' },
    { id: '2', title: 'Campera de Jean', price: 25000, category: 'Indumentaria' },
    { id: '3', title: 'Zapatillas Blancas', price: 18000, category: 'Calzado' },
  ]);

  const eliminarProducto = (id: string) => {
    const confirmacion = confirm('¿Estás seguro de eliminar este producto?');
    if (!confirmacion) return;
    setProductos(prev => prev.filter(producto => producto.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Listado de Productos</h1>

      <div className="w-full max-w-4xl space-y-4">
        {productos.map(producto => (
          <div
            key={producto.id}
            className="bg-white text-black shadow-md rounded-xl p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{producto.title}</h2>
              <p className="text-gray-600">${producto.price} - {producto.category}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/admin/dashboard/editar-producto/${producto.id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
              >
                ✏️ Editar
              </button>

              <button
                onClick={() => eliminarProducto(producto.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListadoDeProductos;
