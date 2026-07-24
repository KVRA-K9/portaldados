"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { loginSchema, type LoginInput } from "@/lib/schemas/login";

/** E-mail do último acesso, para preencher o formulário neste navegador. */
const SHORTCUT_EMAIL_KEY = "portal-dados:atalho-email";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authError, setAuthError] = useState<string | null>(null);
  const [askShortcut, setAskShortcut] = useState(false);
  const [savingShortcut, setSavingShortcut] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Atalho salvo antes: já traz o e-mail preenchido.
  useEffect(() => {
    const saved = window.localStorage.getItem(SHORTCUT_EMAIL_KEY);
    if (saved) setValue("email", saved);
  }, [setValue]);

  function goToDestination() {
    const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
    router.push(callbackUrl);
    router.refresh();
  }

  // Entra com sessão curta (12 h) e só então pergunta sobre o atalho.
  async function onSubmit(data: LoginInput) {
    setAuthError(null);
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      remember: "false",
      redirect: false,
    });

    if (result?.error) {
      setAuthError("E-mail ou senha inválidos.");
      return;
    }

    setAskShortcut(true);
  }

  /** "Sim": refaz o login com sessão de 7 dias e guarda o e-mail neste navegador. */
  async function saveShortcut() {
    setSavingShortcut(true);
    const { email, password } = getValues();
    await signIn("credentials", { email, password, remember: "true", redirect: false });
    window.localStorage.setItem(SHORTCUT_EMAIL_KEY, email);
    setAskShortcut(false);
    goToDestination();
  }

  function skipShortcut() {
    window.localStorage.removeItem(SHORTCUT_EMAIL_KEY);
    setAskShortcut(false);
    goToDestination();
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@seplan.ac.gov.br"
              {...register("email")}
            />
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </Field>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            <FieldError errors={errors.password ? [errors.password] : undefined} />
          </Field>
          {authError ? (
            <p role="alert" className="text-sm text-destructive">
              {authError}
            </p>
          ) : null}
          <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="size-4" aria-hidden="true" />
            )}
            Acessar
          </Button>
        </FieldGroup>
      </form>

      <Dialog open={askShortcut} onOpenChange={(open) => (open ? null : skipShortcut())}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar atalho neste dispositivo?</DialogTitle>
            <DialogDescription>
              Você ficará conectado neste navegador por 7 dias, e seu e-mail virá preenchido no
              próximo acesso. Qualquer pessoa com acesso a este computador poderá usar o atalho.
              Você pode encerrá-lo quando quiser em &quot;Sair&quot;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={skipShortcut} disabled={savingShortcut}>
              Não salvar
            </Button>
            <Button onClick={saveShortcut} disabled={savingShortcut} className="gap-2">
              {savingShortcut ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              Sim, salvar atalho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
