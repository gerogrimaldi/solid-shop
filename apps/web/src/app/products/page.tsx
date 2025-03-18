import NavBar from "@/components/NavBar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/app/types/product";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Producto Ejemplo",
    description: "Descripción del producto",
    price: 99.99,
    stock: 10,
    category: "Electrónica",
    image: "https://via.placeholder.com/150",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex flex-col items-center justify-center flex-grow p-8 text-center">
        <h1 className="text-3xl font-bold mt-4">Nuestros Productos</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Explora nuestra variedad de productos y encuentra lo que necesitas al mejor precio.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Mi Ecommerce. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}