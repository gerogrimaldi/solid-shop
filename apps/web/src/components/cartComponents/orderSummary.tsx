"use client";

import { CartItem } from "@/types/Items";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  shippingType: "normal" | "express";
  total: number;
  address: {
    postalCode: string;
    address: string;
    province: string;
    city: string;
  };
  userEmail: string;
  orderId: string;
};

export default function OrderSummaryModal({
  isOpen,
  onClose,
  items,
  subtotal,
  shippingType,
  total,
  address,
  userEmail,
  orderId,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen del Pedido</h2>
        <p className="text-sm text-gray-600 mb-2">Orden #{orderId}</p>
        <p className="text-sm text-gray-600 mb-4">Usuario: {userEmail}</p>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">Dirección</h3>
          <p className="text-sm text-gray-600">
            {address.address}, {address.city}, {address.province} ({address.postalCode})
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-1">Productos</h3>
          <ul className="text-sm text-gray-700 space-y-1 max-h-32 overflow-y-auto">
            {items.map(item => (
              <li key={item.itemId} className="flex justify-between">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío ({shippingType}):</span>
            <span>{shippingType === "express" ? "+5%" : "Gratis"}</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-[#39b54a] text-white py-2 rounded hover:bg-[#2ea346]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
