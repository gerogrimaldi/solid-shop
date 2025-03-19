"use client";

import { useEffect, useState } from "react";
import { Product } from "@/app/types/product";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";

interface CategoryDetailProps {
  params: { name: string };
}

export default  function CategoryDetail({ params }: CategoryDetailProps) {
  const { name } =  useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/categories/${name}/products`);
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Categoría: {name}</h1>

      {loading && <p className="text-center">Cargando productos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-center">No hay productos en esta categoría.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
