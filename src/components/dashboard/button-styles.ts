/** Botão de vidro sobre fotografia — usado nos cartões dos orçamentos e nos links
 *  que ficam sobre as imagens de fundo do portal. */
export const glassButton =
  "inline-flex items-center gap-1.5 rounded-md bg-white/15 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25";

/** Variante não clicável, para recursos ainda "em construção". */
export const glassButtonDisabled =
  "inline-flex cursor-not-allowed items-center gap-1.5 rounded-md bg-white/5 px-3 py-1.5 text-sm font-medium text-white/60 ring-1 ring-white/15 backdrop-blur-sm";

/** Botões "outline" no realce da paleta do orçamento (ver `paletteClass` no registry).
 *  Sem paleta aplicada, o fallback é o tom areia usado antes das paletas. */
export const sandOutlineButton =
  "border-[var(--accent-surface-border,#bda878)] bg-[var(--accent-surface,#d6c292)] text-[var(--accent-surface-foreground,#241d10)] hover:bg-[var(--accent-surface-hover,#c9b381)] hover:text-[var(--accent-surface-foreground,#241d10)] dark:border-[var(--accent-surface-border,#bda878)] dark:bg-[var(--accent-surface,#d6c292)] dark:hover:bg-[var(--accent-surface-hover,#c9b381)]";
