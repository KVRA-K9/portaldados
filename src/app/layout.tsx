import type { Metadata } from "next";
import Script from "next/script";
import { Roboto, Roboto_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Fonte institucional (padrão gov.br) aplicada a todos os textos do portal.
const roboto = Roboto({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portal de Dados Orçamentários",
    template: "%s | Portal de Dados Orçamentários",
  },
  description:
    "Repositório de microdados dos orçamentos temáticos do Departamento de Estudos e Planejamento Orçamentário da Secretaria de Planejamento do Estado do Acre.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {/* Filtro SVG global: visual de desenho/aquarela usado em banners de orçamento. */}
        <svg aria-hidden="true" className="absolute h-0 w-0">
          <filter id="aquarela">
            {/* Ruído orgânico: ondula as bordas como tinta em papel. */}
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="7" result="noise" />
            {/* Cores achatadas e saturadas, como pintura à mão. */}
            <feComponentTransfer in="SourceGraphic" result="poster">
              <feFuncR type="discrete" tableValues="0.1 0.34 0.58 0.8 1" />
              <feFuncG type="discrete" tableValues="0.1 0.34 0.58 0.8 1" />
              <feFuncB type="discrete" tableValues="0.1 0.34 0.58 0.8 1" />
            </feComponentTransfer>
            <feColorMatrix in="poster" type="saturate" values="1.35" result="cores" />
            <feDisplacementMap in="cores" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" result="pintado" />
            {/* Contornos escuros, como traço de caneta sobre o desenho. */}
            <feConvolveMatrix in="SourceGraphic" order="3" kernelMatrix="0 -1 0 -1 4 -1 0 -1 0" preserveAlpha="true" result="contorno" />
            <feColorMatrix
              in="contorno"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.55 0.55 0.55 0 0"
              result="traco"
            />
            <feComposite in="traco" in2="pintado" operator="over" result="desenho" />
            <feGaussianBlur in="desenho" stdDeviation="0.5" />
          </filter>
        </svg>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
