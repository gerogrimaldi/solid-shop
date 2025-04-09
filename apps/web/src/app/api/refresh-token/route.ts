import { NextResponse } from 'next/server';

export async function POST() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/authorization/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Proxy las cookies y status
  const body = await res.text();
  const response = new NextResponse(body, {
    status: res.status,
    headers: {
      'set-cookie': res.headers.get('set-cookie') || '',
    },
  });

  return response;
}
