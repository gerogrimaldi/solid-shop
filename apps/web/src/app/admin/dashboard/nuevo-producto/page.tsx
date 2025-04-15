'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useSession } from 'next-auth/react';

const AdminProductPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCreateProduct = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    const newProduct: Product = {
      name,
      description,
      price,
      stock,
      imageUrl,
      id: ''
    };

    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user?.tokens?.accessToken}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (!res.ok) {
        throw new Error('Error al crear el producto');
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Producto</h1>

            {/* Input para nombre */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-gray-600">Nombre del Producto</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 text-black border border-gray-300 rounded-lg"
                placeholder="Nombre del producto"
              />
            </div>

            {/* Input para descripción */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-gray-600">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-black border border-gray-300 rounded-lg"
                placeholder="Descripción del producto"
              />
            </div>

            {/* Input para precio */}
            <div className="space-y-2">
              <label htmlFor="price" className="text-gray-600">Precio</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-3 text-black border border-gray-300 rounded-lg"
                placeholder="Precio"
              />
            </div>

            {/* Input para stock */}
            <div className="space-y-2">
              <label htmlFor="stock" className="text-gray-600">Stock</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-3 text-black border border-gray-300 rounded-lg"
                placeholder="Cantidad en stock"
              />
            </div>

            {/* Input para URL de imagen */}
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-gray-600">URL de Imagen</label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-3 text-black border border-gray-300 rounded-lg"
                placeholder="URL de la imagen del producto"
              />
            </div>

            {/* Botón para crear el producto */}
            <button
              onClick={handleCreateProduct}
              disabled={loading}
              className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium shadow-md hover:bg-amber-700 transition-all duration-300"
            >
              {loading ? 'Creando...' : 'Crear Producto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductPage;
