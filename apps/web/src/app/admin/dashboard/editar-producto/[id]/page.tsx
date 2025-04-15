'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Producto {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
}

const productosMock: Producto[] = [
  { id: '1', title: 'Remera Negra', price: 12000, category: 'Indumentaria', description: 'Remera de algodón negra, talle M' },
  { id: '2', title: 'Campera de Jean', price: 25000, category: 'Indumentaria', description: 'Campera azul con bolsillos' },
  { id: '3', title: 'Zapatillas Blancas', price: 18000, category: 'Calzado', description: 'Zapatillas deportivas blancas, talle 42' },
];

const EditarProductoPage: React.FC = () => {
  const router = useRouter();
  const { productId } = useParams();

  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const prod = productosMock.find(p => p.id === productId);
    if (prod) setProducto(prod);
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!producto) return;
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Producto actualizado: ${JSON.stringify(producto, null, 2)}`);
    // En una app real, acá llamarías a la API con PUT / PATCH
    router.push('/admin/dashboard/listado');
  };

  if (!producto) return <p className="p-4 text-center">Cargando producto...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-10 w-full max-w-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">Editar Producto</h1>

        <input
          type="text"
          name="title"
          value={producto.title}
          onChange={handleChange}
          placeholder="Título"
          className="w-full p-4 border border-gray-300 rounded-xl"
        />

        <input
          type="number"
          name="price"
          value={producto.price}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full p-4 border border-gray-300 rounded-xl"
        />

        <input
          type="text"
          name="category"
          value={producto.category}
          onChange={handleChange}
          placeholder="Categoría"
          className="w-full p-4 border border-gray-300 rounded-xl"
        />

        <textarea
          name="description"
          value={producto.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full p-4 border border-gray-300 rounded-xl"
          rows={4}
        />

        <button
          type="submit"
          className="w-full py-4 bg-amber-600 text-white rounded-xl text-lg font-semibold hover:bg-amber-700 transition"
        >
          💾 Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditarProductoPage;
