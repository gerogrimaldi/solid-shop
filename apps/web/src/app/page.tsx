"use client";

import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { mockCategories } from "@/types/category";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/limited/6",{
          cache: 'no-store'
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    }

    fetchProducts();
  }, []);


  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD") // descompone acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina los acentos
      .replace(/\s+/g, "-"); // reemplaza espacios por guiones (opcional)
  }

  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      <section className="flex flex-col md:flex-row gap-4 p-6 items-center justify-center">
        <aside className="w-full md:w-1/4 space-y-3">
          {mockCategories.map((category) => (
            <Link
              key={category}
              href={`/categories/${slugify(category)}`}
              className="block text-base font-medium hover:text-gray-600 transition"
            >
              {category}
            </Link>
          ))}
        </aside>
        
        <div className="relative w-full md:w-3/4 rounded-2xl overflow-hidden shadow-lg group">
          <div className="transition-transform duration-700 group-hover:scale-105">
            <Image
              src="/hero-image.png"
              alt="Oferta destacada"
              width={1200}
              height={500}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-black/30 z-10 flex flex-col justify-center items-center text-white p-6">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">¡Ofertas increíbles!</h2>
            <p className="text-md md:text-lg mb-4">Hasta 50% de descuento en productos seleccionados</p>
            <Link
              href="/categories"
              className="bg-white text-gray-800 px-5 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Ver Productos
            </Link>
          </div>
        </div>


      </section>

      {/* productos */}
      <section className="p-6">
        <h3 className="text-xl font-semibold mb-4">Productos destacados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
