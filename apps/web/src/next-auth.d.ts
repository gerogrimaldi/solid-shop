
import NextAuth from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface User {
    sub?: string;
    username?: string;
    email?: string;
    roles?: string[];
    cartId?: string;
    wishlistId?: string;
    tokens?: backendTokens;
  }
  interface backendTokens {
    accessToken: string;
    refreshToken: string;
    accessExpire: number,
    refreshExpire: number,
  }
  interface Session {
    user?: User;
  }

  interface JWT {
    sub?: string;
    username?: string;
    email?: string;
    roles?: string[];
    cartId?: string;
    wishlistId?: string;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
      accessExpire: number,
      refreshExpire: number,
    }
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    username?: string;
    email?: string;
    roles?: string[];
    cartId?: string;
    wishlistId?: string;
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
      accessExpire: number;
      refreshExpire: number;
    };
  }
}