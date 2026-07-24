"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
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
import { updateOwnProfile } from "@/lib/users/account-actions";
import { profileSchema, type ProfileInput } from "@/lib/schemas/user";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, email },
  });

  async function onSubmit(input: ProfileInput) {
    setFormError(null);
    const result = await updateOwnProfile(input);
    if (result.success) {
      toast.success("Dados atualizados.");
      router.refresh();
    } else {
      setFormError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md">
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="profile-name">Nome</FieldLabel>
          <Input id="profile-name" autoComplete="name" {...register("name")} />
          <FieldDescription>Aparece como autor das importações que você fizer.</FieldDescription>
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="profile-email">E-mail</FieldLabel>
          <Input id="profile-email" type="email" autoComplete="email" {...register("email")} />
          <FieldDescription>
            É também o seu login — se alterar, use o novo e-mail no próximo acesso.
          </FieldDescription>
          <FieldError errors={errors.email ? [errors.email] : undefined} />
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
            <Save className="size-4" aria-hidden="true" />
          )}
          Salvar dados
        </Button>
      </FieldGroup>
    </form>
  );
}
