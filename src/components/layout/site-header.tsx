import Link from "next/link";
import { Lock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// "Início" abre a porta de entrada (/); "Sobre" e "Orçamentos" levam ao portal (/portal).
const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/portal#paineis", label: "Orçamentos" },
  { href: "/portal#sobre-portal", label: "Sobre" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="https://seplan.ac.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-seplan.svg"
            alt="SEPLAN — Secretaria de Estado de Planejamento"
            className="h-7 w-auto sm:h-8"
          />
        </a>
        <div className="flex items-center gap-2">
          <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button asChild variant="outline" size="sm" className="hidden gap-1.5 md:inline-flex">
            <Link href="/admin/login">
              <Lock className="size-3.5" aria-hidden="true" />
              Acesso administrativo
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Abrir menu de navegação">
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {NAV_LINKS.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link href="/admin/login">
                  <Lock className="size-3.5" aria-hidden="true" />
                  Acesso administrativo
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
