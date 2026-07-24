"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  roleDescriptions,
  roleLabels,
  userRoles,
  userSchema,
  type UserInput,
} from "@/lib/schemas/user";

export function UserForm({
  onSubmit,
}: {
  onSubmit: (input: UserInput) => Promise<{ ok: boolean; error?: string }>;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", role: "EDITOR" },
  });

  const role = watch("role");

  async function submit(input: UserInput) {
    const result = await onSubmit(input);
    if (result.ok) reset({ name: "", email: "", role: "EDITOR" });
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <FieldGroup className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Nome</FieldLabel>
          <Input id="name" autoComplete="off" placeholder="Nome do servidor" {...register("name")} />
          <FieldError errors={errors.name ? [errors.name] : undefined} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail institucional</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="servidor@seplan.ac.gov.br"
            {...register("email")}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </Field>

        <Field data-invalid={!!errors.role}>
          <FieldLabel htmlFor="role">Perfil de acesso</FieldLabel>
          <Select value={role} onValueChange={(value) => setValue("role", value as UserInput["role"])}>
            <SelectTrigger id="role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" sideOffset={4}>
              {userRoles.map((value) => (
                <SelectItem key={value} value={value}>
                  {roleLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>{roleDescriptions[role]}</FieldDescription>
          <FieldError errors={errors.role ? [errors.role] : undefined} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="mt-4 gap-2">
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <UserPlus className="size-4" aria-hidden="true" />
        )}
        Cadastrar servidor
      </Button>
    </form>
  );
}
