import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Mantém o payload das rotas dinâmicas (metadados/microdados) no cache do cliente,
    // para revisitas serem instantâneas e o "Carregando" só aparecer em último caso.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
