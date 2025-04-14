// lib/auth.ts
import NextAuth, {  NextAuthOptions } from "next-auth";
import {JWT} from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";



async function refreshToken(token: JWT): Promise<JWT> {
  try {
    if (!token.backendTokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/refresh-token`, {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
        'Cookie': `RefreshToken=${token.backendTokens.refreshToken}`,
      },
    });    
    
    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }
    
    const response = await res.json();
    const result = {
      ...token,
      backendTokens: response.backendTokens
    };
    // console.log("\n##################Token refreshed successfully: ", result);
    return result;
    
  } catch (error) {
    console.error("Error refreshing token:", error);
    return {
      ...token,
      backendTokens: {
        accessToken: "",
        refreshToken: "",
        accessExpire: 0,
        refreshExpire: 0,
      }
    };
  }
}

// el login ya esta ehcho en el backend por lo que solo tengo que verificar la cookie
// y si existe, ya estoy logueado
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
        // Initial sign in - use the tokens exactly as received
        if (user) {
          console.log("Initial login - using received tokens");
          return {
            ...token,
            ...user,
          };
        }
        
        // If access token hasn't expired, return the current token
        if (token.backendTokens?.accessExpire && Date.now() < token.backendTokens.accessExpire) {
          // console.log("######################## token aun valido ##########################")
          // console.log("iat: ", token.backendTokens?.accessExpire)
          return token; // aún válido
        }
        // Access token has expired, try to refresh
        console.log("Token expired, attempting refresh");
        return await refreshToken(token);
      },
      
        async session({ session, token }) {
           // Copiamos del token a la sesión
           try {
            if (token) {

              // console.log("Token en session callback:", token);
              session.user = {
                id: token.sub || '',
                username: token.username as string,
                email: token.email as string,
                    roles: token.roles as string[],
                    cartId: token.cartId as string,
                    wishlistId: token.wishlistId as string,
                    tokens: {
                      accessToken: token.backendTokens?.accessToken as string,
                      refreshToken: token.backendTokens?.refreshToken as string,
                      accessExpire: token.backendTokens?.accessExpire as number,
                      refreshExpire: token.backendTokens?.refreshExpire as number,
                    }
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