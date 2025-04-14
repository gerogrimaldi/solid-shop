"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

export const SignInButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return null; // Ya se maneja en NavBar
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="flex items-center gap-1 px-3 py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden md:inline">Iniciar sesión</span>
      </Link>
      <Link
        href="/auth/signUp"
        className="flex items-center gap-1 px-3 py-2 bg-white text-neutral-900 border border-neutral-300 rounded-full hover:bg-neutral-100 transition-colors"
      >
        <UserPlus className="w-4 h-4" />
        <span className="hidden md:inline">Registrarse</span>
      </Link>
    </div>
  );
};
