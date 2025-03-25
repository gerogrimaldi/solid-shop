"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  username?: string;
  email?: string;
  roles?: string[];
}

const NavBar = () => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: UserData | null;
  }>({ isAuthenticated: false, user: null });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`/api/auth/verify`, {
          credentials: 'include'
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthState({ isAuthenticated: true, user: userData });
        } else {
          setAuthState({ isAuthenticated: false, user: null });
        }
      } catch (error) {
        setAuthState({ isAuthenticated: false, user: null });
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setAuthState({ isAuthenticated: false, user: null });
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Mi Ecommerce</Link>
      
      <div className="space-x-4 flex items-center">
        <Link href="/categories" className="hover:underline">Categorías</Link>
        <Link href="/about" className="hover:underline">Nosotros</Link>
        
        {authState.isAuthenticated ? (
          <>
            {authState.user?.roles?.includes('ADMIN') && (
              <Link href="/admin" className="hover:underline">Admin</Link>
            )}
            <Link href="/cart" className="hover:underline">Carrito</Link>
            <Link href="/wishlist" className="hover:underline">Wishlist</Link>
            <span className="text-gray-300 mx-2">{authState.user?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/signUp" className="hover:underline">Registrarse</Link>
            <Link href="/auth/login" className="hover:underline">Iniciar sesión</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;