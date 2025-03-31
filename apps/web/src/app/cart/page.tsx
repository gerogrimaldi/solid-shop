"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartItemComponent from "@/components/CartItem";

interface CartItem {
  itemId: string;
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // GET
    const fetchCart = async () => {
      try {
        const response = await fetch("/api/carts/items", { credentials: "include" });
        if (!response.ok) throw new Error("Error al cargar el carrito");
        const data = await response.json();
        setCartItems(data);
        console.log(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // PATCH
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    console.log(itemId, newQuantity);
    try {
      const response = await fetch(`/api/carts/items`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, quantity: newQuantity }),
      });
      if (!response.ok) throw new Error("Error al actualizar");
      setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    }
  };

  // DELETE
  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/carts/items/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Error al eliminar");
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const calculateTotal = () => 
    cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Mi Carrito</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => router.push("/categories")}
              className="bg-[#39b54a] text-white px-4 py-2 rounded hover:bg-[#2ea346]"
            >
              Ver Productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-4">
            <div className="bg-white rounded-lg shadow-sm">
              {cartItems.map(item => (
                <CartItemComponent 
                  key={item.itemId} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeItem={removeItem} 
                />
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 h-fit">
              <h2 className="text-lg font-bold mb-4 text-gray-800">Resumen</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Productos ({cartItems.length})</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span className="text-[#39b54a]">Gratis</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="mt-4 w-full bg-[#39b54a] text-white py-3 rounded-lg hover:bg-[#2ea346] transition-colors font-semibold"
              >
                Continuar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
