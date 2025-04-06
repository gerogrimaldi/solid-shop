// next-auth.d.ts
import NextAuth from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    email?: string;
    roles?: string[];
  }

  interface Session {
    user?: User;
  }

  interface JWT {
    sub?: string;
    username?: string;
    email?: string;
    roles?: string[];
  }
}

declare module "next-auth-jwt" {
  interface JWT {
    sub?: string;
    username?: string;
    email?: string;
    roles?: string[];
  }
}