import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Acesso administrativo",
};

export default function AdminLoginPage() {
  return (
    <div className="relative isolate flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      {/* Fundo: bandeira do Acre na cheia do Rio Acre */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url(/login-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden="true" />

      {/* Mesmo vidro dos cartões do painel administrativo: a classe também acerta as
          cores do formulário (ver .glass-surface em globals.css). */}
      <Card className="glass-surface w-full max-w-sm ring-institutional-gold/30">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-11 items-center justify-center rounded-lg bg-institutional text-institutional-foreground">
            <Upload className="size-5" aria-hidden="true" />
          </span>
          <CardTitle>Importação de dados</CardTitle>
          <CardDescription>
            Área administrativa restrita à equipe do Departamento de Estudos e
            Planejamento Orçamentário.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
      <Link
        href="/"
        className="text-readable inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-white"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar à página inicial
      </Link>

      <p className="absolute bottom-2 right-3 text-[11px] text-white/60">
        Foto: Diego Gurgel — Governo do Acre
      </p>
    </div>
  );
}
