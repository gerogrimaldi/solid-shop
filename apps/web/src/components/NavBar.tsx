// components/NavBar.tsx
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Mi Ecommerce</Link>
      <div className="space-x-4">
        <Link href="/categories" className="hover:underline">Categorias</Link>
        <Link href="/about" className="hover:underline">Nosotros</Link>
        <Link href="/contact" className="hover:underline">Contacto</Link>
      </div>
    </nav>
  );
};

export default NavBar;
