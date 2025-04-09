"use client";

import { CartItem } from "@/types/Items";
import Image from "next/legacy/image";

interface CartItemProps {
  item: CartItem;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
}

export default function CartItemComponent({ item, updateQuantity, removeItem }: CartItemProps) {
  // Si no hay imagen, se muestra una imagen por defecto
  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      <Image
        src={item.imageUrl || "/placeholder-product.png"}
        alt={item.name}
        width={100}
        height={100}
        className="rounded-md mr-4 object-cover"
      />
      <div className="flex-grow">
        <h3 className="font-medium text-gray-800">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
        <button
          onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
          className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-l-lg"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="px-2 text-gray-800">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
          className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-r-lg"
        >
          +
        </button>
      </div>
      <button
        onClick={() => removeItem(item.itemId)}
        className="ml-4 text-red-500 hover:text-red-700 text-sm"
      >
        Eliminar
      </button>
    </div>
  );
}
