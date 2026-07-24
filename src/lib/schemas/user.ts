import { z } from "zod";

export const userRoles = ["ADMIN", "EDITOR"] as const;

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Informe o nome do servidor.")
    .max(120, "Nome muito longo.")
    .trim(),
  email: z
    .string()
    .min(1, "Informe o e-mail.")
    .email("E-mail inválido.")
    .trim()
    .toLowerCase(),
  role: z.enum(userRoles, { message: "Selecione o perfil de acesso." }),
});

export type UserInput = z.infer<typeof userSchema>;

/** Dados que o próprio servidor pode alterar em "Minha conta". */
export const profileSchema = userSchema.omit({ role: true });

export type ProfileInput = z.infer<typeof profileSchema>;

export const MIN_PASSWORD_LENGTH = 6;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, `A nova senha deve ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`)
      .max(128, "Senha muito longa."),
    confirmPassword: z.string().min(1, "Repita a nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "A confirmação não confere com a nova senha.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "A nova senha deve ser diferente da atual.",
    path: ["newPassword"],
  });

export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

export const roleLabels: Record<(typeof userRoles)[number], string> = {
  ADMIN: "Administrador",
  EDITOR: "Servidor (editor)",
};

export const roleDescriptions: Record<(typeof userRoles)[number], string> = {
  ADMIN: "Importa as planilhas e também cadastra e desativa contas.",
  EDITOR: "Importa as planilhas dos orçamentos e desfaz as próprias importações.",
};
