import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

interface TokenPayload extends JWTPayload{
  sub: string;
  username: string;
  email: string;
  roles: string[];
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("Authentication")?.value;
  const refreshToken = request.cookies.get("RefreshToken")?.value;

  // Redirige si no hay token y quiere acceder a /admin
  if (!token && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
  }

  // Redirige si no hay token y quiere acceder a /cart
  if (!token && request.nextUrl.pathname.startsWith("/cart")) {
    if(!refreshToken) {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
    }else{

    }
  }
  // Redirige si no hay token y quiere acceder a /wishlist
  if (!token && request.nextUrl.pathname.startsWith("/wishlist")) {
    if(!refreshToken) {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
    }else{
      
    }
  }

  try {
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const user = payload as TokenPayload;

      // Si el usuario no tiene el rol ADMIN y accede a /admin
      if (
        request.nextUrl.pathname.startsWith("/admin") &&
        !user.roles.includes("ADMIN")
      ) {
        return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    // Cualquier error al verificar, redirige si está en /admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cart/:path*", "/wishlist/:path*"],
};
