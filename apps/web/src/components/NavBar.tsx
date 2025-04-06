"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignInButton } from "./auth/SignInButton";
import { SignOutButton } from "./auth/SignOutButton";

const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Mi Ecommerce</Link>

      <div className="space-x-4 flex items-center">
        <Link href="/categories" className="hover:underline">Categorías</Link>
        <Link href="/about" className="hover:underline">Nosotros</Link>

        {isAuthenticated ? (
          <>
            {user?.roles?.includes("ADMIN") && (
              <Link href="/admin" className="hover:underline">Admin</Link>
            )}
            <Link href="/cart" className="hover:underline">Carrito</Link>
            <Link href="/wishlist" className="hover:underline">Wishlist</Link>
            <span className="text-gray-300 mx-2">{user?.username}</span>
            <SignOutButton/>
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
