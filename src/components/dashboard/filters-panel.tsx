"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DashboardFilterField } from "@/lib/dashboards/types";

/** A lista aberta usa a mesma cor do painel de filtros, com transição curta. */
const FILTER_MENU =
  "border border-[var(--accent-surface-border,#bda878)] bg-[var(--accent-surface,#d6c292)] text-[var(--accent-surface-foreground,#241d10)] ring-0 shadow-lg duration-75 data-open:zoom-in-100 data-closed:zoom-out-100";

const FILTER_ITEM =
  "text-[var(--accent-surface-foreground,#241d10)] focus:bg-[var(--accent-surface-hover,#c9b381)] focus:text-[var(--accent-surface-foreground,#241d10)]";

type FiltersPanelProps = {
  fields: DashboardFilterField[];
  options: Record<string, string[]>;
  /** Classe de paleta do orçamento — precisa ser repetida no menu, que o Radix
   *  renderiza num portal no body, fora do bloco que define as variáveis. */
  paletteClass?: string;
};

export function FiltersPanel({ fields, options, paletteClass }: FiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters = fields.some((field) => searchParams.get(field.key));

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "todos") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    router.push(pathname, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--accent-surface-border,#bda878)] bg-[var(--accent-surface,#d6c292)] p-4 text-[var(--accent-surface-foreground,#241d10)] shadow-sm [--muted-foreground:var(--accent-surface-muted,#3a2f1a)]">
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Filter className="size-4" aria-hidden="true" />
        Filtros
      </div>
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-1">
          <label htmlFor={`filter-${field.key}`} className="sr-only">
            {field.label}
          </label>
          <Select
            value={searchParams.get(field.key) ?? "todos"}
            onValueChange={(value) => setFilter(field.key, value)}
          >
            <SelectTrigger
              id={`filter-${field.key}`}
              className="w-[200px] border-[var(--accent-surface-border,#bda878)] bg-card text-[var(--accent-surface-foreground,#241d10)]"
            >
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            {/* "popper" ancora a lista abaixo do campo. No modo padrão ("item-aligned") o
                Radix alinha o item selecionado ao campo e reposiciona a página — visível
                sobretudo em listas longas, como a de órgãos. */}
            <SelectContent
              position="popper"
              align="start"
              sideOffset={4}
              className={cn(paletteClass, FILTER_MENU)}
            >
              <SelectItem value="todos" className={FILTER_ITEM}>
                {field.label}: todos
              </SelectItem>
              {(options[field.key] ?? []).map((option) => (
                <SelectItem key={option} value={option} className={FILTER_ITEM}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      {hasActiveFilters ? (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5">
          <X className="size-3.5" aria-hidden="true" />
          Limpar filtros
        </Button>
      ) : null}
    </div>
  );
}
