// lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


// NEXT AUTH SOLO SE USA PARA ALMACENAR SESION
//  la logica de validaciones se hace en el backend con cookies
export const authOptions: NextAuthOptions = ({
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password", placeholder: "password" },
            },
            // en el parametro credentials viajan las credenciales ingresaadas desde el front
            // authorize se ejecuta en el back, por lo tanto los proxys de next.config.ts deben estar configurados para que las peticiones se redirijan al backend
           
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) return null;

                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authorization/login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                  }),
                });
            
                if (!res.ok) return null;
            
                const user = await res.json();
                return user; // almaceno el payload del jwt de la cookie
              },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token.username = user.username;
            token.roles = user.roles;
            token.email = user.email;
            token.sub = user.sub;
            token.cartId = user.cartId;
            token.wishlistId = user.wishlistId;
            token.accessToken = user.accessToken;
            token.refreshToken = user.refreshToken;
          }
          console.log("Jwt token i nnext auth", token)
          return token; // token sin actualizar
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
                    cartId: token.cartId as string,
                    wishlistId: token.wishlistId as string,
                    accessToken: token.accessToken as string,
                    refreshToken: token.refreshToken as string,
                  };
                }

                console.log("Session i nnext auth", session)
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