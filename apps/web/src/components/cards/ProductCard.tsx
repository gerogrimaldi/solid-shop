'use client';

import { Product } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              animate={{ 
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <Image
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                className="transition-transform duration-500"
              />
            </motion.div>
          </div>
          
          <div className={`absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button className="bg-white/90 hover:bg-white text-amber-600 hover:text-amber-700 p-2 rounded-full shadow-md transition-colors">
              <ShoppingCart size={18} />
            </button>
            <button className="bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 p-2 rounded-full shadow-md transition-colors">
              <Heart size={18} />
            </button>
          </div>
          
          {product.stock <= 5 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {product.stock === 0 ? 'Agotado' : `¡Solo ${product.stock} disponibles!`}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex-grow">
          <h2 className="text-lg font-medium text-gray-800 mb-1 line-clamp-2">
            {product.name}
          </h2>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-amber-600">
              ${product.price.toFixed(2)}
            </p>
            <Link
              href={`/products/${product.id}`}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 transition-colors"
            >
              Ver detalles
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;