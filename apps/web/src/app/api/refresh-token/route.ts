import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Extraer las cookies del request (usando la API de NextRequest)
  const cookieHeader = req.cookies
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  console.log("############# cookies en proxy:" ,cookieHeader, " #############")
  // Redirigir al backend incluyendo las cookies originales
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authorization/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader, // reenviamos cookies del navegador
    },
    credentials: 'include',
  });

  // Recoger el body y las cookies nuevas (si las hay)
  const body = await backendRes.text();

  const response = new NextResponse(body, {
    status: backendRes.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 🔥 Extraemos y reenviamos TODAS las cookies del backend
  const rawSetCookie = backendRes.headers.get('set-cookie');
  console.log("############# cookies SET:", rawSetCookie, " #############")
  if (rawSetCookie) {
    const cookies = rawSetCookie.split(/,(?=\s*\w+=)/); // divide en varias cookies
    for (const cookieStr of cookies) {
      const [nameValue, ...attributes] = cookieStr.split('; ');
      const [name, value] = nameValue.split('=');

      // Agregamos al response usando la API oficial de cookies
      response.cookies.set({
        name: name.trim(),
        value: value.trim(),
        path: '/',
        httpOnly: attributes.includes('HttpOnly'),
        secure: attributes.includes('Secure'),
        sameSite: attributes.find(a => a.startsWith('SameSite'))?.split('=')[1] as 'none' | 'lax' | 'strict' | undefined,
        expires: new Date(attributes.find(a => a.startsWith('Expires='))?.split('=')[1] || ''),
      });
    }
  }

  return response;
}
