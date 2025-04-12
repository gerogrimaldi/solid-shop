// utils/fetchWithAuth.ts
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: 'include', // importante para que se envíen las cookies
  });

  if (response.status === 401) {
    console.log("Intentando refrescar el token...");

    const refresh = await refreshTokenFunction();
    if (!refresh.ok) {
      throw new Error('No se pudo refrescar el token');
    }

    // Reintentar la petición original
    return await fetch(input, {
      ...init,
      credentials: 'include',
    });
  }

  return response;
}

export async function refreshTokenFunction(): Promise<Response> {
  return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authorization/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
}
