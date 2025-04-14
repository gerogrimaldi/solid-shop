'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from "next/legacy/image";
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface ProductPageProps {
  params: Promise<{ id: string }>;
  // params: { id: string };
}

const ProductPage: React.FC<ProductPageProps> = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [itemId, setItemId] = useState("");
  const [product, setProduct] = useState<Product>();
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);
  const { data: session, status } = useSession();
  const user = session?.user as any;

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
    const checkWishlistStatus = async () => {
      if (status !== "authenticated") return;
      if (!user || !product) {
        setCheckingWishlist(false);
        return;
      }
      
      try {
        const res = await fetch('/api/wishlists/items', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.tokens?.accessToken}`
          },
        });
        if (!res.ok) throw new Error("Error fetching wishlist");
        
        const wishlistItems = await res.json();
        const existingItem = wishlistItems.find((item: any) => item.id === product.id);
        if (existingItem) {
          const isLiked = true;
          setLiked(isLiked);
          setItemId(existingItem.itemId)
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      } finally {
        setCheckingWishlist(false);
      }
    };
    
    checkWishlistStatus();
  }, [user, product]);

  const handleAddToCart = async () => {
    if (!user || !product) return;
    try {
      const res = await fetch(`/api/carts/items`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.tokens?.accessToken}`
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Error al agregar al carrito");
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error(error);
      alert('Error al añadir al carrito');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user || !product) return;
    
    try {
      let res;

      if (liked) {
        // Si el producto ya está en la wishlist, eliminarlo
        res = await fetch(`/api/wishlists/items/${itemId}`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.tokens?.accessToken}`
          },
        });
      } else {
        // Si el producto no está en la wishlist, agregarlo
        res = await fetch('/api/wishlists/items', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.tokens?.accessToken}`
          },
          body: JSON.stringify({ productId: product.id }),
        });
      }
  
      if (!res.ok) throw new Error(liked ? "Error al eliminar de la lista de deseos" : "Error al añadir a la lista de deseos");
      
      // Cambiar el estado de "liked"
      setLiked(!liked);
      const item = await res.json();
      setItemId(item.id);
      console.log(itemId)
    } catch (error) {
      console.error(error);
      alert(liked ? 'Error al eliminar de la lista de deseos' : 'Error al añadir a la lista de deseos');
    }
  };
  

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-600">
        <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-medium">Producto no encontrado</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row"
        >
          <div className="md:w-1/2 relative overflow-hidden group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative h-80 md:h-full w-full"
            >
              <Image
                src={product.imageUrl || '/placeholder-image.jpg'}
                alt={product.name}
                layout="fill"
                sizes="(max-width: 768px) 100vw, 50vw"
                objectFit="cover"
                className="transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          </div>

          <div className="md:w-1/2 p-8 md:p-10 space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-between items-start">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{product.name}</h1>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToWishlist}
                  className="p-2 rounded-full hover:bg-red-50 transition-colors duration-300"
                >
                  <Heart
                    size={24}
                    className={`transition-all duration-300 ${
                      liked ? 'fill-red-500 stroke-red-500' : 'stroke-gray-400 hover:stroke-red-400'
                    }`}
                  />
                </motion.button>
              </div>

              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'text-amber-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">4.0 (24 reseñas)</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="prose prose-gray max-w-none"
            >
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="pt-4 border-t border-gray-100"
            >
              <div className="flex justify-between items-center">
                <p className="text-3xl font-bold text-amber-600">${product.price.toFixed(2)}</p>
                <div className="bg-green-50 px-3 py-1 rounded-full">
                  <p className={`text-sm text-green-600 font-medium ${product.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={addedToCart || product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium shadow-sm transition-all duration-300 ${
                  product.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {product.stock === 0 ? (
                  <>
                    <span>Producto agotado</span>
                  </>
                ) : addedToCart ? (
                  <>
                    <Check size={20} /> Añadido
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} /> Añadir al carrito
                  </>
                )}
              </motion.button>


              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium border text-gray-500 border-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Ver detalles
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="pt-4 text-sm text-gray-500"
            >
              <p>Envío gratis en pedidos superiores a $50</p>
              <p>Garantía de devolución de 30 días</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductPage;