This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Acesso ao painel administrativo

O painel fica em `/admin` e usa e-mail + senha.

1. **Primeiro administrador**: definido em `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` e criado por
   `npx prisma db seed`. É a única conta que nasce fora do produto.
2. **Demais servidores**: o administrador abre a aba **Usuários**, informa nome, e-mail
   institucional e perfil. O sistema gera uma **senha provisória, exibida uma única vez** — copie e
   entregue ao servidor.
3. **Perfis**: `Administrador` importa planilhas e gerencia contas; `Servidor (editor)` importa
   planilhas, mas não vê a aba de usuários.
4. **Primeiro acesso**: cada servidor deve abrir **Minha conta** e trocar a senha provisória por uma
   que só ele conheça — a provisória é conhecida por quem cadastrou.
5. **Esqueceu a senha**: o administrador usa *Redefinir senha* e entrega a nova senha provisória. A
   anterior deixa de valer na hora.
6. **Saída do setor**: use *Desativar* em vez de excluir — a conta perde o acesso e o histórico de
   quem importou cada planilha é preservado.

## Atualização dos dados

Os microdados de cada orçamento vêm da planilha oficial exportada do respectivo dashboard
interativo. Na aba do orçamento, envie o arquivo, confira o **Painel de checagens** e importe:

- **Substituir exercício** (padrão): apaga os registros dos exercícios contidos na planilha e
  regrava tudo a partir do arquivo — reenviar o mesmo arquivo corrige os dados sem duplicar;
- **Mesclar**: acrescenta as linhas aos registros já publicados;
- o **histórico** registra arquivo, autor e data, e permite desfazer um envio.

As colunas esperadas de cada orçamento ficam em `src/lib/import/profiles.ts`, que também alimenta o
dicionário de dados e as colunas publicadas — mudou a planilha, ajuste o perfil.

Para a carga inicial pelo terminal: `npm run import:clima` e `npm run import:ocad`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
