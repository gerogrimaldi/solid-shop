"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WishlistItemComponent from "@/components/WishListItem";
import { WishlistItem } from "../types/Items";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/wishlists/items", { credentials: "include" });
        if (!response.ok) throw new Error("Error al cargar la lista de favoritos");
        const data = await response.json();
        setWishlistItems(data);
        console.log(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const removeItem = async (itemId: string) => {
    
    try {
      const response = await fetch(`/api/wishlists/items/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      setWishlistItems(prev => prev.filter(item => item.itemId  !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const addToCart = async (productId: string, itemId:string) => {
    try {
        // console.log("Agregando al carrito", productId);
        // console.log("Eliminando", itemId);
      const response = await fetch('/api/carts/items', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productId: productId, 
            quantity: 1 
        }),
      });
      
      if (!response.ok) throw new Error("Error al agregar al carrito");
      
      removeItem(itemId); // Elimina el item que ya esta en el carrito
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al agregar al carrito");
    }
  };

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Favoritos</h1>

        <div className="mb-6 border-b">
          <div className="flex">
            <div className="py-3 px-4 border-b-2 border-blue-500 text-blue-500">
              Mis favoritos
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-600 mb-4">Tu lista de favoritos está vacía</p>
            <button
              onClick={() => router.push("/categories")}
              className="bg-[#3483fa] text-white px-4 py-2 rounded hover:bg-[#2968c8]"
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm">
            {wishlistItems.map(item => (
              <WishlistItemComponent 
                key={item.itemId} 
                item={item} 
                removeItem={removeItem}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}