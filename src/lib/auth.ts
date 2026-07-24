import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";

/** "Manter conectado": a sessão vale 7 dias corridos a partir do login. */
export const REMEMBER_ME_SECONDS = 7 * 24 * 60 * 60;
/** Sem "manter conectado": a sessão dura o expediente. */
const DEFAULT_SESSION_SECONDS = 12 * 60 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Teto do cookie/JWT; o prazo real de cada sessão é decidido no callback `jwt`.
  session: { strategy: "jwt", maxAge: REMEMBER_ME_SECONDS },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
        remember: { label: "Manter conectado", type: "checkbox" },
      },
      authorize: async (credentials) => {
        const email = typeof credentials?.email === "string" ? credentials.email : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        // Conta desativada não entra, mesmo com a senha correta.
        if (!user || user.isActive === false) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          remember: credentials.remember === "true" || credentials.remember === true,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // Prazo absoluto: contado do login, não renovado pelo uso.
        token.sessionExpiresAt =
          Math.floor(Date.now() / 1000) +
          (user.remember ? REMEMBER_ME_SECONDS : DEFAULT_SESSION_SECONDS);
      }

      // Vencido: derruba a sessão e a senha volta a ser exigida.
      const expiresAt = typeof token.sessionExpiresAt === "number" ? token.sessionExpiresAt : null;
      if (expiresAt !== null && Math.floor(Date.now() / 1000) > expiresAt) {
        return null;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      const expiresAt = typeof token.sessionExpiresAt === "number" ? token.sessionExpiresAt : null;
      if (expiresAt !== null) {
        session.expires = new Date(expiresAt * 1000).toISOString() as typeof session.expires;
      }
      return session;
    },
  },
});
