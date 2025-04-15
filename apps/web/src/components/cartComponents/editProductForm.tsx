// components/ProductEditForm.tsx
'use client';

import { Product } from "@/types/product";
import { useState } from 'react';

interface Props {
  product: Product;
  onClose: () => void;
  onSubmit: (updated: Partial<Product>) => void;
}

export default function ProductEditForm({ product, onClose, onSubmit }: Props) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [stock, setStock] = useState(product.stock);

  const handleSubmit = () => {
    onSubmit({
      id: product.id,
      name,
      description,
      price,
      stock,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Editar Producto</h2>

        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded text-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
          />
          <textarea
            className="w-full border p-2 rounded text-gray-700"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
          />
          <input
            className="w-full border p-2 rounded text-gray-700"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Precio"
          />
          <input
            className="w-full border p-2 rounded text-gray-700"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            placeholder="Stock"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
