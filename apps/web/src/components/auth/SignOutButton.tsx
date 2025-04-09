"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  async function handleSignOut() {
    try {
      console.log("Cerrando sesión fetch...");
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authorization/logout`, {
        method: "POST",
        credentials: "include",
      });

      await signOut({ callbackUrl: "/" }); // redirige al home
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignOut();
      }}
    >
      <button
        type="submit"
        title="Cerrar sesión"
        className="flex items-center gap-1 px-4 py-2 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </form>
  );
}
