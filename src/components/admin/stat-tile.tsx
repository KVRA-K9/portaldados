import { cn } from "@/lib/utils";

/** Rótulo + número, usado nos cabeçalhos das telas do admin. Cores por token, para
 *  acompanhar a superfície em que estiver (clara ou vidro — ver .glass-surface). */
export function StatTile({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border bg-muted p-4", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
