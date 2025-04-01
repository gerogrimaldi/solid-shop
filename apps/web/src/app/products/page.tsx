"use client";

import Footer from "@/components/Footer";
import NavBarProducts from "@/components/NavBarProducts";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/app/types/product";
import { useState } from "react";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Producto Ejemplo",
    description: "Descripción del producto",
    price: 99.99,
    stock: 10,
    category: "Electrónica",
    image: "https://via.placeholder.com/150",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProducts = mockProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter ? product.category === categoryFilter : true) &&
      (minPrice ? product.price >= Number(minPrice) : true) &&
      (maxPrice ? product.price <= Number(maxPrice) : true)
    );
  });

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBarProducts />
      
      <div className="w-full flex flex-col items-center p-4">
        <input
          type="text"
          placeholder="Que estas buscando ?"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 rounded bg-gray-800 text-white text-center mb-4"
        />
      </div>
      
      <main className="flex flex-grow p-8">
        {/* Filtros */}
        <aside className="w-1/4 bg-gray-900 p-4 rounded-lg mr-6 hidden md:block">
          <h2 className="text-white font-semibold mb-4">Filtros</h2>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          >
            <option value="">Todas las categorías</option>
            <option value="Electrónica">Electrónica</option>
          </select>
          <input
            type="number"
            placeholder="Precio mínimo"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          />
          <input
            type="number"
            placeholder="Precio máximo"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white"
          />
        </aside>

        {/* Lista de productos */}
        <section className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
