"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { changeOwnPassword } from "@/lib/users/account-actions";
import {
  MIN_PASSWORD_LENGTH,
  passwordChangeSchema,
  type PasswordChangeInput,
} from "@/lib/schemas/user";

export function ChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeInput>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(input: PasswordChangeInput) {
    setFormError(null);
    const result = await changeOwnPassword(input);
    if (result.success) {
      toast.success("Senha alterada. Use a nova senha no próximo acesso.");
      reset();
    } else {
      setFormError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md">
      <FieldGroup>
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="currentPassword">Senha atual</FieldLabel>
          <Input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            {...register("currentPassword")}
          />
          <FieldError errors={errors.currentPassword ? [errors.currentPassword] : undefined} />
        </Field>

        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="newPassword">Nova senha</FieldLabel>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
          />
          <FieldDescription>Ao menos {MIN_PASSWORD_LENGTH} caracteres.</FieldDescription>
          <FieldError errors={errors.newPassword ? [errors.newPassword] : undefined} />
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">Repita a nova senha</FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : undefined} />
        </Field>

        {formError ? (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <KeyRound className="size-4" aria-hidden="true" />
          )}
          Alterar senha
        </Button>
      </FieldGroup>
    </form>
  );
}
