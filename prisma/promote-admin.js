/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const emailArg = process.argv[2];

if (!emailArg) {
  console.error("Failure: Please provide an email address.");
  console.error("Usage: node prisma/promote-admin.js user@example.com");
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log(`Failure: User with email ${email} not found.`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  console.log(`Success: Promoted user ${email} to ADMIN.`);
}

main()
  .catch((e) => {
    console.error(`Failure: Error promoting user ${email}:`, e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
