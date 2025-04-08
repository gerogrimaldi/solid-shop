// utils/fetchWithAuth.ts
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const response = await fetch(input, {
      ...init,
      credentials: 'include',
    });
  
    // Si el token está vencido y obtenemos un 401
    if (response.status === 401) {
      console.log("Intentando refrescar el token...");
      const refresh = await fetch('/api/refresh-token', { credentials: 'include' });
  
      if (!refresh.ok) {
        throw new Error('No se pudo refrescar el token');
      }
  
      // Intentar de nuevo la petición original con el nuevo token
      return await fetch(input, {
        ...init,
        credentials: 'include',
      });
    }
  
    return response;
  }
  