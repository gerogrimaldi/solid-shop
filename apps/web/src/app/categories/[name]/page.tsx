'use client';

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/cards/ProductCard";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface CategoryDetailProps {
  params: { name: string };
}

export default function CategoryDetail({ params }: CategoryDetailProps) {
  const { name } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<{name: string}>({
    name: decodeURIComponent(String(name))
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/categories/${name}`);
        if (!res.ok) throw new Error("Error fetching products");

        const data = await res.json();
        setProducts(data);
        
      } catch (error) {
        setError("Error al cargar los productos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center text-gray-600 p-6">
        <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-xl font-medium mb-2">Ha ocurrido un error</h2>
        <p className="text-center text-gray-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-300"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {categoryDetails.name.charAt(0).toUpperCase() + categoryDetails.name.slice(1)}
          </h1>
        </motion.div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-2xl mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No hay productos disponibles</h3>
            <p className="text-gray-500">No se encontraron productos en esta categoría en este momento.</p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}