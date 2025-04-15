"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types/Items";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("sandbox");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchCart = async () => {
      try {
        const response = await fetchWithAuth("/api/carts/items", {
          headers: {
            Authorization: `Bearer ${user?.tokens?.accessToken}`,
          },
        }, router);

        if (!response.ok) throw new Error("Error al cargar el carrito");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [status, user?.tokens?.accessToken]);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // Aquí iría la lógica del sandbox o redirección a pago simulado
    console.log("Procesando pago con:", { cartItems, shipping, paymentMethod });
    alert("Compra simulada completada!");
    router.push("/");
  };

  if (loading) return <div className="text-center p-8">Cargando...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Finalizar Compra</h1>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Tus productos</h2>
            <ul className="space-y-4">
              {cartItems.map(item => (
                <li key={item.itemId} className="flex justify-between text-gray-800">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Detalles de compra</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Envío</label>
              <select
                className="w-full border-gray-300 rounded-lg text-gray-800"
                value={shipping}
                onChange={e => setShipping(e.target.value)}
              >
                <option value="standard">Estándar - Gratis</option>
                <option value="express">Exprés - $5.00</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Forma de Pago</label>
              <select
                className="w-full border-gray-300 rounded-lg text-gray-800"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="sandbox">Simulación Sandbox</option>
                <option value="credit">Tarjeta de Crédito</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-[#39b54a] text-white py-3 rounded-lg hover:bg-[#2ea346] transition-colors font-semibold"
            >
              Confirmar y Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
