'use client';

import { Category } from "@/types/category";
import Link from "next/link";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import { useState } from "react";

const CategoryCard = ({ category }: { category: Category }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD") // descompone acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
      .replace(/\s+/g, "-"); // reemplaza espacios por guiones (opcional)
  }

  const categoryName = slugify(category.name);
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <Link href={`/categories/${encodeURIComponent(categoryName)}`} className="block h-full">
        <div className="relative aspect-video bg-gray-50 overflow-hidden">
          {category.imageUrl && (
            <div className="absolute inset-0">
              <motion.div
                animate={{ 
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.4 }}
                className="h-full w-full relative"
              >
                <Image
                  src={category.imageUrl || "/placeholder.jpg"}
                  alt={category.name}
                  layout="fill"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  objectFit="cover"
                  className="transition-transform duration-500"
                />
              </motion.div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70"></div>
        </div>
        
        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {decodeURIComponent(category.name)}
          </h2>
          
          
          <div className="flex justify-between items-center">
            <span className="text-amber-600 font-medium">Ver productos</span>
            <motion.svg 
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5 text-amber-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </motion.svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;