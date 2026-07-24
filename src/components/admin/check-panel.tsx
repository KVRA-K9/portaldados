import { AlertTriangle, CheckCircle2, Circle, ListChecks, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckStatus = "ok" | "warning" | "error" | "pending";

export type CheckItemData = {
  id: string;
  status: CheckStatus;
  title: string;
  description: string;
  /** Como resolver, quando o item não está conferido. */
  hint?: string;
  /** Ação que resolve o problema sem sair da tela (botão, seletor…). */
  action?: React.ReactNode;
};

const STATUS_STYLES: Record<CheckStatus, { row: string; icon: string }> = {
  ok: { row: "border-status-good/30 bg-status-good/5", icon: "text-status-good" },
  warning: { row: "border-status-warning/40 bg-status-warning/10", icon: "text-status-warning" },
  error: { row: "border-destructive/40 bg-destructive/5", icon: "text-destructive" },
  pending: { row: "border-border bg-muted/30", icon: "text-muted-foreground" },
};

function StatusIcon({ status }: { status: CheckStatus }) {
  const className = cn("size-4 shrink-0", STATUS_STYLES[status].icon);
  if (status === "ok") return <CheckCircle2 className={className} aria-hidden="true" />;
  if (status === "warning") return <AlertTriangle className={className} aria-hidden="true" />;
  if (status === "error") return <XCircle className={className} aria-hidden="true" />;
  return <Circle className={className} aria-hidden="true" />;
}

const STATUS_LABEL: Record<CheckStatus, string> = {
  ok: "conferido",
  warning: "atenção",
  error: "erro",
  pending: "pendente",
};

/** Painel de checagens da importação, no padrão dos painéis da SEPLAN. */
export function CheckPanel({
  title = "Painel de checagens",
  items,
  footer,
}: {
  title?: string;
  items: CheckItemData[];
  footer?: React.ReactNode;
}) {
  const count = (status: CheckStatus) => items.filter((item) => item.status === status).length;

  return (
    <section aria-label={title} className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <h2 className="flex items-center gap-2 text-base font-medium">
          <ListChecks className="size-4" aria-hidden="true" />
          {title}
        </h2>
        <div className="flex items-center gap-1.5 text-xs font-medium">
          <span className="rounded-full bg-status-good/15 px-2 py-0.5 text-status-good">
            {count("ok")} ok
          </span>
          <span className="rounded-full bg-status-warning/20 px-2 py-0.5 text-status-warning">
            {count("warning")} av.
          </span>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-destructive">
            {count("error")} er.
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
            {count("pending")} pe.
          </span>
        </div>
      </div>

      <ul className="space-y-2 p-4">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn("flex gap-3 rounded-lg border p-3", STATUS_STYLES[item.status].row)}
          >
            <StatusIcon status={item.status} />
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-medium">
                {item.title}
                <span className="sr-only"> — {STATUS_LABEL[item.status]}</span>
              </p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
              {item.hint ? (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Como resolver: </span>
                  {item.hint}
                </p>
              ) : null}
              {item.action ? <div className="pt-2">{item.action}</div> : null}
            </div>
          </li>
        ))}
      </ul>

      {footer ? <div className="border-t p-4 text-xs text-muted-foreground">{footer}</div> : null}
    </section>
  );
}
