"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type AdminTab = { href: string; label: string };

/** Navegação do admin em abas no rodapé, no padrão dos painéis da SEPLAN. */
export function AdminTabs({ tabs }: { tabs: AdminTab[] }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Seções do painel administrativo"
      className="sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-1 px-4 py-2">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={isActive(tab.href) ? "page" : undefined}
              className={cn(
                "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive(tab.href)
                  ? "bg-institutional text-institutional-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
