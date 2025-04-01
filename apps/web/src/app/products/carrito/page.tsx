"use client"
import { useState } from "react";

import { Product } from "@/app/types/product";
import NavBarProducts from "@/components/NavBarProducts";

// Simulación de productos en el carrito
const initialCart: Product[] = [
  {
    id: "1",
    name: "Producto Ejemplo 1",
    description: "Descripción del producto",
    price: 99.99,
    stock: 10,
    category: "Electrónica",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Producto Ejemplo 2",
    description: "Descripción del producto",
    price: 149.99,
    stock: 5,
    category: "Moda",
    image: "https://via.placeholder.com/150",
  },
];

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    initialCart.reduce((acc, product) => ({ ...acc, [product.id]: 1 }), {})
  );

  // Aumentar cantidad
  const increaseQuantity = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  // Disminuir cantidad
  const decreaseQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  // Eliminar producto del carrito
  const removeFromCart = (id: string) => {
    setCart(cart.filter((product) => product.id !== id));
    const newQuantities = { ...quantities };
    delete newQuantities[id];
    setQuantities(newQuantities);
  };

  // Calcular total
  const totalPrice = cart.reduce(
    (acc, product) => acc + product.price * quantities[product.id],
    0
  );

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBarProducts />
      <main className="flex flex-col items-center justify-center flex-grow p-8 text-center">
        <h1 className="text-3xl font-bold mt-4 text-white">Carrito de Compras</h1>
        {cart.length === 0 ? (
          <p className="text-gray-400 mt-6">Tu carrito está vacío.</p>
        ) : (
          <div className="w-full max-w-3xl bg-gray-900 p-6 rounded-lg shadow-lg">
            {cart.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border-b border-gray-700">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div className="text-left flex-grow ml-4">
                  <h2 className="text-white font-semibold">{product.name}</h2>
                  <p className="text-gray-400">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button onClick={() => decreaseQuantity(product.id)} className="bg-gray-700 text-white px-3 py-1 rounded-l">−</button>
                  <span className="bg-gray-800 text-white px-4 py-1">{quantities[product.id]}</span>
                  <button onClick={() => increaseQuantity(product.id)} className="bg-gray-700 text-white px-3 py-1 rounded-r">+</button>
                </div>
                <button onClick={() => removeFromCart(product.id)} className="text-red-500 ml-4">✕</button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6 text-white text-lg font-bold">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-white hover:bg-gray-300 text-black font-bold py-3 px-4 rounded-lg mt-6">
              Proceder al Checkout
            </button>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Mi Ecommerce. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default CartPage;
