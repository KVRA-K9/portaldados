import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acessibilidade",
};

export default function AcessibilidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Compromisso com a acessibilidade
      </h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          Este portal busca seguir as diretrizes de acessibilidade do Modelo de
          Acessibilidade em Governo Eletrônico (eMAG) e as recomendações WCAG,
          incluindo:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Contraste adequado entre texto e plano de fundo.</li>
          <li>Navegação completa via teclado em menus, filtros e tabelas.</li>
          <li>
            Os microdados são apresentados em tabelas navegáveis por teclado e
            leitores de tela, com opção de download em CSV e Excel.
          </li>
          <li>Textos alternativos em ícones e elementos não textuais.</li>
        </ul>
        <p>
          Caso identifique alguma barreira de acessibilidade neste portal, entre
          em contato com o Departamento de Estudos e Planejamento Orçamentário
          da SEPLAN-AC.
        </p>
      </div>
    </div>
  );
}
