"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type AdminTab = { href: string; label: string };

type Indicator = { left: number; top: number; width: number; height: number };

function tabIsActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Navegação do admin em abas no rodapé, no padrão dos painéis da SEPLAN.
 *  A marcação da aba ativa é uma pílula única que DESLIZA entre as abas. Ao clicar, a pílula
 *  reage no instante do clique (índice otimista), sem esperar a navegação concluir — o que
 *  mantém a troca fluida mesmo quando a página de destino demora a carregar. */
export function AdminTabs({ tabs }: { tabs: AdminTab[] }) {
  const pathname = usePathname();

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  // Habilita a transição só depois do 1º posicionamento (evita a pílula "vir do canto").
  const animatedRef = useRef(false);

  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [animate, setAnimate] = useState(false);
  // Aba escolhida no clique, antes de a navegação atualizar o pathname.
  const [optimisticIndex, setOptimisticIndex] = useState<number | null>(null);

  // Reconcilia durante a renderização (padrão recomendado do React em vez de um efeito): quando o
  // pathname muda — navegação concluída ou voltar/avançar do navegador —, larga o índice otimista.
  const [syncedPathname, setSyncedPathname] = useState(pathname);
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    setOptimisticIndex(null);
  }

  const pathActiveIndex = tabs.findIndex((tab) => tabIsActive(tab.href, pathname));
  const activeIndex = optimisticIndex ?? pathActiveIndex;

  // Mede a aba ativa e posiciona a pílula. Roda no mount, ao trocar de aba e ao redimensionar.
  useLayoutEffect(() => {
    function measure() {
      const el = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      if (!el) {
        setIndicator(null);
        return;
      }
      setIndicator({
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
      // Primeiro posicionamento sem animação; a partir do próximo frame, desliza.
      if (!animatedRef.current) {
        animatedRef.current = true;
        requestAnimationFrame(() => setAnimate(true));
      }
    }

    measure();

    window.addEventListener("resize", measure);
    // Larguras podem mudar quando a fonte termina de carregar — realinha nesse momento.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  return (
    <nav
      aria-label="Seções do painel administrativo"
      className="sticky bottom-0 z-30 border-t bg-background/95 backdrop-blur"
    >
      <ul
        ref={listRef}
        className="relative mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-1 px-4 py-2"
      >
        {/* Pílula deslizante (fundo do ativo). Decorativa. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute left-0 top-0 rounded-full bg-institutional",
            "transition-[left,top,width,height,opacity] duration-200 ease-out motion-reduce:transition-none",
            indicator ? "opacity-100" : "opacity-0",
            animate ? "" : "transition-none"
          )}
          style={
            indicator
              ? {
                  left: indicator.left,
                  top: indicator.top,
                  width: indicator.width,
                  height: indicator.height,
                }
              : undefined
          }
        />
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <li
              key={tab.href}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
            >
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOptimisticIndex(index)}
                className={cn(
                  "relative z-10 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-institutional-foreground"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground"
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
