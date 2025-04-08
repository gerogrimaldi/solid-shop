// next-auth.d.ts
import NextAuth from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    email?: string;
    roles?: string[];
    cartId?: string;
    wishlistId?: string;
  }

  interface Session {
    user?: User;
  }

  interface JWT {
    id?: string;
    username?: string;
    email?: string;
    roles?: string[];
    cartId?: string;
    wishlistId?: string;
  }

}

declare module "next-auth-jwt" {
  interface JWT {
    id?: string;
    username?: string;
    email?: string;
    roles?: string[];
    cartId?: string;
    wishlistId?: string;
  }

}