// components/NavBar.tsx
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Mi Ecommerce</Link>
      <div className="space-x-4">
        <Link href="/about" className="hover:underline">Nosotros</Link>
        <Link href="/contact" className="hover:underline">Contacto</Link>
        <Link href="/auth/login" className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
