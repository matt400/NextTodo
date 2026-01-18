import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcrypt";

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.io" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.io",
      password: await bcrypt.hash("admin", 10),
      isActive: true,
    },
  });
  console.log({ admin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
