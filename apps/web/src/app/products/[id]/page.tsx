"use client";

import { Product } from '@/app/types/product';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode'; // Importamos la librería

interface ProductPageProps {
  params: { id: string };
}

const ProductPage: React.FC<ProductPageProps> = ({ params }: ProductPageProps) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null); // Aquí va el estado para el usuario decodificado

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Error fetching product");

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        setError("Error al cargar el producto");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchUser = () => {
      const token = localStorage.getItem('token'); // Suponiendo que el token se guarda en el localStorage

      if (token) {
        try {
          const decodedUser = jwtDecode(token); // Decodificar el token
          setUser(decodedUser); // Establecer el usuario en el estado
        } catch (error) {
          console.error("Error al decodificar el token", error);
        }
      }
    };

    fetchUser();
  }, []);

  // boton añadir al carrito
  const handleAddToCart = async () => {
    if (!user || !product) return;

    try {
      const res = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          userId: user.userId,
          quantity: 1, 
        }),
      });

      if (!res.ok) throw new Error("Error al agregar al carrito");

      alert('Producto añadido al carrito');
    } catch (error) {
      console.error(error);
      alert('Error al añadir al carrito');
    }
  };

  // boton añadir wishlist
  const handleAddToWishlist = async () => {
    if (!user || !product) return;

    try {
      const res = await fetch('/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          userId: user.userId,
        }),
      });

      if (!res.ok) throw new Error("Error al añadir a la lista de deseos");

      alert('Producto añadido a la lista de deseos');
    } catch (error) {
      console.error(error);
      alert('Error al añadir a la lista de deseos');
    }
  };

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <Image
            src={product.imageUrl || '/placeholder-image.jpg'}
            alt={product.name}
            width={500}
            height={500}
            className="object-cover rounded-md"
          />
        </div>
        <div className="md:w-1/2 md:pl-6">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddToWishlist}
          >
            Añadir a la lista de deseos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
