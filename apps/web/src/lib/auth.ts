// lib/auth.ts
import { jwtVerify } from 'jose';

export async function verifyToken(token: string): Promise<{ isValid: boolean; payload?: any }> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return { isValid: true, payload };
  } catch (error) {
    return { isValid: false };
  }
}