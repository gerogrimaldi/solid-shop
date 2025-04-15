"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import OrderSummaryModal from "@/components/cartComponents/orderSummary";
import { CartItem } from "../../../types/Items";
import ErrorModal from "@/components/errorModal";
import OrderForm from "@/components/cartComponents/orderForm";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    postalCode: "",
    address: "",
    province: "",
    city: "",
    paymentMethod: "Efectivo al retirar",
    shippingMethod: "Normal" as "Normal" | "Express",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");


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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [status, user?.tokens?.accessToken]);

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shippingExtra = formData.shippingMethod === "Express" ? subtotal * 0.05 : 0;
    return subtotal + shippingExtra;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!cartItems || !Array.isArray(cartItems)) {
      alert("No hay items en el carrito");
      return;
    }
  
    try {
      const response = await fetch("/api/carts/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.tokens?.accessToken}`,
        },
        body: JSON.stringify({
          items: cartItems.map(({ itemId, id, quantity }) => ({
            itemId,
            productId: id,
            quantity,
          })),
        }),
      });
  
      if (!response.ok) {
        const err = await response.json();
  
        // alerta de sin stock 
        if (err.message?.includes("stock insuficiente")) {
          setErrorModalMessage(err.message);
          setShowErrorModal(true);
          return;
        }
        throw new Error(err.message || "Error al finalizar compra");
      }
  
      const data = await response.json();
      setOrderData({
        ...formData,
        email: user?.email,
        items: cartItems,
        total: calculateTotal(),
        subtotal: calculateSubtotal(),
        orderNumber: Math.floor(Math.random() * 1000000),
      });
      setModalOpen(true);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setErrorModalMessage(message);
      setShowErrorModal(true);    }
  };
  

  if (loading) return <div className="text-center p-8">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Formulario */}
        <OrderForm formData={formData} onChange={handleChange} />

        {/* productos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen del Pedido</h2>
          <div className="grid grid-cols-3 gap-4 text-gray-700 font-semibold border-b pb-2">
            <span>Producto</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Subtotal</span>
          </div>
          {cartItems.map((item) => (
            <div key={item.itemId} className="grid grid-cols-3 gap-4 py-2 border-b text-gray-600">
              <span>{item.name}</span>
              <span className="text-center">{item.quantity}</span>
              <span className="text-right">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-4 text-gray-800">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
            <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-500 transition-colors font-semibold"
          >
            Finalizar Compra
          </button>
        </div>
        
      </div>

      {modalOpen && orderData && (
        <OrderSummaryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          items={cartItems}
          subtotal={calculateSubtotal()}
          shippingType={formData.shippingMethod.toLowerCase() as "normal" | "express"}
          total={calculateTotal()}
          address={formData}
          userEmail={user?.email || ""}
          orderId={orderData?.orderNumber || ""}
        />
       )}

      <ErrorModal
        isOpen={showErrorModal}
        title="Producto sin stock"
        message={errorModalMessage}
        buttonText="Volver al carrito"
        onClose={() => {
          setShowErrorModal(false);
          router.push("/cart");
        }}
      />

    </div>
  );
}
