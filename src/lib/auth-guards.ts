import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma/client";

export type ActiveSession = {
  user: { id: string; email: string; name?: string | null; role: UserRole };
};

/**
 * Sessão válida = token assinado + conta ainda ativa no banco.
 * A sessão é JWT: sem esta consulta, quem foi desativado continuaria entrando até o token
 * expirar, e mudanças de perfil só valeriam no próximo login.
 */
export async function getActiveSession(): Promise<ActiveSession | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });
  if (!user || !user.isActive) return null;

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

/** Sessão exigida por qualquer operação do painel administrativo. */
export async function requireSession(): Promise<ActiveSession> {
  const session = await getActiveSession();
  if (!session) {
    throw new Error("Não autenticado ou conta desativada.");
  }
  return session;
}

/** Operações restritas a administradores (gestão de contas). */
export async function requireAdmin(): Promise<ActiveSession> {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    throw new Error("Não autorizado: apenas administradores podem gerenciar contas.");
  }
  return session;
}
