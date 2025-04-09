"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignInButton } from "./auth/SignInButton";
import { SignOutButton } from "./auth/SignOutButton";
import { ShoppingCart, Heart, LayoutDashboard } from "lucide-react";

const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  return (
    <nav className="w-full bg-white text-neutral-900 px-6 py-4 shadow-sm flex justify-between items-center border-b border-neutral-200">
      <Link href="/" className="flex items-center space-x-2 group">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={32} // puedes usar 64 si quieres más grande
          height={32}
          className="animate-float"
        />
        <span className="text-xl font-semibold tracking-wide text-white group-hover:text-amber-400 transition-colors duration-200">
          SOLID Shop
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/categories"
          className="text-sm hover:text-neutral-600 transition font-medium"
        >
          Categorías
        </Link>
        <Link
          href="/about"
          className="text-sm hover:text-neutral-600 transition font-medium"
        >
          Nosotros
        </Link>

        {isAuthenticated ? (
          <>
            {user?.roles?.includes("ADMIN") && (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-1 text-sm hover:text-neutral-600 transition font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}

            <Link
              href="/cart"
              className="flex items-center gap-1 text-sm hover:text-neutral-600 transition font-medium"
            >
              <ShoppingCart className="w-4 h-4" />
              Carrito
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center gap-1 text-sm hover:text-neutral-600 transition font-medium"
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </Link>

            <span className="text-sm text-neutral-500 font-medium px-2">
              {user?.username}
            </span>

            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
