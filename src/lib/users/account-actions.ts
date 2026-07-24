"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireSession } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import {
  passwordChangeSchema,
  profileSchema,
  type PasswordChangeInput,
  type ProfileInput,
} from "@/lib/schemas/user";

type ActionResult = { success: true } | { success: false; error: string };

/** Nome e e-mail da própria conta. O e-mail é o login: passa a valer no próximo acesso. */
export async function updateOwnProfile(input: ProfileInput): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { name, email } = parsed.data;

  const emailOwner = await prisma.user.findUnique({ where: { email } });
  if (emailOwner && emailOwner.id !== session.user.id) {
    return { success: false, error: "Já existe uma conta com este e-mail." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
  });

  revalidatePath("/admin/minha-conta");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

/** Troca de senha da própria conta — disponível a qualquer perfil, não só a ADMIN. */
export async function changeOwnPassword(input: PasswordChangeInput): Promise<ActionResult> {
  const session = await requireSession();

  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { success: false, error: "Conta não encontrada." };

  // Exigir a senha atual impede que uma sessão aberta em máquina alheia troque a senha.
  const currentIsValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!currentIsValid) {
    return { success: false, error: "A senha atual está incorreta." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.newPassword, 12) },
  });

  return { success: true };
}
