"use client";

import { signOut } from "next-auth/react";

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
    <form onSubmit={(e) => { e.preventDefault(); handleSignOut(); }}>
      <button
              type="submit"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl shadow-md transition duration-200 disabled:opacity-50"
            >
              Cerrar sesión
            </button>    
      </form>
  );
}
