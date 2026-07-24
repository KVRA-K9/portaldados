import { getDashboardConfig } from "@/lib/dashboards/registry";
import { getTableColumns } from "@/lib/dashboards/table-columns";
import type { DashboardTableColumn, DerivedColumnKey } from "@/lib/dashboards/types";
import { getImportProfile, KIND_LABELS, type ImportProfile } from "./profiles";

export type DictionaryField = {
  field: string;
  description: string;
  type: string;
  required: boolean;
};

/** Colunas calculadas na publicação que não vêm de nenhuma coluna da planilha. */
const DERIVED_FIELDS: Record<DerivedColumnKey, { description: string; type: string }> = {
  executionRate: {
    description: "Percentual do valor planejado que já foi executado (executado ÷ planejado).",
    type: "Percentual (%)",
  },
  agencyCode: {
    description: "Código da unidade orçamentária (derivado do órgão completo).",
    type: KIND_LABELS.text,
  },
  agencyName: {
    description: "Sigla do órgão (derivada do órgão completo).",
    type: KIND_LABELS.text,
  },
  categoryNumber: {
    description: "Numeral do eixo (derivado do eixo).",
    type: KIND_LABELS.text,
  },
};

/** Descreve uma coluna publicada: usa o perfil da planilha quando a coluna vem dela e,
 *  nas colunas só calculadas na tela, o catálogo de derivadas. */
function describeColumn(
  column: DashboardTableColumn,
  profile: ImportProfile
): DictionaryField {
  const source = profile.columns.find((c) => (c.field ?? c.derivedKey) === column.key);

  if (!source) {
    const derived = DERIVED_FIELDS[column.key as DerivedColumnKey];
    return {
      field: column.label,
      description: derived?.description ?? "",
      type: derived?.type ?? KIND_LABELS.text,
      required: false,
    };
  }

  const note = profile.dictionaryNotes?.[source.header];
  return {
    // Rótulo como aparece na tabela de microdados do orçamento.
    field: column.label,
    description: note ? `${source.description} ${note}` : source.description,
    type: KIND_LABELS[source.kind],
    required: source.required,
  };
}

/**
 * Dicionário de dados publicado — descreve exatamente as colunas que o orçamento mostra
 * na tabela de microdados, na mesma ordem, para que as duas seções da página de metadados
 * nunca divirjam.
 */
export function getDataDictionary(slug?: string): DictionaryField[] {
  const profile = getImportProfile(slug ?? "");
  const config = getDashboardConfig(slug ?? "");

  // Sem orçamento cadastrado, resta descrever o formato da planilha de importação.
  if (!config) {
    return profile.columns
      .filter((column) => column.field || column.derivedKey)
      .map((column) =>
        describeColumn({ key: (column.field ?? column.derivedKey)!, label: column.label }, profile)
      );
  }

  return getTableColumns(config).map((column) => describeColumn(column, profile));
}
