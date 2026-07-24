import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Os dados orçamentários não são semeados: cada orçamento vem da planilha oficial da
// equipe técnica, carregada pelos scripts `npm run import:clima` e `npm run import:ocad`.
async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD não definidos — pulando criação do usuário administrador."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, passwordHash, role: "ADMIN", name: "Administrador SEPLAN" },
  });
  console.log(`Usuário administrador pronto: ${email}`);
}

async function main() {
  await seedAdminUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
