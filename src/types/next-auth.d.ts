// src/types/next-auth.d.ts
import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      avatarId: number;
      streak: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    avatarId: number;
    streak: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    avatarId: number;
    streak: number;
  }
}
