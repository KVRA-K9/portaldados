import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/generated/prisma/client";

declare module "next-auth" {
  interface User {
    role: UserRole;
    /** "Manter conectado" marcado no login. */
    remember?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    /** Momento (epoch em segundos) em que a sessão expira e a senha volta a ser exigida. */
    sessionExpiresAt?: number;
  }
}
