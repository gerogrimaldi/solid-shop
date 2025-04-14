import { useRouter } from "next/router";

// utils/fetchWithAuth.ts
export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit,
  router?:  { push: (url: string) => void }// opcional
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  if (response.status === 401) {
    console.log("Intentando refrescar el token...");

    const refresh = await refreshTokenFunction();
    if (!refresh.ok) {
      if (router) router.push('/login'); // solo si lo recibiste
      throw new Error('No se pudo refrescar el token');
    }

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
