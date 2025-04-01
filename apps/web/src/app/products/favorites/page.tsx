// pages/favorites.tsx

import { Product } from "@/app/types/product";
import NavBarProducts from "@/components/NavBarProducts";

// Simulando los productos favoritos (puedes integrarlo con tu backend más tarde)
const mockFavorites: Product[] = [
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
    category: "Ropa",
    image: "https://via.placeholder.com/150",
  },
];

const FavoritesPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <NavBarProducts/>

      <main className="flex flex-col items-center justify-center flex-grow p-8 text-center">
        <h1 className="text-3xl font-bold mt-4 text-white">Favoritos</h1>
        <p className="text-gray-600 mt-2 max-w-2xl text-white">
          Aquí están todos los productos que has añadido a tus favoritos.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mockFavorites.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-700">{product.description}</p>
              <p className="mt-2 font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Mi Ecommerce. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default FavoritesPage;
