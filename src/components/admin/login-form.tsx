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

/** Preferência do diálogo do atalho neste navegador, para não repeti-lo a cada login:
 *  { decision, until } — `until` é o instante (ms) até quando NÃO perguntar de novo. */
const SHORTCUT_PREF_KEY = "portal-dados:atalho-pref";
const DAY_MS = 24 * 60 * 60 * 1000;
/** "Não salvar": só volta a perguntar no dia seguinte. */
const SKIP_SILENCE_MS = 1 * DAY_MS;
/** "Salvar": só volta a perguntar depois de 7 dias (mesmo prazo da sessão salva). */
const SAVE_SILENCE_MS = 7 * DAY_MS;

type ShortcutPref = { decision: "save" | "skip"; until: number };

function readShortcutPref(): ShortcutPref | null {
  try {
    const raw = window.localStorage.getItem(SHORTCUT_PREF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ShortcutPref;
    if (
      parsed &&
      typeof parsed.until === "number" &&
      (parsed.decision === "save" || parsed.decision === "skip")
    ) {
      return parsed;
    }
  } catch {
    // Valor corrompido: ignora e volta a perguntar.
  }
  return null;
}

function writeShortcutPref(decision: "save" | "skip", silenceMs: number) {
  const pref: ShortcutPref = { decision, until: Date.now() + silenceMs };
  window.localStorage.setItem(SHORTCUT_PREF_KEY, JSON.stringify(pref));
}

/** Estado do atalho neste navegador, já considerando o prazo de silêncio.
 *  `withinSilence`: ainda não é hora de perguntar. `keepSaved`: manter a sessão de 7 dias. */
function getShortcutState(): { withinSilence: boolean; keepSaved: boolean } {
  const pref = readShortcutPref();
  const withinSilence = pref !== null && Date.now() < pref.until;
  return { withinSilence, keepSaved: withinSilence && pref?.decision === "save" };
}

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

  async function onSubmit(data: LoginInput) {
    setAuthError(null);

    // Dentro do período de silêncio, não repetimos o diálogo: aplicamos a última escolha
    // da pessoa neste navegador — sessão de 7 dias se ela salvou, 12 h se não.
    const { withinSilence, keepSaved } = getShortcutState();

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      remember: keepSaved ? "true" : "false",
      redirect: false,
    });

    if (result?.error) {
      setAuthError("E-mail ou senha inválidos.");
      return;
    }

    // Ainda no prazo de silêncio: segue direto, sem perguntar de novo.
    if (withinSilence) {
      if (keepSaved) window.localStorage.setItem(SHORTCUT_EMAIL_KEY, data.email);
      goToDestination();
      return;
    }

    // Primeira entrada (ou prazo expirado): pergunta sobre o atalho.
    setAskShortcut(true);
  }

  /** "Sim": refaz o login com sessão de 7 dias, guarda o e-mail e silencia o diálogo por 7 dias. */
  async function saveShortcut() {
    setSavingShortcut(true);
    const { email, password } = getValues();
    await signIn("credentials", { email, password, remember: "true", redirect: false });
    window.localStorage.setItem(SHORTCUT_EMAIL_KEY, email);
    writeShortcutPref("save", SAVE_SILENCE_MS);
    setAskShortcut(false);
    goToDestination();
  }

  /** "Não salvar" (ou fechar o diálogo): silencia o diálogo até o dia seguinte. */
  function skipShortcut() {
    window.localStorage.removeItem(SHORTCUT_EMAIL_KEY);
    writeShortcutPref("skip", SKIP_SILENCE_MS);
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
