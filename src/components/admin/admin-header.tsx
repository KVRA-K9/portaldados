import { CalendarRange, RefreshCw } from "lucide-react";
import { SignOutButton } from "./sign-out-button";

/** Faixa institucional do painel administrativo, no padrão dos painéis da SEPLAN. */
export function AdminHeader({
  userEmail,
  updatedAt,
  period,
}: {
  userEmail: string;
  /** Data da importação mais recente entre os orçamentos. */
  updatedAt?: string;
  /** Exercícios cobertos pelos dados publicados. */
  period?: string;
}) {
  return (
    <header className="bg-institutional text-institutional-foreground">
      <div className="mx-auto flex min-h-16 max-w-[1600px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Versão branca com barra dourada (mesma da home). Não é clicável. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-seplan-branco.png"
            alt="SEPLAN — Secretaria de Estado de Planejamento"
            className="h-8 w-auto"
          />
          {/* Mesma cor da barra dourada do logo (#ffcc00). */}
          <span className="hidden h-9 w-[2px] bg-[#ffcc00] sm:block" aria-hidden="true" />
          <div className="leading-tight">
            <p className="text-base font-semibold">Portal de Dados Orçamentários</p>
            <p className="text-xs text-white/75">Secretaria de Estado de Planejamento do Acre</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <div className="space-y-0.5 text-xs text-white/85">
            <p className="flex items-center gap-1.5">
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Atualizado em {updatedAt ?? "—"}
            </p>
            <p className="flex items-center gap-1.5">
              <CalendarRange className="size-3.5" aria-hidden="true" />
              Exercícios: {period ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-xs text-white/75 sm:block">
              {userEmail}
            </span>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
