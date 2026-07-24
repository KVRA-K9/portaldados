"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { userSchema, type UserInput } from "@/lib/schemas/user";
import type { UserRole } from "@/generated/prisma/client";

type ActionResult = { success: true } | { success: false; error: string };
/** A senha provisória só existe em claro aqui, no retorno para a tela que a exibe. */
type PasswordResult =
  | { success: true; email: string; temporaryPassword: string }
  | { success: false; error: string };

const PASSWORD_BYTES = 12; // ~16 caracteres em base64url

function generateTemporaryPassword(): string {
  return randomBytes(PASSWORD_BYTES).toString("base64url");
}

export async function createUser(input: UserInput): Promise<PasswordResult> {
  const session = await requireAdmin();

  const parsed = userSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { name, email, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Já existe uma conta com este e-mail." };
  }

  const temporaryPassword = generateTemporaryPassword();
  await prisma.user.create({
    data: {
      name,
      email,
      role,
      passwordHash: await bcrypt.hash(temporaryPassword, 12),
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/usuarios");
  return { success: true, email, temporaryPassword };
}

export async function resetUserPassword(userId: string): Promise<PasswordResult> {
  await requireAdmin();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "Conta não encontrada." };

  const temporaryPassword = generateTemporaryPassword();
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await bcrypt.hash(temporaryPassword, 12) },
  });

  revalidatePath("/admin/usuarios");
  return { success: true, email: user.email, temporaryPassword };
}

export async function setUserActive(userId: string, isActive: boolean): Promise<ActionResult> {
  const session = await requireAdmin();

  // Sem esta trava o portal pode ficar sem nenhum administrador ativo.
  if (userId === session.user.id && !isActive) {
    return { success: false, error: "Você não pode desativar a própria conta." };
  }

  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  revalidatePath("/admin/usuarios");
  return { success: true };
}

export async function updateUserRole(userId: string, role: UserRole): Promise<ActionResult> {
  const session = await requireAdmin();

  if (userId === session.user.id && role !== "ADMIN") {
    return { success: false, error: "Você não pode alterar o próprio perfil de acesso." };
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/usuarios");
  return { success: true };
}
