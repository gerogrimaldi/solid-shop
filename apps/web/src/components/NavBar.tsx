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
  {/* Logo + Enlaces a la izquierda */}
  <div className="flex items-center space-x-6">
    <Link href="/" className="flex items-center space-x-2 group">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={32}
        height={32}
        className="animate-float"
      />
    </Link>

    <Link
      href="/categories"
      className="text-sm hover:text-neutral-600 transition font-medium"
    >
      Categorías
    </Link>

    <Link
      href="/nosotros"
      className="text-sm hover:text-neutral-600 transition font-medium"
    >
      Nosotros
    </Link>
  </div>

  {/* Parte derecha: autenticación, iconos, etc. */}
  <div className="flex items-center gap-4">
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
        </Link>

        <Link
          href="/wishlist"
          className="flex items-center gap-1 text-sm hover:text-neutral-600 transition font-medium"
        >
          <Heart className="w-4 h-4" />
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
