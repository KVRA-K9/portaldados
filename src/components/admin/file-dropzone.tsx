"use client";

import { useRef, useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

/** Área de "clique ou arraste" para a planilha, no padrão dos painéis da SEPLAN. */
export function FileDropzone({
  file,
  onSelect,
  accept = ".xlsx,.csv",
  disabled = false,
}: {
  file: File | null;
  onSelect: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    setIsOver(false);
    if (disabled) return;
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) onSelect(dropped);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={cn(
        "rounded-lg border border-dashed transition-colors",
        isOver ? "border-primary bg-primary/5" : "border-input bg-background",
        disabled && "opacity-60"
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <FileSpreadsheet className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 text-sm">
          {file ? (
            <>
              <span className="block truncate font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 0 })} KB · clique
                para trocar
              </span>
            </>
          ) : (
            <>
              <span className="font-medium">Clique ou arraste</span>{" "}
              <span className="text-muted-foreground">o arquivo {accept.replace(/,/g, " ou ")}</span>
            </>
          )}
        </span>
        <Upload className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
