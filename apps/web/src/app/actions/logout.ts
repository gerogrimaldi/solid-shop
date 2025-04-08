// app/actions/logout.ts
"use server";

import { signOut } from "next-auth/react"; // 👈 esta es la versión server de NextAuth

export async function serverLogout() {
  try {
    // Llama al backend para limpiar cookies httpOnly
    await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        // Esto es clave si usás cookies httpOnly: el header necesita estar vacío o reenviar cookies
        Cookie: "", 
      },
    });

    // Luego destruimos la sesión de NextAuth
    await signOut();
  } catch (err) {
    console.error("Error en serverLogout:", err);
    throw err;
  }
}
