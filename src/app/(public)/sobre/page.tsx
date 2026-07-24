import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o portal",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sobre o portal</h1>
      <div className="mt-6 space-y-4 text-muted-foreground">
        <p>
          O Portal de Dados Orçamentários reúne, em um único repositório, os
          microdados (dados brutos) dos orçamentos temáticos produzidos pelo
          Departamento de Estudos e Planejamento Orçamentário da Secretaria de
          Planejamento do Estado do Acre (SEPLAN-AC).
        </p>
        <p>
          O objetivo é dar transparência e permitir o uso e reuso dos dados de
          orçamentos temáticos — como o Orçamento Climático e o Orçamento Criança
          e Adolescente — por gestores públicos, pesquisadores e pela sociedade
          civil. As análises e os gráficos tratados a partir desses dados são
          publicados nos sites de cada orçamento.
        </p>
        <p>
          Os dados são consolidados periodicamente pela equipe técnica do
          Departamento a partir dos sistemas orçamentários do Estado e podem ser
          filtrados e baixados em CSV e Excel. Novos orçamentos temáticos, como o
          Orçamento Sensível ao Gênero, serão incorporados progressivamente ao
          portal.
        </p>
      </div>
    </div>
  );
}
