import { prisma } from "@server/lib/prisma";
import * as bcrypt from "bcrypt";

import { todoData } from "./mockTasks.ts";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@example.io" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.io",
      password: await bcrypt.hash("admin", 10),
      isActive: true,
    },
  });
  await prisma.tasks.createMany({
    data: todoData.map((item) => ({
      taskName: item.task,
      taskDesc: item.description,
      created: new Date(),
      isFinished: false,
      userId: user.id,
    })),
  });
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
