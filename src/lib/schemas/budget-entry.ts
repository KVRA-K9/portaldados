import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const budgetEntrySchema = z.object({
  fiscalYear: z.coerce
    .number({ error: "Informe o exercício." })
    .int("O exercício deve ser um número inteiro.")
    .min(2000, "Exercício inválido.")
    .max(2100, "Exercício inválido."),
  categoryId: z.string().min(1, "Selecione uma categoria."),
  region: optionalText,
  fundingSource: optionalText,
  agency: optionalText,
  managementUnit: optionalText,
  program: optionalText,
  action: optionalText,
  description: optionalText,
  valuePlanned: z.coerce
    .number({ error: "Informe o valor planejado." })
    .nonnegative("O valor planejado não pode ser negativo."),
  valueCommitted: z.coerce
    .number()
    .nonnegative("O valor empenhado não pode ser negativo.")
    .optional(),
  valueExecuted: z.coerce
    .number()
    .nonnegative("O valor executado não pode ser negativo.")
    .optional(),
  valuePaid: z.coerce.number().nonnegative("O valor pago não pode ser negativo.").optional(),
});

// Valores brutos do formulário, antes da coerção do zod (números podem chegar como string).
export type BudgetEntryFormValues = z.input<typeof budgetEntrySchema>;
// Valores validados/coeridos, usados pelas Server Actions.
export type BudgetEntryInput = z.output<typeof budgetEntrySchema>;

// Formato esperado das colunas em uma planilha de importação (mesmas regras de validação da entrada manual).
export const budgetEntryImportRowSchema = budgetEntrySchema
  .omit({ categoryId: true })
  .extend({
    categoryName: z.string().min(1, "Informe a categoria."),
  });

export type BudgetEntryImportRow = z.infer<typeof budgetEntryImportRowSchema>;
