// pages/about.tsx
import NavBar from "@/components/NavBar";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex flex-col items-center justify-center flex-grow p-8 text-center">
        <h1 className="text-3xl font-bold mt-4">Sobre Nosotros</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Somos una tienda en línea dedicada a ofrecer productos de alta calidad al mejor precio.
          Nuestro compromiso es brindar una excelente experiencia de compra y un servicio al cliente excepcional.
        </p>
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Mi Ecommerce. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
