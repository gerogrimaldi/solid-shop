"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "../types/category";
import CategoryCard from "@/components/CategoryCard";
import NavBar from "@/components/NavBar";


export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
      <div className="container mx-auto p-6">

      <h1 className="text-3xl mt-4 font-bold text-center mb-6">Categorías de Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}