

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";



// NEXT AUTH SOLO SE USA PARA ALMACENAR SESION
//  la logica de validaciones se hace en el backend con cookies
export const authOptions: NextAuthOptions = ({
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholeder: "example@example.com" },
                password: { label: "Password", type: "password", placeholder: "password" },
            },
            // en el parametro credentials viajan las credenciales ingresaadas desde el front
            // authorize se ejecuta en el back, por lo tanto los proxys de next.config.ts deben estar configurados para que las peticiones se redirijan al backend
           
            authorize: async (credentials, req) => {
                // Ya estamos logueados en este punto por lo que oslo verificamos que la cookie sea seteada
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authorization/verify`, {
                  method: "GET",
                  credentials: "include", 
                  headers: {
                    Cookie: req?.headers?.cookie || "", // para que next reenvíe cookies del navegador
                  },
                });
            
                if (!res.ok) return null;
            
                const user = await res.json();
                return user; // almaceno el payload del jwt de la cookie
              },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            try {
                if (user) {
                    token.username = user.username;
                    token.email = user.email;
                    token.roles = user.roles;
                    token.sub = user.id;
                  }

                  return token;
            } catch (err) {
                console.error("Error en jwt callback:", err);
            }
          
            return token;
          },          
      
        async session({ session, token }) {
           // Copiamos del token a la sesión
           try {
            if (token) {
                session.user = {
                    id: token.sub || '',
                    username: token.username as string,
                    email: token.email as string,
                    roles: token.roles as string[],
                    };
                }
            return session;

            }catch (err) {
                console.error("Error en session callback:", err);
                return session;
            }
        }
      },
      pages: {
        signIn: "/auth/login",
        error: "/auth/unauthorized",
      },
    });

    const handlers = NextAuth(authOptions);

    export {handlers as GET, handlers as POST};